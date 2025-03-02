import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem, Snackbar } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import axios from 'axios';

function CreateShowtimeDialog({ open, onClose, movieId, onShowtimeCreated }) {
  const [showtime, setShowtime] = useState({
    movieId: movieId,
    roomId: '',
    startTime: null,
    formatMovie: '',
    status: 'Active'
  });
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch rooms when the dialog opens
    if (open) {
      fetchRooms();
    }
  }, [open]);

  const fetchRooms = async () => {
    try {
      const response = await axios.get('http://localhost:5000/Room/getall');
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setError('Không thể tải danh sách phòng. Vui lòng thử lại sau.');
    }
  };

  const handleChange = (e) => {
    setShowtime({ ...showtime, [e.target.name]: e.target.value });
  };

  const handleDateChange = (newValue) => {
    setShowtime({ ...showtime, startTime: newValue });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:5000/Movie/createshowtime', {
        ...showtime,
        startTime: showtime.startTime.toISOString()
      });
      onShowtimeCreated(response.data);
      onClose();
    } catch (error) {
      console.error('Error creating showtime:', error);
      setError('Không thể tạo xuất chiếu. Vui lòng kiểm tra lại thông tin và thử lại.');
    }
  };

  const handleCloseError = () => {
    setError('');
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Tạo Xuất Chiếu Mới</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            name="movieId"
            label="ID Phim"
            value={showtime.movieId}
            onChange={handleChange}
            disabled
          />
          <TextField
            select
            fullWidth
            margin="normal"
            name="roomId"
            label="Phòng chiếu"
            value={showtime.roomId}
            onChange={handleChange}
          >
            {rooms.map((room) => (
              <MenuItem key={room.id} value={room.id}>{room.name}</MenuItem>
            ))}
          </TextField>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Thời gian bắt đầu"
              value={showtime.startTime}
              onChange={handleDateChange}
              renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
            />
          </LocalizationProvider>
          <TextField
            fullWidth
            margin="normal"
            name="formatMovie"
            label="Định dạng phim"
            value={showtime.formatMovie}
            onChange={handleChange}
          />
          <TextField
            select
            fullWidth
            margin="normal"
            name="status"
            label="Trạng thái"
            value={showtime.status}
            onChange={handleChange}
          >
            <MenuItem value="Active">Hoạt động</MenuItem>
            <MenuItem value="Inactive">Không hoạt động</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Hủy</Button>
          <Button onClick={handleSubmit} color="primary">Tạo</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        message={error}
      />
    </>
  );
}

export default CreateShowtimeDialog;