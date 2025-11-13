import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import { toast } from 'react-toastify';

interface Complaint {
  id: string;
  primary_complaint: string;
}

interface EditComplaintProps {
  open: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (data: { primary_complaint: string }) => void;
  complaint?: Complaint | null;
}

const EditComplaint: React.FC<EditComplaintProps> = ({
  open,
  isSubmitting,
  onClose,
  onSubmit,
  complaint,
}) => {
  const [complaintData, setComplaintData] = useState({ primary_complaint: '' });

  useEffect(() => {
    if (complaint && open) {
      setComplaintData({ primary_complaint: complaint.primary_complaint || '' });
    }
  }, [complaint, open]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setComplaintData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!complaintData.primary_complaint.trim()) {
      toast.error('Please fill all required fields.');
      return;
    }
    onSubmit(complaintData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Edit Complaint</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Primary Complaint"
            name="primary_complaint"
            value={complaintData.primary_complaint}
            onChange={handleChange}
            margin="normal"
            required
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditComplaint;
