import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Grid,
} from '@mui/material';
import { Edit, Delete, Add, Visibility } from '@mui/icons-material';
import { toast } from 'react-toastify';

import CreateFollowUp from './CreateFollowUp';
import UpdateFollowUp from './UpdateFollowUp';
import { FollowUpService } from '../../shared/api/services/followUp.services';

interface FollowUpNote {
  id: string;
  patient_id: string;
  od_s_correction: string;
  od_c_correction: string;
  od_iop: number;
  od_cct: string;
  os_s_correction: string;
  os_c_correction: string;
  os_iop: number;
  os_cct: string;
  examination_findings: string;
  plan: string;
  remark: string;
  diagnosis: string;
  created_at: string;
  updated_at: string;
  patient?: {
    name: string;
  };
}

interface FollowUpListTableProps {
  patientId?: string;
  visitId?: string;
}

const FollowUpListTable: React.FC<FollowUpListTableProps> = ({ patientId, visitId }) => {
  const [followUps, setFollowUps] = useState<FollowUpNote[]>([]);
  const [loading, setLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedFollowUp, setSelectedFollowUp] = useState<FollowUpNote | null>(null);
  const [selectedFollowUpId, setSelectedFollowUpId] = useState<string>('');

  // Fetch follow-up notes
  const fetchFollowUps = async () => {
    setLoading(true);
    try {
      const filters: any = {};
      if (patientId) filters.patient_id = patientId;
      if (visitId) filters.visit_id = visitId;

      const response = await FollowUpService.getList(filters);
      setFollowUps(response.data?.data?.data || response.data?.data || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch follow-up notes');
      console.error('Error fetching follow-ups:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete follow-up note
  const handleDelete = async () => {
    if (!selectedFollowUpId) return;

    setLoading(true);
    try {
      await FollowUpService.delete(selectedFollowUpId);
      toast.success('Follow-up note deleted successfully');
      fetchFollowUps();
      setDeleteOpen(false);
      setSelectedFollowUpId('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete follow-up note');
    } finally {
      setLoading(false);
    }
  };

  // Open view dialog
  const handleView = (followUp: FollowUpNote) => {
    setSelectedFollowUp(followUp);
    setViewOpen(true);
  };

  // Open edit dialog
  const handleEdit = (followUp: FollowUpNote) => {
    setSelectedFollowUp(followUp);
    setUpdateOpen(true);
  };

  // Open delete confirmation
  const handleDeleteClick = (id: string) => {
    setSelectedFollowUpId(id);
    setDeleteOpen(true);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Strip HTML tags for table display
  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '').substring(0, 100) + '...';
  };

  useEffect(() => {
    fetchFollowUps();
  }, [patientId, visitId]);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Follow-up Notes
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setCreateOpen(true)}
        >
          New Follow-up
        </Button>
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell><strong>Diagnosis</strong></TableCell>
              <TableCell><strong>Examination Findings</strong></TableCell>
              <TableCell><strong>Plan</strong></TableCell>
              <TableCell><strong>OD IOP</strong></TableCell>
              <TableCell><strong>OS IOP</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : followUps.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="textSecondary">
                    No follow-up notes found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              followUps.map((followUp) => (
                <TableRow key={followUp.id}>
                  <TableCell>{formatDate(followUp.created_at)}</TableCell>
                  <TableCell>
                    <div dangerouslySetInnerHTML={{ __html: stripHtml(followUp.diagnosis) }} />
                  </TableCell>
                  <TableCell>
                    <div dangerouslySetInnerHTML={{ __html: stripHtml(followUp.examination_findings) }} />
                  </TableCell>
                  <TableCell>
                    <div dangerouslySetInnerHTML={{ __html: stripHtml(followUp.plan) }} />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={followUp.od_iop || 'N/A'} 
                      size="small" 
                      color={followUp.od_iop && followUp.od_iop > 21 ? 'error' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={followUp.os_iop || 'N/A'} 
                      size="small" 
                      color={followUp.os_iop && followUp.os_iop > 21 ? 'error' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => handleView(followUp)} color="info">
                      <Visibility />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleEdit(followUp)} color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDeleteClick(followUp.id)} color="error">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create Dialog */}
      <CreateFollowUp
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={fetchFollowUps}
        patientId={patientId || ''}
        visitId={visitId}
      />

      {/* Update Dialog */}
      <UpdateFollowUp
        open={updateOpen}
        onClose={() => setUpdateOpen(false)}
        onSuccess={fetchFollowUps}
        followUpId={selectedFollowUp?.id || ''}
        followUpData={selectedFollowUp || undefined}
      />

      {/* View Dialog */}
      <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            Follow-up Note Details
          </Typography>
          {selectedFollowUp && (
            <Typography variant="body2" color="textSecondary">
              Created: {formatDate(selectedFollowUp.created_at)}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          {selectedFollowUp && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={3}>
                {/* OD Section */}
                <Grid size={{xs:12, md:6}}>
                  <Typography variant="h6" color="primary.main" gutterBottom>
                    OD (Right Eye)
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    <Typography><strong>S Correction:</strong> {selectedFollowUp.od_s_correction || 'N/A'}</Typography>
                    <Typography><strong>C Correction:</strong> {selectedFollowUp.od_c_correction || 'N/A'}</Typography>
                    <Typography><strong>IOP:</strong> {selectedFollowUp.od_iop || 'N/A'}</Typography>
                    <Typography><strong>CCT:</strong> {selectedFollowUp.od_cct || 'N/A'}</Typography>
                  </Box>
                </Grid>

                {/* OS Section */}
                <Grid size={{xs:12, md:6}}>
                  <Typography variant="h6" color="primary.main" gutterBottom>
                    OS (Left Eye)
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    <Typography><strong>S Correction:</strong> {selectedFollowUp.os_s_correction || 'N/A'}</Typography>
                    <Typography><strong>C Correction:</strong> {selectedFollowUp.os_c_correction || 'N/A'}</Typography>
                    <Typography><strong>IOP:</strong> {selectedFollowUp.os_iop || 'N/A'}</Typography>
                    <Typography><strong>CCT:</strong> {selectedFollowUp.os_cct || 'N/A'}</Typography>
                  </Box>
                </Grid>

                {/* Rich Text Content */}
                <Grid size={12}>
                  <Typography variant="h6" gutterBottom>Examination Findings</Typography>
                  <div dangerouslySetInnerHTML={{ __html: selectedFollowUp.examination_findings }} />
                </Grid>

                <Grid size={12}>
                  <Typography variant="h6" gutterBottom>Diagnosis</Typography>
                  <div dangerouslySetInnerHTML={{ __html: selectedFollowUp.diagnosis }} />
                </Grid>

                <Grid size={12}>
                  <Typography variant="h6" gutterBottom>Plan</Typography>
                  <div dangerouslySetInnerHTML={{ __html: selectedFollowUp.plan }} />
                </Grid>

                {selectedFollowUp.remark && (
                  <Grid size={12}>
                    <Typography variant="h6" gutterBottom>Remark</Typography>
                    <div dangerouslySetInnerHTML={{ __html: selectedFollowUp.remark }} />
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this follow-up note? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : null}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FollowUpListTable;