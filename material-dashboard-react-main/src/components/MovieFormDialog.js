import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

// eslint-disable-next-line react/prop-types
function MovieFormDialog({ open, handleClose, handleSubmit, onError }) {
  const [movieData, setMovieData] = useState({
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

  const handleChange = (e) => {
    setMovieData({ ...movieData, [e.target.name]: e.target.value });
  };

  const onSubmit = async () => {
    try {
      const formattedData = {
        ...movieData,
        duration: parseInt(movieData.duration, 10),
        languages: movieData.languages.split(',').map(lang => lang.trim()),
        releaseDate: new Date(movieData.releaseDate).toISOString(),
        endDate: new Date(movieData.endDate).toISOString()
      };
      await handleSubmit(formattedData);
      handleClose();
    } catch (error) {
      // Gọi hàm onError với thông tin lỗi chi tiết
      onError(error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Thêm Phim Mới</DialogTitle>
      <DialogContent>
        <TextField fullWidth margin="normal" name="title" label="Tên phim" onChange={handleChange} />
        <TextField fullWidth margin="normal" name="description" label="Mô tả" multiline rows={4} onChange={handleChange} />
        <TextField fullWidth margin="normal" name="duration" label="Thời lượng (phút)" type="number" onChange={handleChange} />
        <TextField fullWidth margin="normal" name="director" label="Đạo diễn" onChange={handleChange} />
        <TextField fullWidth margin="normal" name="cast" label="Diễn viên" onChange={handleChange} />
        <TextField fullWidth margin="normal" name="genre" label="Thể loại" onChange={handleChange} />
        <TextField 
          fullWidth 
          margin="normal" 
          name="releaseDate" 
          label="Ngày phát hành" 
          type="datetime-local" 
          InputLabelProps={{ shrink: true }} 
          onChange={handleChange} 
        />
        <TextField 
          fullWidth 
          margin="normal" 
          name="endDate" 
          label="Ngày kết thúc" 
          type="datetime-local" 
          InputLabelProps={{ shrink: true }} 
          onChange={handleChange} 
        />
        <TextField fullWidth margin="normal" name="languages" label="Ngôn ngữ (phân cách bằng dấu phẩy)" onChange={handleChange} />
        <TextField fullWidth margin="normal" name="trailerUrl" label="URL Trailer" onChange={handleChange} />
        <TextField fullWidth margin="normal" name="posterUrl" label="URL Poster" onChange={handleChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Hủy</Button>
        <Button onClick={onSubmit} color="primary">Thêm</Button>
      </DialogActions>
    </Dialog>
  );
}

export default MovieFormDialog;