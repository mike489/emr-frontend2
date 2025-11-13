
import { Box, Container, Typography } from '@mui/material';
import Logo from '.././../.././assets/images/logo-icon.svg';

const Footer = () => {
  return (
    <Container
      maxWidth="lg"
      component="footer"
      sx={{
        mt: 8,
        py: 3,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Powered by
        </Typography>

        {/* Droga Consulting Logo */}
        <Box
          component="img"
          src={Logo} 
          alt="Droga Consulting"
          sx={{
            height: 28,
            width: 'auto',
            filter: 'grayscale(30%)',
            transition: 'all 0.3s ease',
            '&:hover': {
              filter: 'grayscale(0%)',
              transform: 'scale(1.05)',
            },
          }}
        />

        <Typography
          variant="caption"
          fontWeight="bold"
          color="primary"
          sx={{ ml: 0.5 }}
        >
          Droga Consulting
        </Typography>
      </Box>
    </Container>
  );
};

export default Footer;