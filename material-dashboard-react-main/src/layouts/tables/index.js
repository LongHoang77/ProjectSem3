import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import AuthorsTableData from "layouts/tables/data/authorsTableData";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
import TextField from "@mui/material/TextField";
import styled from 'styled-components';

const WhiteTextField = styled(TextField)`
  & .MuiInputBase-input {
    color: white;
  }
  & .MuiInputLabel-root {
    color: white;
  }
  & .MuiOutlinedInput-root {
    & fieldset {
      border-color: white;
    }
    &:hover fieldset {
      border-color: white;
    }
    &.Mui-focused fieldset {
      border-color: white;
    }
  }
  & .MuiSvgIcon-root {
    color: white;
  }
`;

function Tables() {
  const [activeOnly, setActiveOnly] = useState(true);
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [tableData, setTableData] = useState({ columns: [], rows: [], pagination: null });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    color: "success",
  });
  const [selectedDate, setSelectedDate] = useState("");

  const fetchData = useCallback(async () => {
    try {
      let url = `http://localhost:5000/Movie?page=${currentPage}&limit=${limit}&activeOnly=${activeOnly}`;
      
      if (selectedDate) {
        const [year, month] = selectedDate.split('-');
        url += `&month=${month}&year=${year}`;
      }

      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (response.data && response.data.movies && Array.isArray(response.data.movies)) {
        setMovies(response.data.movies);
        setTotalPages(response.data.totalPages || 1);
      } else {
        console.error("Unexpected API response format:", response.data);
        setTableData({
          columns: [],
          rows: [{ title: <MDTypography color="error">Unexpected data format from API</MDTypography> }],
          pagination: null,
        });
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      setTableData({
        columns: [],
        rows: [{ title: <MDTypography color="error">Failed to fetch movies</MDTypography> }],
        pagination: null,
      });
    }
  }, [activeOnly, currentPage, limit, selectedDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleToggleActiveOnly = useCallback(() => {
    setActiveOnly((prev) => !prev);
    setCurrentPage(1);
  }, []);

  const handleDelete = useCallback(async (id) => {
    try {
      await axios.delete(`http://localhost:5000/Movie/delete/${id}`);
      setSnackbar({
        open: true,
        message: "Movie deleted successfully",
        color: "success",
      });
      fetchData();
    } catch (error) {
      console.error("Error deleting movie:", error);
      setSnackbar({
        open: true,
        message: "Error deleting movie",
        color: "error",
      });
    }
  }, [fetchData]);

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (movies.length > 0) {
      const { columns, rows, pagination } = AuthorsTableData(
        movies,
        currentPage,
        totalPages,
        setCurrentPage,
        handleDelete
      );
      setTableData({ columns, rows, pagination });
    }
  }, [movies, currentPage, totalPages, handleDelete]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDTypography variant="h6" color="white">
                  Authors Table
                </MDTypography>
                <MDBox display="flex" alignItems="center">
                  <WhiteTextField
                    type="month"
                    label="Select Month"
                    value={selectedDate}
                    onChange={handleDateChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{
                      mr: 2,
                      '& input::-webkit-calendar-picker-indicator': {
                        filter: 'invert(1)',
                      },
                    }}
                  />
                  <MDButton
                    variant="outlined"
                    color="white"
                    onClick={handleToggleActiveOnly}
                    sx={{
                      color: 'white',
                      borderColor: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      },
                    }}
                  >
                    {activeOnly ? "Show All" : "Active Only"}
                  </MDButton>
                </MDBox>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns: tableData.columns, rows: tableData.rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
              <MDBox p={2}>
                {tableData.pagination}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
      <MDSnackbar
        color={snackbar.color}
        icon="notifications"
        title="Notification"
        content={snackbar.message}
        open={snackbar.open}
        onClose={closeSnackbar}
        close={closeSnackbar}
        bgWhite
      />
    </DashboardLayout>
  );
}

export default Tables;