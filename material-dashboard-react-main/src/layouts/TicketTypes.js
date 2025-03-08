import React, { useState, useEffect, useRef, useMemo } from "react";
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTicketType, setEditingTicketType] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

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

  const handleDeleteTicketType = (id) => {
    setDeletingId(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    fetch(`http://localhost:5000/api/ticket/delete/${deletingId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          console.log('Deleted successfully');
          fetchTicketTypes(); // Refresh the list after deletion
        } else {
          console.error('Failed to delete');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      })
      .finally(() => {
        setDeleteConfirmOpen(false);
        setDeletingId(null);
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
          fetchTicketTypes(); // Refresh the list after update
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
          fetchTicketTypes(); // Refresh the list after adding
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
    handleDialogClose();
  };

  const columns = useMemo(
    () => [
        { Header: "ID", accessor: "id", width: "10%" },
        { Header: "Name", accessor: "name", width: "25%" },
        { Header: "Price", accessor: "price", width: "20%" },
        { Header: "Description", accessor: "description", width: "25%" },

      {
        Header: "Actions",
        width: "20%",
        Cell: ({ row }) => (
          <MDBox>
            <ActionButton
              variant="contained"
              color="info"
              size="small"
              onClick={() => handleEditTicketType(row.original)}
              sx={{ marginRight: 1 }}
            >
              Edit
            </ActionButton>
            <ActionButton
              variant="contained"
              color="error"
              size="small"
              onClick={() => handleDeleteTicketType(row.original.id)}
            >
              Delete
            </ActionButton>
          </MDBox>
        ),
      },
    ],
    []
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Card>
          <CardHeader 
             title={<MDTypography variant="h6" color="white">Ticket Transactions</MDTypography>}
                        sx={{ bgcolor: '#1A73E8' }}
            action={
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddTicketType}
              >
                Add New Ticket Type
              </Button>
            }
          />
          <CardContent>
            <DataTable
              table={{ columns, rows: ticketTypes }}
              isSorted={false}
              entriesPerPage={{ default: 10 }}
              showTotalEntries={false}
              noEndBorder
              canSearch
              
            />
          </CardContent>
        </Card>
      </MDBox>

      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{editingTicketType ? 'Edit Ticket Type' : 'Add New Ticket Type'}</DialogTitle>
        <DialogContent>
            <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            defaultValue={editingTicketType?.name || ''}
            />
            <TextField
            margin="dense"
            id="price"
            label="Price"
            type="number"
            fullWidth
            defaultValue={editingTicketType?.price || ''}
            />
            <TextField
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={4}
            defaultValue={editingTicketType?.description || ''}
            />
            <FormControlLabel
            control={
                <Switch
                defaultChecked={editingTicketType?.status || false}
                />
            }
            label="Active"
            />
        </DialogContent>
        
  <DialogActions>
  <Button onClick={handleDialogClose}>Cancel</Button>
  <Button onClick={() => {
    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const description = document.getElementById('description').value;
    const status = document.querySelector('input[type="checkbox"]').checked;
    handleDialogSave({ name, price, description, status });
  }}>Save</Button>
</DialogActions>
      </Dialog>

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <MDTypography variant="body1">
            Are you sure you want to delete this ticket type?
          </MDTypography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default TicketTypes;