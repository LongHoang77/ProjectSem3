import React, { useState, useEffect, useRef, useMemo } from "react";
import { styled } from "@mui/material/styles";
import {
  Card,
  CardHeader,
  CardContent,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
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

function TicketTypes() {
  const [ticketTypes, setTicketTypes] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTicketType, setEditingTicketType] = useState(null);
  const isUpdating = useRef(false);

  useEffect(() => {
    fetchTicketTypes();
  }, []);

  const fetchTicketTypes = () => {
    fetch('http://localhost:5000/api/ticket/alltickettypes')
      .then(response => response.json())
      .then(data => {
        setTicketTypes(data);
      })
      .catch(error => console.error('Error:', error));
  };

  const handleAddTicketType = () => {
    setEditingTicketType(null);
    setIsDialogOpen(true);
  };

  const handleEditTicketType = (ticketType) => {
    setEditingTicketType(ticketType);
    setIsDialogOpen(true);
  };

  const handleDeleteTicketType = (ticketTypeId) => {
    fetch(`http://localhost:5000/api/ticket/delete/{id}`, {
      method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      fetchTicketTypes(); // Refresh the list after deletion
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingTicketType(null);
  };

  const handleDialogSave = (ticketTypeData) => {
    if (editingTicketType) {
      // Update existing ticket type
      fetch(`http://localhost:5000/api/ticket/update/${editingTicketType.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketTypeData),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        handleDialogClose();
        fetchTicketTypes(); // Refresh the list after updating
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    } else {
      // Add new ticket type
      fetch('http://localhost:5000/api/ticket/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketTypeData),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        handleDialogClose();
        fetchTicketTypes(); // Refresh the list after adding
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }
  };

  const rows = useMemo(() => ticketTypes.map(t => ({
    id: t.id,
    name: t.name,
    price: `${t.price.toFixed(2)} VND`,
    description: t.description,
    status: (
      <Chip
        label={t.isActive ? "Active" : "Inactive"}
        color={t.isActive ? "success" : "error"}
      />
    ),
    action: (
      <>
        <ActionButton onClick={() => handleEditTicketType(t)}>
          Edit
        </ActionButton>
        <ActionButton onClick={() => handleDeleteTicketType(t.id)}>
          Delete
        </ActionButton>
      </>
    )
  })), [ticketTypes]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Card>
          <CardHeader
            title={<MDTypography variant="h6" color="white">Ticket Types</MDTypography>}
            action={
              <Button color="inherit" onClick={handleAddTicketType}>
                Add New Ticket Type
              </Button>
            }
            sx={{ bgcolor: '#1A73E8' }}
          />
          <CardContent>
            <DataTable
              table={{ 
                columns: [
                  { Header: "Name", accessor: "name", width: "20%" },
                  { Header: "Price", accessor: "price", width: "20%" },
                  { Header: "Description", accessor: "description", width: "30%" },
                  { Header: "Status", accessor: "status", width: "15%" },
                  { Header: "Action", accessor: "action", width: "15%" },
                ],
                rows,
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
      <TicketTypeDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        onSave={handleDialogSave}
        ticketType={editingTicketType}
      />
    </DashboardLayout>
  );
}

function TicketTypeDialog({ open, onClose, onSave, ticketType }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (ticketType) {
      setName(ticketType.name);
      setPrice(ticketType.price.toString());
      setDescription(ticketType.description);
      setIsActive(ticketType.isActive);
    } else {
      setName('');
      setPrice('');
      setDescription('');
      setIsActive(true);
    }
  }, [ticketType]);

  const handleSave = () => {
    onSave({
      name,
      price: parseFloat(price),
      description,
      isActive
    });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{ticketType ? 'Edit Ticket Type' : 'Add New Ticket Type'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Name"
          type="text"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Price"
          type="number"
          fullWidth
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Description"
          type="text"
          fullWidth
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <FormControlLabel
          control={
            <Switch
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              color="primary"
            />
          }
          label="Active"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

export default TicketTypes;