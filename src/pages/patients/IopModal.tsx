import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Box,
  CircularProgress,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface IopValue {
  id: string; // or whichever key exists, or use array index
  date: string;
  iop_od: string;
  iop_os: string;
  technician?: string;
}

interface IopModalProps {
  open: boolean;
  onClose: () => void;
  iopValues: IopValue[];
  loading: boolean;
  patientName?: string;
}

const IopModal: React.FC<IopModalProps> = ({ open, onClose, iopValues, loading, patientName }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">IOP Values - {patientName}</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : iopValues.length > 0 ? (
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: 'action.hover' }}>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell align="center"><strong>OD (Right)</strong></TableCell>
                  <TableCell align="center"><strong>OS (Left)</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {iopValues.map((val, index) => (
                  <TableRow key={val.id || index}>
                    <TableCell>{val.date ? new Date(val.date).toLocaleDateString() : '—'}</TableCell>
                    <TableCell align="center">{val.iop_od || '—'}</TableCell>
                    <TableCell align="center">{val.iop_os || '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body2" color="text.secondary" align="center" py={2}>
            No IOP values recorded for this patient.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default IopModal;
