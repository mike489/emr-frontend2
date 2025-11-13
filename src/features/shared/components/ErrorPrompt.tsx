import { Typography, Paper, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface ErrorPromptProps {
  title: string;
  message?: string;
  onRetry?: () => void;
}

const ErrorPrompt: React.FC<ErrorPromptProps> = ({ title, message, onRetry }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6,
        px: 3,
        textAlign: 'center',
        border: '1px solid',
        borderColor: 'error.main',
        borderRadius: 2,
        bgcolor: 'background.default',
      }}
    >
      <ErrorOutlineIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
      <Typography variant="h6" gutterBottom color="error">
        {title}
      </Typography>
      {message && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {message}
        </Typography>
      )}
      {onRetry && (
        <Button variant="contained" color="error" onClick={onRetry}>
          Retry
        </Button>
      )}
    </Paper>
  );
};

export default ErrorPrompt;
