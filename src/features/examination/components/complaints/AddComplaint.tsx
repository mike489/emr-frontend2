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

interface AddComplaintProps {
  open: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (data: { visit_id: string; primary_complaint: string }) => void;
  visitId: string;
}

const AddComplaint: React.FC<AddComplaintProps> = ({
  open,
  isSubmitting,
  onClose,
  onSubmit,
  visitId,
}) => {
  const [complaintData, setComplaintData] = useState({ visit_id: visitId, primary_complaint: '' });

  useEffect(() => {
    if (open) {
      setComplaintData({ visit_id: visitId, primary_complaint: '' });
    }
  }, [open, visitId]);

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
        <DialogTitle>Add Complaint</DialogTitle>
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
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddComplaint;
