import React, { useState, useEffect } from "react";
import axios from "axios";
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
  IconButton,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import { Snackbar, Alert } from '@mui/material';


function MovieManagement() {
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(30);
    const [totalPages, setTotalPages] = useState(1);
    const [totalMovies, setTotalMovies] = useState(0);
  const [open, setOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    director: "",
    cast: "",
    genre: "",
    releaseDate: "",
    endDate: "",
    languages: "",
    trailerUrl: "",
    posterUrl: "",
  });


  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchMovies = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/Movie?page=${page}&limit=${limit}&activeOnly=true`);
      const data = response.data;
      setMovies(data.movies || []);
      setTotalPages(data.totalPages || 1);
      setTotalMovies(data.totalMovies || 0);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setMovies([]);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [page, limit]);

  const intervalId = setInterval(() => {
    fetchMovies();
  }, 30000);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };
  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(1); // Reset to first page when changing limit
  };

  const handleOpen = () => {
    setOpen(true);
    setEditingMovie(null);
    setFormData({
      title: "",
      description: "",
      duration: "",
      genre: "",
      releaseDate: "",
      posterUrl: "",
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    const url = editingMovie
      ? `http://localhost:5000/Movie/update`
      : "http://localhost:5000/Movie/create";
    const method = editingMovie ? "PUT" : "POST";
  
    const submissionData = {
      ...formData,
      duration: parseInt(formData.duration, 10),
      languages: formData.languages.split(',').map(lang => lang.trim()),
      releaseDate: new Date(formData.releaseDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
    };
  
    if (editingMovie) {
      submissionData.id = editingMovie.id;
    }
  
    axios({
      method: method,
      url: url,
      data: submissionData,
      headers: { "Content-Type": "application/json" }
    })
      .then((response) => {
        fetchMovies();
        handleClose();
        showSnackbar(editingMovie ? "Movie updated successfully" : "Movie added successfully");
      })
      .catch((error) => {
        console.error("Error submitting movie:", error);
        let errorMessage = "An error occurred while submitting the movie";
        if (error.response && error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
        showSnackbar(errorMessage, "error");
      });
  };
  const handleEdit = (movie) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title,
      description: movie.description,
      duration: movie.duration.toString(),
      director: movie.director,
      cast: movie.cast,
      genre: movie.genre,
      releaseDate: movie.releaseDate.split("T")[0], // Đảm bảo định dạng ngày đúng
      endDate: movie.endDate.split("T")[0], // Đảm bảo định dạng ngày đúng
      languages: Array.isArray(movie.languages) ? movie.languages.join(', ') : movie.languages,
      trailerUrl: movie.trailerUrl,
      posterUrl: movie.posterUrl,
    });
    setOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this movie?")) {
      axios.delete(`http://localhost:5000/Movie/delete/${id}`)
        .then(() => {
          fetchMovies();
          showSnackbar("Movie deleted successfully");
        })
        .catch((error) => {
          console.error("Error deleting movie:", error);
          showSnackbar("Error deleting movie", "error");
        });
    }
  };

  const columns = [
    { Header: "Title", accessor: "title", width: "20%" },
    { Header: "Description", accessor: "description", width: "30%" },
    { Header: "Duration", accessor: "duration", width: "10%" },
    { Header: "Genre", accessor: "genre", width: "15%" },
    { Header: "Release Date", accessor: "releaseDate", width: "15%" },
    {
      Header: "Actions",
      accessor: "actions",
      width: "10%",
      Cell: ({ row }) => (
        <MDBox>
          <IconButton onClick={() => handleEdit(row.original)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(row.original.id)}>
            <DeleteIcon />
          </IconButton>
        </MDBox>
      ),
    },
  ];

  const rows = movies.map((movie) => ({
    ...movie,
    releaseDate: new Date(movie.releaseDate).toLocaleDateString(),
  }));

  return (
    <DashboardLayout>
    <DashboardNavbar />
    <style>
        {`
          .movie-management-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 24px;
            background-color: #f8f9fa;
            border-bottom: 1px solid #e0e0e0;
          }

          .movie-management-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: #333;
          }

          .add-movie-button {
            background-color: #1976d2;
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            text-transform: none;
            font-weight: 500;
            transition: background-color 0.3s;
          }

          .add-movie-button:hover {
            background-color: #1565c0;
          }

          .movie-management-content {
            padding: 24px;
          }
        `}
      </style>
    <MDBox pt={6} pb={3}>
      <Card>
        <div className="movie-management-header">
          <MDTypography variant="h6" className="movie-management-title">
            Movie Management
          </MDTypography>
          <Button
            variant="contained"
            className="add-movie-button"
            onClick={handleOpen}
          >
            Add New Movie
          </Button>
        </div>
        <CardContent className="movie-management-content">
          <DataTable
            table={{ columns, rows }}
            canSearch
            entriesPerPage={{
              defaultValue: limit,
              values: [10, 20, 30, 50],
            }}
            pagination={{ page, count: totalPages, onPageChange: handlePageChange }}
            onEntriesPerPageChange={handleLimitChange}
          />
          
        </CardContent>
      </Card>
    </MDBox>

    <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingMovie ? "Edit Movie" : "Add New Movie"}</DialogTitle>
        <DialogContent>
          <TextField
            name="title"
            label="Title"
            fullWidth
            margin="normal"
            value={formData.title}
            onChange={handleInputChange}
          />
          <TextField
            name="description"
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={formData.description}
            onChange={handleInputChange}
          />
          <TextField
            name="duration"
            label="Duration (minutes)"
            fullWidth
            margin="normal"
            type="number"
            value={formData.duration}
            onChange={handleInputChange}
          />
          <TextField
            name="director"
            label="Director"
            fullWidth
            margin="normal"
            value={formData.director}
            onChange={handleInputChange}
          />
          <TextField
            name="cast"
            label="Cast"
            fullWidth
            margin="normal"
            value={formData.cast}
            onChange={handleInputChange}
          />
          <TextField
            name="genre"
            label="Genre"
            fullWidth
            margin="normal"
            value={formData.genre}
            onChange={handleInputChange}
          />
          <TextField
            name="releaseDate"
            label="Release Date"
            fullWidth
            margin="normal"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.releaseDate}
            onChange={handleInputChange}
          />
          <TextField
            name="endDate"
            label="End Date"
            fullWidth
            margin="normal"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.endDate}
            onChange={handleInputChange}
          />
          <TextField
            name="languages"
            label="Languages (comma-separated)"
            fullWidth
            margin="normal"
            value={formData.languages}
            onChange={handleInputChange}
          />
          <TextField
            name="trailerUrl"
            label="Trailer URL"
            fullWidth
            margin="normal"
            value={formData.trailerUrl}
            onChange={handleInputChange}
          />
          <TextField
            name="posterUrl"
            label="Poster URL"
            fullWidth
            margin="normal"
            value={formData.posterUrl}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary">
            {editingMovie ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
      open={snackbar.open} 
      autoHideDuration={6000} 
      onClose={handleCloseSnackbar}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
        {snackbar.message}
      </Alert>
    </Snackbar>
    </DashboardLayout>
  );
}

export default MovieManagement;