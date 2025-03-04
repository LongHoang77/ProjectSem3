import React from 'react';
import { Box, IconButton, Typography, Paper } from '@mui/material';
import { ChevronLeft, ChevronRight, CalendarToday } from '@mui/icons-material';
import { format, addDays, isSameDay } from 'date-fns';
import { vi } from 'date-fns/locale';

function DateNavigationBar({ startDate, endDate, selectedDate, onDateChange }) {
  const handlePrevDate = () => {
    const newDate = addDays(selectedDate, -1);
    if (newDate >= startDate) {
      onDateChange(newDate);
    }
  };

  const handleNextDate = () => {
    const newDate = addDays(selectedDate, 1);
    if (newDate <= endDate) {
      onDateChange(newDate);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <IconButton onClick={handlePrevDate} disabled={isSameDay(selectedDate, startDate)}>
          <ChevronLeft />
        </IconButton>
        <Box display="flex" alignItems="center">
          <CalendarToday sx={{ mr: 1 }} color="primary" />
          <Typography variant="h6" component="span">
            {format(selectedDate, 'EEEE, dd MMMM, yyyy', { locale: vi })}
          </Typography>
        </Box>
        <IconButton onClick={handleNextDate} disabled={isSameDay(selectedDate, endDate)}>
          <ChevronRight />
        </IconButton>
      </Box>
    </Paper>
  );
}

export default DateNavigationBar;