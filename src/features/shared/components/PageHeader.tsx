import { Box, Typography, Button, Stack } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
}

const PageHeader = ({ title, onBack }: PageHeaderProps) => {
  return (
    <Stack spacing={0}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
          px: 4,
          py: 2,
          bgcolor: 'primary.main',
          color: 'white',
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
      >
        {onBack && (
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={onBack}
            variant="outlined"
            sx={{
              color: 'white',
              borderColor: 'white',
              borderRadius: 2,
              '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
            }}
          >
            Back
          </Button>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Typography
            variant="h6"
            fontWeight="bold"
            textAlign="center"
            alignItems="center"
            justifySelf="center"
            alignSelf="center"
          >
            {title}
          </Typography>
        </Box>
      </Box>
    </Stack>
  );
};

export default PageHeader;
