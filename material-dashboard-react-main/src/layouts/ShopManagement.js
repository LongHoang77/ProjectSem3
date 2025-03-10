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

function ShopManagement() {
  const [shops, setShops] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingShop, setEditingShop] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchShops();
  }, []);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const fetchShops = () => {
    fetch('http://localhost:5000/api/Shop/GetAllShops')
      .then(response => response.json())
      .then(data => {
        setShops(data);
      })
      .catch(error => console.error('Error:', error));
  };

  const handleAddShop = () => {
    setEditingShop(null);
    setIsDialogOpen(true);
  };

  const handleEditShop = (shop) => {
    setEditingShop(shop);
    setIsDialogOpen(true);
  };

  const handleDeleteShop = (id) => {
    setDeletingId(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    fetch(`http://localhost:5000/api/Shop/DeleteShop/${deletingId}`, { method: 'DELETE' })
      .then(() => {
        fetchShops();
        setDeleteConfirmOpen(false);
      })
      .catch(error => console.error('Error:', error));
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingShop(null);
  };

  const handleShopSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const shopData = Object.fromEntries(formData.entries());
  
    // Convert openTime and closeTime to ISO string format
    const today = new Date().toISOString().split('T')[0]; // Get current date
    shopData.openTime = `${today}T${shopData.openTime}:00`;
    shopData.closeTime = `${today}T${shopData.closeTime}:00`;
  
    const url = editingShop
      ? `http://localhost:5000/api/Shop/UpdateShop/${editingShop.id}`
      : 'http://localhost:5000/api/Shop';
  
    const method = editingShop ? 'PUT' : 'POST';
  
    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingShop ? { ...shopData, id: editingShop.id } : shopData),
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
        fetchShops();
        handleDialogClose();
        setSnackbar({
          open: true,
          message: `Shop successfully ${editingShop ? 'updated' : 'added'}!`,
          severity: 'success'
        });
      })
      .catch(error => {
        console.error('Error:', error);
        setSnackbar({
          open: true,
          message: `Error ${editingShop ? 'updating' : 'creating'} shop: ${error.message}`,
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
    { Header: "Name", accessor: "name", width: "15%" },
    { Header: "Description", accessor: "description", width: "20%" },
    { Header: "Location", accessor: "location", width: "15%" },
    { Header: "Open Time", accessor: "openTime", width: "10%" },
    { Header: "Close Time", accessor: "closeTime", width: "10%" },
    { Header: "Owner", accessor: "ownerName", width: "15%" },
    { Header: "Contact", accessor: "contactNumber", width: "10%" },
    {
      Header: "Actions",
      accessor: "actions",
      width: "10%",
      Cell: ({ row }) => (
        <MDBox>
          <ActionButton
            variant="contained"
            color="info"
            onClick={() => handleEditShop(row.original)}
            sx={{ marginRight: 1 }}
          >
            Edit
          </ActionButton>
          <ActionButton
            variant="contained"
            color="error"
            onClick={() => handleDeleteShop(row.original.id)}
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
                  Shops Management
                </MDTypography>
                <StyledAddButton onClick={handleAddShop}>
                  Add New Shop
                </StyledAddButton>
              </MDBox>
            }
          />
          <CardContent>
            <DataTable
              table={{ columns, rows: shops }}
              isSorted={false}
              entriesPerPage={false}
              showTotalEntries={false}
              noEndBorder
            />
          </CardContent>
        </Card>
      </MDBox>

      {/* Add/Edit Shop Dialog */}
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <form onSubmit={handleShopSubmit}>
          <DialogTitle>{editingShop ? 'Edit Shop' : 'Add New Shop'}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Shop Name"
              type="text"
              fullWidth
              variant="standard"
              defaultValue={editingShop?.name || ''}
            />
            <TextField
              margin="dense"
              name="description"
              label="Description"
              type="text"
              fullWidth
              variant="standard"
              defaultValue={editingShop?.description || ''}
            />
            <TextField
              margin="dense"
              name="location"
              label="Location"
              type="text"
              fullWidth
              variant="standard"
              defaultValue={editingShop?.location || ''}
            />
            <TextField
  margin="dense"
  name="openTime"
  label="Open Time"
  type="time"
  fullWidth
  variant="standard"
  defaultValue={editingShop?.openTime ? new Date(editingShop.openTime).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) : ''}
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
  defaultValue={editingShop?.closeTime ? new Date(editingShop.closeTime).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) : ''}
  InputLabelProps={{
    shrink: true,
  }}
  inputProps={{
    step: 300, // 5 min
  }}
/>
            <TextField
              margin="dense"
              name="ownerName"
              label="Owner Name"
              type="text"
              fullWidth
              variant="standard"
              defaultValue={editingShop?.ownerName || ''}
            />
            <TextField
              margin="dense"
              name="contactNumber"
              label="Contact Number"
              type="text"
              fullWidth
              variant="standard"
              defaultValue={editingShop?.contactNumber || ''}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button type="submit">{editingShop ? 'Update' : 'Add'}</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this shop?
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

export default ShopManagement;