import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
} from '@mui/material';
import { useState } from 'react';

type AllergyModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (allergy: string) => void;
  patientName?: string;
};

const AllergyModal = ({ open, onClose, onSubmit, patientName }: AllergyModalProps) => {
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) return;
    const allergy = notes ? `${name.trim()} - ${notes}` : name.trim();
    onSubmit(allergy);
    setName('');
    setNotes('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Allergy for {patientName}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Allergy Name"
            value={name}
            onChange={e => setName(e.target.value)}
            fullWidth
            required
            autoFocus
          />
          <TextField
            label="Notes (Optional)"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            fullWidth
            multiline
            rows={2}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!name.trim()}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AllergyModal;
