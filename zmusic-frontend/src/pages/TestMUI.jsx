import React from 'react';
import { Box, Typography, Button } from '@mui/material';

function TestMUI() {
  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h2" color="primary" gutterBottom>
        Material-UI Test
      </Typography>
      <Typography variant="body1" gutterBottom>
        If you can see this styled text, MUI is working! 🎉
      </Typography>
      <Button variant="contained" color="primary" sx={{ mt: 2 }}>
        Test Button
      </Button>
    </Box>
  );
}

export default TestMUI;
