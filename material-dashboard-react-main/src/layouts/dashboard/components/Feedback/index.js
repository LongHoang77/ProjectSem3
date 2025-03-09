import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
  DialogContentText,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function Feedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchFeedbacks();

    // Set up polling to fetch feedbacks every 5 seconds
    const intervalId = setInterval(fetchFeedbacks, 30000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/Feedback/GetAllFeedbacks');
      const data = await response.json();
      setFeedbacks(data);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleOpenDialog = (feedback) => {
    setSelectedFeedback(feedback);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmDelete = () => {
    setConfirmDelete(true);
  };

  const handleCancelDelete = () => {
    setConfirmDelete(false);
  };

  const handleDeleteFeedback = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/Feedback/DeleteFeedback/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        // Remove the deleted feedback from the state
        setFeedbacks(feedbacks.filter(feedback => feedback.id !== id));
        // Close the dialog if the deleted feedback was being viewed
        if (selectedFeedback && selectedFeedback.id === id) {
          handleCloseDialog();
        }
        setConfirmDelete(false);
      } else {
        console.error('Failed to delete feedback');
      }
    } catch (error) {
      console.error('Error deleting feedback:', error);
    }
  };

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedFeedbacks = feedbacks.slice(startIndex, endIndex);

  return (
    <Card>
      <MDBox p={3}>
        <MDTypography variant="h6" fontWeight="medium" mb={3}>
          Recent Feedbacks
        </MDTypography>
        <TableContainer>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell align="left" style={{ padding: '16px', fontWeight: 'bold' }}>Name</TableCell>
        <TableCell align="left" style={{ padding: '16px', fontWeight: 'bold' }}>Email</TableCell>
        <TableCell align="left" style={{ padding: '16px', fontWeight: 'bold' }}>Content</TableCell>
        <TableCell align="left" style={{ padding: '16px', fontWeight: 'bold' }}>Actions</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {displayedFeedbacks.map((feedback) => (
        <TableRow key={feedback.id}>
          <TableCell align="left" style={{ padding: '16px' }}>{feedback.name}</TableCell>
          <TableCell align="left" style={{ padding: '16px' }}>{feedback.email}</TableCell>
          <TableCell align="left" style={{ padding: '16px' }}>{feedback.content.substring(0, 50)}...</TableCell>
          <TableCell align="left" style={{ padding: '16px' }}>
            <Button 
              onClick={() => handleOpenDialog(feedback)}
              variant="contained"
              color="primary"
              size="small"
              style={{ marginRight: '8px', backgroundColor: '#1976d2', color: '#fff' }}
            >
              Detail
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>
        <MDBox mt={3} display="flex" justifyContent="center">
          <Pagination
            count={Math.ceil(feedbacks.length / itemsPerPage)}
            page={page}
            onChange={handleChangePage}
            color="primary"
          />
        </MDBox>
      </MDBox>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Feedback Details</DialogTitle>
        <DialogContent>
          {selectedFeedback && (
            <>
              <MDTypography variant="h6">Name: {selectedFeedback.name}</MDTypography>
              <MDTypography variant="body1">Email: {selectedFeedback.email}</MDTypography>
              <MDTypography variant="body1">Content: {selectedFeedback.content}</MDTypography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
          {selectedFeedback && (
            <Button 
              onClick={handleConfirmDelete}
              color="error"
            >
              Delete
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDelete} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this feedback?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button 
            onClick={() => handleDeleteFeedback(selectedFeedback.id)}
            color="error"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}

export default Feedback;