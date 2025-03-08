import React, { useState, useEffect, useRef, useMemo } from "react";
import { styled } from "@mui/material/styles";
import {
  Card,
  CardHeader,
  CardContent,
  Chip,
  Button,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";

const ActionButton = styled(Button)(({ theme }) => ({
  fontWeight: 'bold',
  textTransform: 'none',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
  '&:hover': {
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
  },
}));

const CollectedButton = styled(ActionButton)(({ theme }) => ({
  backgroundColor: '#4CAF50',
  color: 'white',
  '&:hover': {
    backgroundColor: '#45a049',
  },
}));

const NotCollectedButton = styled(ActionButton)(({ theme }) => ({
  backgroundColor: '#2196F3',
  color: 'white',
  '&:hover': {
    backgroundColor: '#1E88E5',
  },
}));

function TicketTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const isUpdating = useRef(false);

  // Khởi tạo dữ liệu
  useEffect(() => {
    const storedTransactions = localStorage.getItem('transactions');
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    } else {
      fetchTransactions();
    }
  }, []);

  // Fetch dữ liệu từ API
  const fetchTransactions = () => {
    fetch('http://localhost:5000/api/pay/transactions')
      .then(response => response.json())
      .then(data => {
        setTransactions(data);
        localStorage.setItem('transactions', JSON.stringify(data));
      })
      .catch(error => console.error('Error:', error));
  };
  useEffect(() => {
    fetchTransactions(); // Initial fetch

    // Set up polling every 30 seconds
    const intervalId = setInterval(() => {
      fetchTransactions();
    }, 30000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  

  // Xử lý thay đổi trạng thái
  const handleStatusChange = (transactionId, currentStatus) => {
    isUpdating.current = true;
    const newStatus = currentStatus === "Collected" ? "Not Collected" : "Collected";
    
    setTransactions(prev => prev.map(t => 
      t.transactionId === transactionId ? {...t, ticketStatus: newStatus} : t
    ));
    
    // Cập nhật localStorage
    const updated = transactions.map(t => 
      t.transactionId === transactionId ? {...t, ticketStatus: newStatus} : t
    );
    localStorage.setItem('transactions', JSON.stringify(updated));
  };

  // Tối ưu hóa tạo rows
  const rows = useMemo(() => transactions.map(t => ({
    id: t.transactionId, // Key ổn định
    transactionId: t.transactionId,
    amount: `${t.amount.toFixed(2)} VND`,
    orderDescription: t.orderDescription,
    paymentStatus: (
      <Chip
        label={t.paymentStatus}
        color={t.paymentStatus === "Success" ? "success" : "error"}
      />
    ),
    paymentMethod: t.paymentMethod,
    ticketStatus: (
      <Chip
        label={t.ticketStatus || "Not Collected"}
        color={t.ticketStatus === "Collected" ? "success" : "warning"}
      />
    ),
    action: t.ticketStatus === "Collected" ? (
      <NotCollectedButton
        onClick={() => handleStatusChange(t.transactionId, t.ticketStatus)}
      >
        Mark Uncollected
      </NotCollectedButton>
    ) : (
      <CollectedButton
        onClick={() => handleStatusChange(t.transactionId, t.ticketStatus)}
      >
        Mark Collected
      </CollectedButton>
    )
  })), [transactions]);

  // Xử lý giữ nguyên trang
  useEffect(() => {
    if (isUpdating.current) {
      const timer = setTimeout(() => {
        setCurrentPage(p => {
          isUpdating.current = false;
          return p;
        });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [transactions]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Card>
          <CardHeader
            title={<MDTypography variant="h6" color="white">Ticket Transactions</MDTypography>}
            sx={{ bgcolor: '#1A73E8' }}
          />
          <CardContent>
            <DataTable
              table={{ 
                columns: [
                  { Header: "Transaction ID", accessor: "transactionId", width: "15%" },
                  { Header: "Amount", accessor: "amount", width: "15%" },
                  { Header: "Description", accessor: "orderDescription", width: "25%" },
                  { Header: "Payment Status", accessor: "paymentStatus", width: "15%" },
                  { Header: "Method", accessor: "paymentMethod", width: "15%" },
                  { Header: "Ticket Status", accessor: "ticketStatus", width: "15%" },
                  { Header: "Action", accessor: "action", width: "15%" },
                ],
                rows,
                getRowId: (row) => row.id // Bắt buộc thêm dòng này
              }}
              pagination={{
                page: currentPage,
                onPageChange: (page) => !isUpdating.current && setCurrentPage(page)
              }}
              canSearch
              entriesPerPage={{ default: 10 }}
              noEndBorder
            />
          </CardContent>
        </Card>
      </MDBox>
    </DashboardLayout>
  );
}

export default TicketTransactions;