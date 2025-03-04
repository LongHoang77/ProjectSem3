import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Tabs, Tab, Box, Typography, Card, CardContent, CardActions, Paper } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { TextField } from '@mui/material';
import { vi as viLocale } from 'date-fns/locale';
import axios from 'axios';
import DateNavigationBar from './DateNavigationBar';
import ShowtimeDetailDialog from './ShowtimeDetailDialog';
import PropTypes from 'prop-types';

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
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function MovieUpdateDialog({ open, handleClose, handleUpdate, movie }) {
  const [tabValue, setTabValue] = useState(0);
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
        languages: movie.languages ? movie.languages.join(', ') : '',
        releaseDate: movie.releaseDate ? new Date(movie.releaseDate).toISOString().split('T')[0] : '',
        endDate: movie.endDate ? new Date(movie.endDate).toISOString().split('T')[0] : ''
      });
      setSelectedDate(movie.releaseDate ? new Date(movie.releaseDate) : new Date());
    }
  }, [movie]);

  useEffect(() => {
    fetchShowtimes(selectedDate);
  }, [selectedDate]);

  const handleChange = (e) => {
    setMovieData({ ...movieData, [e.target.name]: e.target.value });
  };

  const handleInputDateChange = (field) => (newValue) => {
    setMovieData(prevData => ({
      ...prevData,
      [field]: newValue ? newValue.toISOString().split('T')[0] : null
    }));
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

  const handleSelectedDateChange = (newDate) => {
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
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={viLocale}>
              <DatePicker
                label="Ngày phát hành"
                value={movieData.releaseDate ? new Date(movieData.releaseDate) : null}
                onChange={(newValue) => handleInputDateChange('releaseDate')(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
              />
              <DatePicker
                label="Ngày kết thúc"
                value={movieData.endDate ? new Date(movieData.endDate) : null}
                onChange={(newValue) => handleInputDateChange('endDate')(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
              />
            </LocalizationProvider>
            <TextField fullWidth margin="normal" name="trailerUrl" label="URL Trailer" value={movieData.trailerUrl} onChange={handleChange} />
            <TextField fullWidth margin="normal" name="posterUrl" label="URL Poster" value={movieData.posterUrl} onChange={handleChange} />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            {movieData.releaseDate && movieData.endDate && (
              <DateNavigationBar
                startDate={new Date(movieData.releaseDate)}
                endDate={new Date(movieData.endDate)}
                selectedDate={selectedDate}
                onDateChange={handleSelectedDateChange}
              />
            )}
            {showtimes.length > 0 ? (
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
            ) : (
              <Paper elevation={2} sx={{ p: 3, mt: 2, textAlign: 'center', borderRadius: 2 }}>
                <Typography variant="h6" color="text.secondary">
                  Không có xuất chiếu nào cho ngày này.
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Vui lòng chọn một ngày khác hoặc thêm xuất chiếu mới.
                </Typography>
              </Paper>
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

MovieUpdateDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  movie: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    duration: PropTypes.number,
    director: PropTypes.string,
    cast: PropTypes.string,
    genre: PropTypes.string,
    releaseDate: PropTypes.string,
    endDate: PropTypes.string,
    languages: PropTypes.arrayOf(PropTypes.string),
    trailerUrl: PropTypes.string,
    posterUrl: PropTypes.string
  })
};

export default MovieUpdateDialog;