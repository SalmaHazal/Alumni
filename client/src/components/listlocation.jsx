import React from 'react';
import { Select, MenuItem, FormControl, InputLabel, FormHelperText } from '@mui/material';

function YourComponent({ handleBlur, handleChange, values, touched, errors }) {
  return (
    <FormControl 
      error={Boolean(touched.location) && Boolean(errors.location)} 
      sx={{ gridColumn: "span 4" }}
      fullWidth
    >
      <InputLabel id="location-label">Location</InputLabel>
      <Select
        labelId="location-label"
        id="location"
        value={values.location}
        name="location"
        onBlur={handleBlur}
        onChange={handleChange}
        label="Location"
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        <MenuItem value="location1">Location 1</MenuItem>
        <MenuItem value="location2">Location 2</MenuItem>
        <MenuItem value="location3">Location 3</MenuItem>
      </Select>
      {Boolean(touched.location) && Boolean(errors.location) && (
        <FormHelperText>{errors.location}</FormHelperText>
      )}
    </FormControl>
  );
}

export default YourComponent;
