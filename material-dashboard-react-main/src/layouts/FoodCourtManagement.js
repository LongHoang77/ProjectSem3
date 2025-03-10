import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import { Snackbar, Alert } from '@mui/material';

const StyledAddButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.success.main,
  color: theme.palette.common.white,
  fontWeight: 'bold',
  textTransform: 'none',
  padding: '10px 20px',
  borderRadius: '8px',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
  '&:hover': {
    backgroundColor: theme.palette.success.dark,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  fontWeight: 'bold',
  textTransform: 'none',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
  '&:hover': {
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
  },
}));

function FoodCourtManagement() {
  const [foodCourts, setFoodCourts] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFoodCourt, setEditingFoodCourt] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchFoodCourts();
  }, []);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const fetchFoodCourts = () => {
    fetch('http://localhost:5000/api/FoodCourt/GetAllFoodCourts')
      .then(response => response.json())
      .then(data => {
        setFoodCourts(data);
      })
      .catch(error => console.error('Error:', error));
  };

  const handleAddFoodCourt = () => {
    setEditingFoodCourt(null);
    setIsDialogOpen(true);
  };

  const handleEditFoodCourt = (foodCourt) => {
    setEditingFoodCourt(foodCourt);
    setIsDialogOpen(true);
  };

  const handleDeleteFoodCourt = (id) => {
    setDeletingId(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    fetch(`http://localhost:5000/api/FoodCourt/DeleteFoodCourt/${deletingId}`, { method: 'DELETE' })
      .then(() => {
        fetchFoodCourts();
        setDeleteConfirmOpen(false);
        setSnackbar({
          open: true,
          message: 'Food Court successfully deleted!',
          severity: 'success'
        });
      })
      .catch(error => {
        console.error('Error:', error);
        setSnackbar({
          open: true,
          message: `Error deleting food court: ${error.message}`,
          severity: 'error'
        });
      });
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingFoodCourt(null);
  };

  const handleFoodCourtSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const foodCourtData = Object.fromEntries(formData.entries());
  
    // Convert openTime and closeTime to ISO string format
    foodCourtData.openTime = `${foodCourtData.openTime}:00`;
  foodCourtData.closeTime = `${foodCourtData.closeTime}:00`;
  
    const url = editingFoodCourt
      ? `http://localhost:5000/api/FoodCourt/UpdateFoodCourt/${editingFoodCourt.id}`
      : 'http://localhost:5000/api/FoodCourt/CreateFoodCourt';
  
    const method = editingFoodCourt ? 'PUT' : 'POST';
  
    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingFoodCourt ? { ...foodCourtData, id: editingFoodCourt.id } : foodCourtData),
    })
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => {
            throw new Error(text || 'Network response was not ok');
          });
        }
        return response.text().then(text => {
          return text ? JSON.parse(text) : {};
        });
      })
      .then(() => {
        fetchFoodCourts();
        handleDialogClose();
        setSnackbar({
          open: true,
          message: `Food Court successfully ${editingFoodCourt ? 'updated' : 'added'}!`,
          severity: 'success'
        });
      })
      .catch(error => {
        console.error('Error:', error);
        setSnackbar({
          open: true,
          message: `Error ${editingFoodCourt ? 'updating' : 'creating'} food court: ${error.message}`,
          severity: 'error'
        });
      });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const columns = [
    { Header: "ID", accessor: "id", width: "5%" },
    { Header: "Name", accessor: "name", width: "20%" },
    { Header: "Location", accessor: "location", width: "20%" },
    { Header: "Description", accessor: "description", width: "30%" },
    { Header: "Open Time", accessor: "openTime", width: "10%" },
    { Header: "Close Time", accessor: "closeTime", width: "10%" },
    {
      Header: "Actions",
      accessor: "actions",
      width: "10%",
      Cell: ({ row }) => (
        <MDBox>
          <ActionButton
            variant="contained"
            color="info"
            onClick={() => handleEditFoodCourt(row.original)}
            sx={{ marginRight: 1 }}
          >
            Edit
          </ActionButton>
          <ActionButton
            variant="contained"
            color="error"
            onClick={() => handleDeleteFoodCourt(row.original.id)}
          >
            Delete
          </ActionButton>
        </MDBox>
      ),
    },

    
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Card>
          <CardHeader
            title={
              <MDBox display="flex" justifyContent="space-between" alignItems="center">
                <MDTypography variant="h6" fontWeight="medium">
                  Food Courts Management
                </MDTypography>
                <StyledAddButton onClick={handleAddFoodCourt}>
                  Add New Food Court
                </StyledAddButton>
              </MDBox>
            }
          />
          <CardContent>
            <DataTable
              table={{ columns, rows: foodCourts }}
              isSorted={false}
              entriesPerPage={false}
              showTotalEntries={false}
              noEndBorder
            />
          </CardContent>
        </Card>
      </MDBox>

      {/* Add/Edit Food Court Dialog */}
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <form onSubmit={handleFoodCourtSubmit}>
          <DialogTitle>{editingFoodCourt ? 'Edit Food Court' : 'Add New Food Court'}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Food Court Name"
              type="text"
              fullWidth
              variant="standard"
              defaultValue={editingFoodCourt?.name || ''}
            />
            <TextField
              margin="dense"
              name="location"
              label="Location"
              type="text"
              fullWidth
              variant="standard"
              defaultValue={editingFoodCourt?.location || ''}
            />
            <TextField
              margin="dense"
              name="description"
              label="Description"
              type="text"
              fullWidth
              variant="standard"
              multiline
              rows={4}
              defaultValue={editingFoodCourt?.description || ''}
            />
            <TextField
                margin="dense"
                name="openTime"
                label="Open Time"
                type="time"
                fullWidth
                variant="standard"
                defaultValue={editingFoodCourt?.openTime ? new Date(editingFoodCourt.openTime).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) : ''}
                InputLabelProps={{
                    shrink: true,
                }}
                inputProps={{
                    step: 300, // 5 min
                }}
                />
                <TextField
                margin="dense"
                name="closeTime"
                label="Close Time"
                type="time"
                fullWidth
                variant="standard"
                defaultValue={editingFoodCourt?.closeTime ? new Date(editingFoodCourt.closeTime).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) : ''}
                InputLabelProps={{
                    shrink: true,
                }}
                inputProps={{
                    step: 300, // 5 min
                }}
                />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button type="submit">{editingFoodCourt ? 'Update' : 'Add'}</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this food court?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}

export default FoodCourtManagement;