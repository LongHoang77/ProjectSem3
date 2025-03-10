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
    Typography,
    Collapse,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import { Snackbar, Alert } from '@mui/material';


const CollapsibleContent = ({ content, maxLength = 50 }) => {
    const [isExpanded, setIsExpanded] = useState(false);
  
    if (content.length <= maxLength) {
      return <Typography>{content}</Typography>;
    }
  
    return (
      <>
        <Typography>
          {isExpanded ? content : `${content.slice(0, maxLength)}...`}
        </Typography>
        
      </>
    );
  };

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

function GalleryManagement() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGalleryItem, setEditingGalleryItem] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const fetchGalleryItems = () => {
    fetch('http://localhost:5000/api/Gallery/GetallGalleryItems')
      .then(response => response.json())
      .then(data => {
        setGalleryItems(data);
      })
      .catch(error => console.error('Error:', error));
  };

  const handleAddGalleryItem = () => {
    setEditingGalleryItem(null);
    setIsDialogOpen(true);
  };

  const handleEditGalleryItem = (galleryItem) => {
    setEditingGalleryItem(galleryItem);
    setIsDialogOpen(true);
  };

  const handleDeleteGalleryItem = (id) => {
    setDeletingId(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    fetch(`http://localhost:5000/api/Gallery/DeleteGalleryItem/${deletingId}`, { method: 'DELETE' })
      .then(() => {
        fetchGalleryItems();
        setDeleteConfirmOpen(false);
        setSnackbar({
          open: true,
          message: 'Gallery item successfully deleted!',
          severity: 'success'
        });
      })
      .catch(error => {
        console.error('Error:', error);
        setSnackbar({
          open: true,
          message: `Error deleting gallery item: ${error.message}`,
          severity: 'error'
        });
      });
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingGalleryItem(null);
  };

  const handleGalleryItemSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const galleryItemData = Object.fromEntries(formData.entries());
  
    const url = editingGalleryItem
      ? `http://localhost:5000/api/Gallery/UpdateGalleryItem/${editingGalleryItem.id}`
      : 'http://localhost:5000/api/Gallery/AddGalleryItem';
  
    const method = editingGalleryItem ? 'PUT' : 'POST';
  
    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingGalleryItem ? { ...galleryItemData, id: editingGalleryItem.id } : galleryItemData),
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
        fetchGalleryItems();
        handleDialogClose();
        setSnackbar({
          open: true,
          message: `Gallery item successfully ${editingGalleryItem ? 'updated' : 'added'}!`,
          severity: 'success'
        });
      })
      .catch(error => {
        console.error('Error:', error);
        setSnackbar({
          open: true,
          message: `Error ${editingGalleryItem ? 'updating' : 'creating'} gallery item: ${error.message}`,
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
  { Header: "Title", accessor: "title", width: "20%" },
  { 
    Header: "Description", 
    accessor: "description", 
    width: "30%",
    Cell: ({ value }) => <CollapsibleContent content={value} />
  },
  { 
    Header: "Image URL", 
    accessor: "imageUrl", 
    width: "30%",
    Cell: ({ value }) => <CollapsibleContent content={value} maxLength={30} />
  },
  { Header: "Created At", accessor: "createdAt", width: "10%" },
    {
      Header: "Actions",
      accessor: "actions",
      width: "10%",
      Cell: ({ row }) => (
        <MDBox>
          <ActionButton
            variant="contained"
            color="info"
            onClick={() => handleEditGalleryItem(row.original)}
            sx={{ marginRight: 1 }}
          >
            Edit
          </ActionButton>
          <ActionButton
            variant="contained"
            color="error"
            onClick={() => handleDeleteGalleryItem(row.original.id)}
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
                  Gallery Management
                </MDTypography>
                <StyledAddButton onClick={handleAddGalleryItem}>
                  Add New Gallery Item
                </StyledAddButton>
              </MDBox>
            }
          />
          <CardContent>
            <DataTable
              table={{ columns, rows: galleryItems }}
              isSorted={false}
              entriesPerPage={false}
              showTotalEntries={false}
              noEndBorder
            />
          </CardContent>
        </Card>
      </MDBox>

      {/* Add/Edit Gallery Item Dialog */}
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <form onSubmit={handleGalleryItemSubmit}>
          <DialogTitle>{editingGalleryItem ? 'Edit Gallery Item' : 'Add New Gallery Item'}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="title"
              label="Title"
              type="text"
              fullWidth
              variant="standard"
              defaultValue={editingGalleryItem?.title || ''}
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
              defaultValue={editingGalleryItem?.description || ''}
            />
            <TextField
              margin="dense"
              name="imageUrl"
              label="Image URL"
              type="text"
              fullWidth
              variant="standard"
              defaultValue={editingGalleryItem?.imageUrl || ''}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button type="submit">{editingGalleryItem ? 'Update' : 'Add'}</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this gallery item?
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

export default GalleryManagement;