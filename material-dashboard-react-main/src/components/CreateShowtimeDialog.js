import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  Grid,
  Typography,
  Box
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { vi } from 'date-fns/locale';
import axios from 'axios';


function CreateShowtimeDialog({ open, handleClose, handleCreateShowtime, movieId, movieReleaseDate, movieEndDate }) {
  const [showtime, setShowtime] = useState({
    roomId: '',
    startTime: null,
    formatMovie: '',
    status: 'Active'
  });
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchRooms();
    }
  }, [open]);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/Movie/getallroom');
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setError('Không thể tải danh sách phòng. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setShowtime({ ...showtime, [e.target.name]: e.target.value });
  };

  const handleDateChange = (newValue) => {
    setShowtime({ ...showtime, startTime: newValue });
  };

  const handleSubmit = () => {
    const localTime = new Date(showtime.startTime);
    const utcTime = new Date(localTime.getTime() - localTime.getTimezoneOffset() * 60000);
    const isoTime = utcTime.toISOString();
    
    handleCreateShowtime({ 
      ...showtime, 
      startTime: isoTime,
      movieId 
    });
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>  
      <DialogTitle>
        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          Tạo Xuất Chiếu Mới
        </Typography>
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="200px">
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>Phòng chiếu</Typography>
                <TextField
                  select
                  fullWidth
                  name="roomId"
                  value={showtime.roomId}
                  onChange={handleChange}
                  variant="outlined"
                  sx={{ backgroundColor: '#f5f5f5' }}
                >
                  {rooms.map((room) => (
                    <MenuItem key={room.roomId} value={room.roomId}>{room.roomName}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>Thời gian bắt đầu</Typography>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                <DateTimePicker
                    value={showtime.startTime}
                    onChange={handleDateChange}
                    renderInput={(params) => <TextField {...params} fullWidth sx={{ backgroundColor: '#f5f5f5' }} />}
                    minDateTime={new Date(movieReleaseDate)}
                    maxDateTime={new Date(movieEndDate)}
                    ampm={false}
                    inputFormat="dd/MM/yyyy HH:mm"
                    mask="__/__/____ __:__"
                    views={['year', 'month', 'day', 'hours', 'minutes']}
                    minutesStep={15}
                />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>Định dạng phim</Typography>
                <TextField
                  fullWidth
                  name="formatMovie"
                  value={showtime.formatMovie}
                  onChange={handleChange}
                  variant="outlined"
                  sx={{ backgroundColor: '#f5f5f5' }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>Trạng thái</Typography>
                <TextField
                  select
                  fullWidth
                  name="status"
                  value={showtime.status}
                  onChange={handleChange}
                  variant="outlined"
                  sx={{ backgroundColor: '#f5f5f5' }}
                >
                  <MenuItem value="Active">Hoạt động</MenuItem>
                  <MenuItem value="Inactive">Không hoạt động</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Box>
        )}
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Hủy
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained" disabled={loading}>
          Tạo
        </Button>
      </DialogActions>
    </Dialog>
  );
}

CreateShowtimeDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleCreateShowtime: PropTypes.func.isRequired,
  movieId: PropTypes.string.isRequired,
  movieReleaseDate: PropTypes.string.isRequired,
  movieEndDate: PropTypes.string.isRequired,
};

export default CreateShowtimeDialog;