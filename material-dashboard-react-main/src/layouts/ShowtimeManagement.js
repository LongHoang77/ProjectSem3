import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
} from "@mui/material";
import axios from "axios";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";


const tableHeaderStyle = {
    backgroundColor: '#f5f5f5',
    padding: '12px',
    textAlign: 'left',
    borderBottom: '1px solid #ddd'
  };
  
  const tableCellStyle = {
    padding: '12px',
    borderBottom: '1px solid #ddd'
  };

function ShowtimeManagement() {
  const [showtimes, setShowtimes] = useState([]);
  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
const [showtimesPerPage] = useState(10);

const indexOfLastShowtime = currentPage * showtimesPerPage;
const indexOfFirstShowtime = indexOfLastShowtime - showtimesPerPage;
const currentShowtimes = showtimes.slice(indexOfFirstShowtime, indexOfLastShowtime);

const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const [formData, setFormData] = useState({
    movieId: "",
    roomId: "",
    startTime: "",
    formatMovie: "",
    status: "Active",
    maxTickets: "",
  });

  useEffect(() => {
    fetchShowtimes();
    fetchMovies();
    fetchRooms();
  }, []);

  const fetchShowtimes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/Movie/allshowtimes");
      console.log("API response:", response.data);
      if (response.data && Array.isArray(response.data.showtimes)) {
        setShowtimes(response.data.showtimes);
      } else {
        console.error("Unexpected data structure:", response.data);
        setShowtimes([]);
      }
    } catch (error) {
      console.error("Error fetching showtimes:", error);
      setShowtimes([]);
    }
  };

  const fetchMovies = async () => {
    try {
      const response = await axios.get("http://localhost:5000/Movie");
      setMovies(response.data.movies);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await axios.get("http://localhost:5000/Movie/getallroom");
      setRooms(response.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!formData.movieId || !formData.roomId || !formData.startTime || !formData.maxTickets) {
      alert("Please fill in all required fields");
      return;
    }
      
    const localDate = new Date(formData.startTime);
    const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
  
    const postData = {
      ...formData,
      movieId: parseInt(formData.movieId),
      roomId: parseInt(formData.roomId),
      maxTickets: parseInt(formData.maxTickets),
      startTime: utcDate.toISOString(),
    };
    console.log("Data being sent:", postData);
    try {
      await axios.post("http://localhost:5000/Movie/createshowtime", postData);
      fetchShowtimes();
      setFormData({
        movieId: "",
        roomId: "",
        startTime: "",
        formatMovie: "",
        status: "Active",
        maxTickets: "",
      });
      alert("Showtime created successfully!");
    } catch (error) {
      console.error("Error creating showtime:", error.response?.data || error.message);
      alert("Failed to create showtime. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lịch chiếu này?')) {
      try {
        await axios.delete(`http://localhost:5000/Movie/deleteshowtime/${id}`);
        fetchShowtimes(); // Cập nhật lại danh sách sau khi xóa
        alert('Xóa lịch chiếu thành công!');
      } catch (error) {
        console.error('Error deleting showtime:', error);
        alert('Xóa lịch chiếu thất bại. Vui lòng thử lại.');
      }
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <CardHeader title="Create Showtime" />
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <FormControl fullWidth margin="normal" >
                    <InputLabel>Movie</InputLabel>
                    <Select
                      name="movieId"
                      value={formData.movieId}
                      onChange={handleInputChange}
                      style={{ height: '45px' }}
                      InputLabelProps={{ shrink: true }}
                    >
                      {movies.map((movie) => (
                        <MenuItem key={movie.id} value={movie.id}>
                          {movie.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Room</InputLabel>
                    <Select
                      name="roomId"
                      value={formData.roomId}
                      onChange={handleInputChange}
                      style={{ height: '45px' }}
                     
                    >
                      {rooms.map((room) => (
  <MenuItem key={room.roomId} value={room.roomId}>
    {room.roomName}
  </MenuItem>
))}
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    margin="normal"
                    name="startTime"
                    label="Start Time"
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    name="formatMovie"
                    label="Format Movie"
                    value={formData.formatMovie}
                    onChange={handleInputChange}
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    name="maxTickets"
                    label="Max Tickets"
                    type="number"
                    value={formData.maxTickets}
                    onChange={handleInputChange}
                  />
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Status</InputLabel>
                    <Select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <MenuItem value="Active">Active</MenuItem>
                      <MenuItem value="Inactive">Inactive</MenuItem>
                    </Select>
                  </FormControl>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary" 
                    sx={{ 
                        mt: 2,
                        px: 4,
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)',
                        transition: 'all 0.15s ease',
                        color: '#ffffff',
                        '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08)',
                        
                        },
                    }}
                    >
                    Create Showtime
                    </Button>
                </form>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
          <Card>
            <CardHeader title="Showtime List" />
            <CardContent>
                {showtimes.length > 0 ? (
                    <Box sx={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                        <tr>
                            <th style={tableHeaderStyle}>Movie</th>
                            <th style={tableHeaderStyle}>Room</th>
                            <th style={tableHeaderStyle}>Start Time</th>
                            <th style={tableHeaderStyle}>End Time</th>
                            <th style={tableHeaderStyle}>Format</th>
                            <th style={tableHeaderStyle}>Max Tickets</th>
                            <th style={tableHeaderStyle}>Status</th>
                            <th style={tableHeaderStyle}>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentShowtimes.map((showtime) => (
                            <tr key={showtime.id}>
                            <td style={tableCellStyle}>{showtime.movieTitle}</td>
                            <td style={tableCellStyle}>{showtime.roomName}</td>
                            <td style={tableCellStyle}>{new Date(showtime.startTime).toLocaleString()}</td>
                            <td style={tableCellStyle}>{new Date(showtime.endTime).toLocaleString()}</td>
                            <td style={tableCellStyle}>{showtime.formatMovie}</td>
                            <td style={tableCellStyle}>{showtime.maxTickets}</td>
                            <td style={tableCellStyle}>{showtime.status}</td>
                            <td style={tableCellStyle}>
      <Button
        onClick={() => handleDelete(showtime.id)}
        variant="contained"
        color="error"
        size="small"
      >
        Delete
      </Button>
    </td>
                            </tr>
                            
                        ))}
                        </tbody>
                    </table>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 2 }}>
                        {Array.from({ length: Math.ceil(showtimes.length / showtimesPerPage) }, (_, i) => (
                            <Button
                            key={i}
                            onClick={() => paginate(i + 1)}
                            variant={currentPage === i + 1 ? 'contained' : 'outlined'}
                            sx={{
                                mx: 0.5,
                                minWidth: '40px',
                                height: '40px',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                color: currentPage === i + 1 ? '#fff' : '#1976d2',
                                backgroundColor: currentPage === i + 1 ? '#1976d2' : 'transparent',
                                '&:hover': {
                                backgroundColor: currentPage === i + 1 ? '#1565c0' : '#e3f2fd',
                                },
                            }}
                            >
                            {i + 1}
                            </Button>
                        ))}
                        </Box>
                    </Box>
                ) : (
                    <MDTypography variant="body2">No showtimes available.</MDTypography>
                )}
                </CardContent>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default ShowtimeManagement;