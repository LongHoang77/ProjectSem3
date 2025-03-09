import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";

function Dashboard() {
  const { sales, tasks } = reportsLineChartData;
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [yesterdayRevenue, setYesterdayRevenue] = useState(0);
  const [percentageChange, setPercentageChange] = useState(0);
  const [activeMoviesCount, setActiveMoviesCount] = useState(0);
  const [ticketsSold, setTicketsSold] = useState(0);
  const [userCount, setUserCount] = useState(0);


  useEffect(() => {
    fetchTransactions();
    fetchActiveMoviesCount();
    fetchTicketCount();
    fetchUserCount();

  
    const intervalId = setInterval(() => {
      fetchTransactions();
      fetchActiveMoviesCount();
      fetchTicketCount();
      fetchUserCount();

    }, 10000);
  
    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const fetchTicketCount = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/pay/transaction-count');
      const data = await response.json();
      setTicketsSold(data.successfulTransactions || 0);
    } catch (error) {
      console.error('Error fetching ticket count:', error);
    }
  };

  const fetchActiveMoviesCount = async () => {
    try {
      // Instead of fetching all movies, let's just get the count
      const response = await fetch('http://localhost:5000/Movie/count');
      const data = await response.json();
      console.log('Active movies count:', data);
      setActiveMoviesCount(data.count || 0);
    } catch (error) {
      console.error('Error fetching active movies count:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/pay/transactions');
      const transactions = await response.json();
  
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
  
      let totalRevenue = 0;
      let todayRevenue = 0;
      let yesterdayRevenue = 0;
  
      transactions.forEach(transaction => {
        const transactionDate = new Date(transaction.createdAt);
        totalRevenue += transaction.amount;
  
        if (transactionDate >= today) {
          todayRevenue += transaction.amount;
        } else if (transactionDate >= yesterday && transactionDate < today) {
          yesterdayRevenue += transaction.amount;
        }
      });
  
      setTotalRevenue(totalRevenue);
  
      // Calculate percentage change
      if (yesterdayRevenue > 0) {
        const change = ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100;
        setPercentageChange(change.toFixed(2));
      } else if (todayRevenue > 0) {
        setPercentageChange(100); // If yesterday's revenue was 0 and today's is not, consider it as 100% increase
      } else {
        setPercentageChange(0); // If both are 0, no change
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchUserCount = async () => {
    try {
      const response = await fetch('http://localhost:5000/Admin/count');
      const data = await response.json();
      setUserCount(data.count || 0);
    } catch (error) {
      console.error('Error fetching user count:', error);
    }
  };

  
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
                <ComplexStatisticsCard
                color="dark"
                icon="local_activity"
                title="Tickets Sold"
                count={ticketsSold}
                percentage={{
                    color: "success",
                    amount: "",
                    label: "Total tickets sold",
                }}
                />
            </MDBox>
            </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
            <ComplexStatisticsCard
            key={activeMoviesCount} // Giữ nguyên dòng này
            icon="movie"
            title="Active Movies"
            count={activeMoviesCount} // Thay đổi dòng này
            percentage={{
                color: "success",
                amount: "",
                label: "Currently showing",
            }}
            link="/tables"
            />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
                <ComplexStatisticsCard
                    color="success"
                    icon="store"
                    title="Revenue"
                    count={`${totalRevenue.toLocaleString('vi-VN')} VND`}
                    percentage={{
                  color: percentageChange >= 0 ? "success" : "error",
                  amount: `${percentageChange}%`,
                  label: "than yesterday",
                }}
                />
                </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person"
                title="Total Users"
                count={userCount}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Registered accounts",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="website views"
                  description="Last Campaign Performance"
                  date="campaign sent 2 days ago"
                  chart={reportsBarChartData}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="daily sales"
                  description={
                    <>
                      (<strong>+15%</strong>) increase in today sales.
                    </>
                  }
                  date="updated 4 min ago"
                  chart={sales}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  title="completed tasks"
                  description="Last Campaign Performance"
                  date="just updated"
                  chart={tasks}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Projects />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <OrdersOverview />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
