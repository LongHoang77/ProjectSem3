import React, { useState, useEffect } from 'react';
import {
  Box, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Tabs, Tab, Typography, Card, CardContent, CardActions
} from '@mui/material';
import DateNavigationBar from './DateNavigationBar';
import ShowtimeDetailDialog from './ShowtimeDetailDialog';
import axios from 'axios';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import viLocale from 'date-fns/locale/vi';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function MovieUpdateDialog({ open, handleClose, handleUpdate, movie }) {
  const [movieData, setMovieData] = useState({
    id: '',
    title: '',
    description: '',
    duration: '',
    director: '',
    cast: '',
    genre: '',
    releaseDate: '',
    endDate: '',
    languages: '',
    trailerUrl: '',
    posterUrl: ''
  });

  const [tabValue, setTabValue] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showtimes, setShowtimes] = useState([]);
  const [showTimeDetails, setShowTimeDetails] = useState(null);
  const [showTimeDetailsOpen, setShowTimeDetailsOpen] = useState(false);

  const fetchShowtimeDetails = async (showtimeId) => {
    try {
      const response = await axios.get(`http://localhost:5000/Movie/getshowtime/${showtimeId}`);
      setShowTimeDetails(response.data);
      setShowTimeDetailsOpen(true);
    } catch (error) {
      console.error('Error fetching showtime details:', error);
    }
  };

  useEffect(() => {
    if (movie) {
      setMovieData({
        ...movie,
        languages: movie.languages.join(', '),
        releaseDate: new Date(movie.releaseDate).toISOString().split('T')[0],
        endDate: new Date(movie.endDate).toISOString().split('T')[0]
      });
      setSelectedDate(new Date(movie.releaseDate));
    }
  }, [movie]);

  useEffect(() => {
    fetchShowtimes(selectedDate);
  }, [selectedDate]);

  const handleChange = (e) => {
    setMovieData({ ...movieData, [e.target.name]: e.target.value });
  };

  const onSubmit = () => {
    const formattedData = {
      ...movieData,
      duration: parseInt(movieData.duration, 10),
      languages: movieData.languages.split(',').map(lang => lang.trim()),
      releaseDate: new Date(movieData.releaseDate).toISOString(),
      endDate: new Date(movieData.endDate).toISOString()
    };
    handleUpdate(formattedData);
    handleClose();
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const fetchShowtimes = async (date) => {
    try {
      const response = await axios.get(`http://localhost:5000/Movie/GetAllShowtimes/${movieData.id}?date=${date.toISOString()}`);
      setShowtimes(response.data);
    } catch (error) {
      console.error("Error fetching showtimes:", error);
      setShowtimes([]);
    }
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={viLocale}>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="movie update tabs">
            <Tab label="Cập nhật phim" />
            <Tab label="Xuất chiếu" />
          </Tabs>
        </DialogTitle>
        <DialogContent>
          <TabPanel value={tabValue} index={0}>
            <TextField fullWidth margin="normal" name="title" label="Tên phim" value={movieData.title} onChange={handleChange} />
            <TextField fullWidth margin="normal" name="description" label="Mô tả" multiline rows={4} value={movieData.description} onChange={handleChange} />
            <TextField fullWidth margin="normal" name="duration" label="Thời lượng (phút)" type="number" value={movieData.duration} onChange={handleChange} />
            <TextField fullWidth margin="normal" name="director" label="Đạo diễn" value={movieData.director} onChange={handleChange} />
            <TextField fullWidth margin="normal" name="cast" label="Diễn viên" value={movieData.cast} onChange={handleChange} />
            <TextField fullWidth margin="normal" name="genre" label="Thể loại" value={movieData.genre} onChange={handleChange} />
            <TextField
              fullWidth
              margin="normal"
              name="releaseDate"
              label="Ngày phát hành"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={movieData.releaseDate}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              name="endDate"
              label="Ngày kết thúc"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={movieData.endDate}
              onChange={handleChange}
            />
            <TextField fullWidth margin="normal" name="languages" label="Ngôn ngữ (phân cách bằng dấu phẩy)" value={movieData.languages} onChange={handleChange} />
            <TextField fullWidth margin="normal" name="trailerUrl" label="URL Trailer" value={movieData.trailerUrl} onChange={handleChange} />
            <TextField fullWidth margin="normal" name="posterUrl" label="URL Poster" value={movieData.posterUrl} onChange={handleChange} />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            {movieData.releaseDate && movieData.endDate && (
              <DateNavigationBar
                startDate={new Date(movieData.releaseDate)}
                endDate={new Date(movieData.endDate)}
                selectedDate={selectedDate}
                onDateChange={handleDateChange}
              />
            )}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', mt: 2 }}>
              {showtimes.map((showtime) => (
                <Card key={showtime.id} sx={{ width: 280, display: 'flex', flexDirection: 'column' }}>
                  <CardContent>
                    <Typography variant="h5" component="div" gutterBottom>
                      {formatTime(showtime.startTime)} - {formatTime(showtime.endTime)}
                    </Typography>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      {showtime.roomName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Định dạng: {showtime.formatMovie}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Trạng thái: {showtime.status}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => fetchShowtimeDetails(showtime.id)}
                      fullWidth
                      sx={{ color: "#1a78f3", borderColor: "#287deb" }}
                    >
                      Chi tiết
                    </Button>
                  </CardActions>
                </Card>
              ))}
            </Box>
            {showtimes.length === 0 && (
              <Typography variant="body1" align="center">
                Không có xuất chiếu nào cho ngày này.
              </Typography>
            )}
          </TabPanel>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={onSubmit} color="primary">Cập nhật</Button>
        </DialogActions>
      </Dialog>
      <ShowtimeDetailDialog
        open={showTimeDetailsOpen}
        onClose={() => setShowTimeDetailsOpen(false)}
        showTimeDetails={showTimeDetails}
      />
    </LocalizationProvider>
  );
}

export default MovieUpdateDialog;