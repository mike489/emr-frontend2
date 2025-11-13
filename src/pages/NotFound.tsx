
import { Container, Box, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
      <Paper
        elevation={0}
        sx={{
          p: 6,
          borderRadius: 3,
          border: '1px dashed #ccc',
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ mb: 3 }}>
          <ErrorOutlineIcon sx={{ fontSize: 80, color: 'error.main' }} />
        </Box>

        <Typography variant="h3" fontWeight="bold" gutterBottom>
          404
        </Typography>

        <Typography variant="h6" color="text.secondary" paragraph>
          Oops! The page you're looking for doesn't exist.
        </Typography>

        <Typography variant="body2" color="text.secondary" paragraph>
          It might have been moved, deleted, or you may have mistyped the URL.
        </Typography>

        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/')}
            sx={{ minWidth: 140 }}
          >
            Go Home
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate(-1)}
            sx={{ minWidth: 140 }}
          >
            Go Back
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default NotFound;