
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import { useState } from 'react';

interface ForgotPasswordDialogProps {
  open: boolean;
  onClose: () => void;
}

const ForgotPasswordDialog = ({ open, onClose }: ForgotPasswordDialogProps) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setSuccess(false);

    // Simulate API call
    setTimeout(() => {
      if (email.includes('@')) {
        setSuccess(true);
        setLoading(false);
        setTimeout(() => {
          onClose();
          setEmail('');
          setSuccess(false);
        }, 2000);
      } else {
        setError(true);
        setLoading(false);
      }
    }, 1000);
  };

  const handleClose = () => {
    setEmail('');
    setError(false);
    setSuccess(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, p: 1 },
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <Typography variant="h6" fontWeight="bold" color="primary">
          Reset Password
        </Typography>
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 1 }}>
          <Typography variant="body2" color="text.secondary" textAlign="center" mb={2}>
            Enter your email address and we'll send you a link to reset your password.
          </Typography>

          <TextField
            autoFocus
            label="Email Address"
            type="email"
            fullWidth
            size="small"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(false);
            }}
            error={error}
            helperText={error ? 'Please enter a valid email' : ''}
            disabled={loading || success}
          />

          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Reset link sent to <strong>{email}</strong>
            </Alert>
          )}
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center', pb: 2, gap: 1 }}>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || success || !email}
            sx={{ minWidth: 100 }}
          >
            {loading ? 'Sending...' : 'Send Link'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default ForgotPasswordDialog;