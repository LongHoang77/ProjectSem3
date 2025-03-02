import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, Button, Grid, Divider, Box, TextField, MenuItem, Snackbar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import SeatMap from './SeatMap';

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  backgroundColor: theme.palette.info.main,
  color: theme.palette.info.contrastText,
}));

const InfoItem = ({ label, value }) => (
  <Box mb={2}>
    <Typography variant="subtitle2" color="textSecondary">{label}</Typography>
    <Typography variant="body1">{value}</Typography>
  </Box>
);

function ShowtimeDetailDialog({ open, onClose, showTimeDetails, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedShowtime, setEditedShowtime] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  // Removed seatData state and fetchSeatData function

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const calculateEndTime = (startTime, duration) => {
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + duration);
    return formatTime(endTime);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedShowtime({...showTimeDetails});
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedShowtime(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (newValue) => {
    setEditedShowtime(prev => ({ ...prev, startTime: newValue }));
  };

  const handleSave = async () => {
    try {
      const response = await axios.put('http://localhost:5000/Movie/updateshowtime', editedShowtime);
      if (response.status === 200) {
        onUpdate(response.data);
        setIsEditing(false);
        setSnackbar({ open: true, message: 'Cập nhật thành công', severity: 'success' });
      }
    } catch (error) {
      console.error('Error updating showtime:', error);
      setSnackbar({ open: true, message: 'Cập nhật thất bại', severity: 'error' });
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <StyledDialogTitle>Chi tiết xuất chiếu</StyledDialogTitle>
        <DialogContent>
          {showTimeDetails && !isEditing && (
            <Box mt={2}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <InfoItem label="Phim" value={showTimeDetails.movieTitle} />
                </Grid>
                <Grid item xs={6}>
                  <InfoItem label="Phòng" value={showTimeDetails.roomName} />
                </Grid>
                <Grid item xs={6}>
                  <InfoItem label="Định dạng" value={showTimeDetails.formatMovie} />
                </Grid>
              </Grid>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <InfoItem
                    label="Bắt đầu"
                    value={formatTime(showTimeDetails.startTime)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InfoItem
                    label="Kết thúc"
                    value={formatTime(showTimeDetails.endTime)}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={6}>
                  <InfoItem label="Trạng thái" value={showTimeDetails.status} />
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Sơ đồ ghế
              </Typography>
              <SeatMap roomId={showTimeDetails.roomId} />
            </Box>
          )}
          {isEditing && editedShowtime && (
            <Box mt={2}>
              <Typography variant="h6" gutterBottom>
                Chi tiết xuất chiếu
              </Typography>
              <TextField
                fullWidth
                label="Phim ID"
                name="movieId"
                value={editedShowtime.movieId}
                onChange={handleInputChange}
                margin="normal"
              />
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Phòng ID"
                    name="roomId"
                    value={editedShowtime.roomId}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Định dạng"
                    name="formatMovie"
                    value={editedShowtime.formatMovie}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Bắt đầu"
                  value={editedShowtime.startTime}
                  onChange={handleDateChange}
                  renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                />
              </LocalizationProvider>
              <TextField
                select
                fullWidth
                label="Trạng thái"
                name="status"
                value={editedShowtime.status}
                onChange={handleInputChange}
                margin="normal"
              >
                <MenuItem value="Hoạt động">Hoạt động</MenuItem>
                <MenuItem value="Không hoạt động">Không hoạt động</MenuItem>
              </TextField>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {!isEditing ? (
            <Button onClick={handleEditClick} color="primary" variant="outlined">
              Sửa
            </Button>
          ) : (
            <>
              <Button onClick={() => setIsEditing(false)} color="secondary" variant="outlined">
                Hủy
              </Button>
              <Button onClick={handleSave} color="primary" variant="contained">
                Lưu
              </Button>
            </>
          )}
          <Button onClick={onClose} color="primary" variant="contained">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </>
  );
}

export default ShowtimeDetailDialog;