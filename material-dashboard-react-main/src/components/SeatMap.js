import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Grid, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';

const SeatButton = styled(Button)(({ theme, status }) => ({
  minWidth: '30px',
  height: '30px',
  margin: '2px',
  padding: '0',
  backgroundColor: status === 'available' ? theme.palette.success.light : theme.palette.error.light,
  '&:hover': {
    backgroundColor: status === 'available' ? theme.palette.success.main : theme.palette.error.main,
  },
}));

function SeatMap({ roomId }) {
  const [seatData, setSeatData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSeatData = async () => {
      try {
        const response = await axios.post('http://localhost:5000/Seat/getseats', { RoomId: roomId });
        setSeatData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching seat data:', err);
        setError('Không thể tải dữ liệu ghế');
        setLoading(false);
      }
    };

    fetchSeatData();
  }, [roomId]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!seatData || !seatData.seatMap) {
    return <Typography>Không có dữ liệu ghế</Typography>;
  }

  const rows = seatData.seatMap;

  return (
    <Box>
      {rows.map((row, rowIndex) => (
        <Grid container key={rowIndex} justifyContent="center">
          {row.split(',').map((seat, seatIndex) => (
            <SeatButton
              key={`${rowIndex}-${seatIndex}`}
              variant="contained"
              status="available"
            >
              {seat}
            </SeatButton>
          ))}
        </Grid>
      ))}
    </Box>
  );
}

export default SeatMap;