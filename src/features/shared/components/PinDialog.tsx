
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { useState } from 'react';

interface PinDialogProps {
  open: boolean;
  onClose: () => void;
  moduleTitle: string;
}

const PinDialog: React.FC<PinDialogProps> = ({ open, onClose, moduleTitle }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    if (pin === '1234') { // Replace with real auth logic
      alert(`Access granted to ${moduleTitle}!`);
      onClose();
      setPin('');
      setError(false);
      // Navigate or load module here
    } else {
      setError(true);
    }
  };

  const handleClose = () => {
    setPin('');
    setError(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontWeight="bold">
          Enter PIN for
        </Typography>
        <Typography variant="subtitle1" color="primary">
          {moduleTitle}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1 }}>
          <TextField
            autoFocus
            label="PIN"
            type="password"
            fullWidth
            value={pin}
            onChange={(e) => {
              setPin(e.target.value);
              setError(false);
            }}
            error={error}
            helperText={error ? 'Incorrect PIN' : ''}
            inputProps={{ maxLength: 4 }}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PinDialog;