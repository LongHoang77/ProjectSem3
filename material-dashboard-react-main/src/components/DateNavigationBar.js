import React from 'react';
import PropTypes from 'prop-types';
import { Box, IconButton, Typography } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import viLocale from 'date-fns/locale/vi';

function DateNavigationBar({ startDate, endDate, selectedDate, onDateChange }) {
  const formatDate = (date) => {
    return date.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handlePrevDate = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    if (newDate >= startDate) {
      onDateChange(newDate);
    }
  };

  const handleNextDate = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    if (newDate <= endDate) {
      onDateChange(newDate);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={viLocale}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <IconButton onClick={handlePrevDate} disabled={selectedDate <= startDate}>
          <ArrowBackIosNewIcon />
        </IconButton>
        <DatePicker
          value={selectedDate}
          onChange={onDateChange}
          minDate={startDate}
          maxDate={endDate}
          renderInput={({ inputRef, inputProps, InputProps }) => (
            <Box ref={inputRef} {...inputProps} style={{ cursor: 'pointer' }}>
              <Typography variant="h6">
                {formatDate(selectedDate)}
              </Typography>
              {InputProps?.endAdornment}
            </Box>
          )}
        />
        <IconButton onClick={handleNextDate} disabled={selectedDate >= endDate}>
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>
    </LocalizationProvider>
  );
}

DateNavigationBar.propTypes = {
  startDate: PropTypes.instanceOf(Date).isRequired,
  endDate: PropTypes.instanceOf(Date).isRequired,
  selectedDate: PropTypes.instanceOf(Date).isRequired,
  onDateChange: PropTypes.func.isRequired,
};

export default DateNavigationBar;