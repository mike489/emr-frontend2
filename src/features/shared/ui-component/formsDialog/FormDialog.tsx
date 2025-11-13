import React, { type ReactNode } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from '@mui/material';

interface FormDialogProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  onSubmit: (event: React.FormEvent) => void;
  submitting?: boolean;
  cancelText?: string;
  submitText?: string;
}

const FormDialog: React.FC<FormDialogProps> = ({
  open,
  title,
  children,
  onClose,
  onSubmit,
  submitting = false,
  cancelText = 'Cancel',
  submitText = 'Submit',
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={onSubmit}>
        <DialogTitle>{title}</DialogTitle>

        <DialogContent dividers>{children}</DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={submitting}>
            {cancelText}
          </Button>
          <Button type="submit" variant="contained" disabled={submitting}>
            {submitting ? <CircularProgress size={20} /> : submitText}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default FormDialog;
