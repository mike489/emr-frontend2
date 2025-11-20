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
} from '@mui/material';
import { Edit, Delete, Add, Visibility } from '@mui/icons-material';
import { toast } from 'react-toastify';

import CreateFollowUp from './CreateFollowUp';
import UpdateFollowUp from './UpdateFollowUp';
import ViewFollowUpModal, { type FollowUpNote } from './ViewFollowUpModal'; // Import the new modal
import { FollowUpService } from '../../shared/api/services/followUp.service';
import { Eye } from 'lucide-react';
import type { ExaminationData } from '../../shared/api/types/examination.types';
import { PatientService } from '../../shared/api/services/patient.service';
import PreviousHistoryModal from './PreviousHistoryModal';

interface FollowUpListTableProps {
  patientId?: string;
  visitId?: string;
  consultantId: string;
}

const FollowUpListTable: React.FC<FollowUpListTableProps> = ({
  patientId,
  visitId,
  consultantId,
}) => {
  const [followUps, setFollowUps] = useState<FollowUpNote[]>([]);
  const [loading, setLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedFollowUp, setSelectedFollowUp] = useState<FollowUpNote | null>(null);
  const [selectedFollowUpId, setSelectedFollowUpId] = useState<string>('');
  const [historyOpen, setHistoryOpen] = useState(false);
  const [examData, setExamData] = useState<ExaminationData | null>(null);

  const handleOpenHistory = async () => {
    try {
      setHistoryOpen(true);

      if (!consultantId) {
        toast.error('Consultant ID is required to fetch history');
        return;
      }

      const response = await PatientService.getExaminationData(consultantId);
      const examData =response.data?.data?.data.examination_data 
      setExamData(examData);
      setHistoryOpen(true);
    } catch (error: any) {
    
      const errorMessage =
        error.response?.data?.data.message;
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').substring(0, 100) + '...';
  };

  useEffect(() => {
    fetchFollowUps();
  }, [patientId, visitId]);

  return (
    <Box sx={{ p: 4, backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Follow up Notes
        </Typography>
        <Box sx={{display:'flex', justifyContent:'space-between', gap:4}}>
          <Button
            variant="outlined"
            startIcon={<Eye />}
            onClick={handleOpenHistory}
            disabled={loading}
          >
            See Previous History
          </Button>

          <Button variant="contained" startIcon={<Add />} onClick={() => setCreateOpen(true)}>
            New Follow-up
          </Button>
        </Box>
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Date</strong>
              </TableCell>
              <TableCell>
                <strong>Diagnosis</strong>
              </TableCell>
              <TableCell>
                <strong>Examination Findings</strong>
              </TableCell>
              <TableCell>
                <strong>Plan</strong>
              </TableCell>
              <TableCell>
                <strong>OD IOP</strong>
              </TableCell>
              <TableCell>
                <strong>OS IOP</strong>
              </TableCell>
              <TableCell>
                <strong>Actions</strong>
              </TableCell>
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
                  <Typography color="textSecondary">No follow-up notes found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              followUps.map(followUp => (
                <TableRow key={followUp.id}>
                  <TableCell>{formatDate(followUp.created_at)}</TableCell>
                  <TableCell>
                    <div dangerouslySetInnerHTML={{ __html: stripHtml(followUp.diagnosis) }} />
                  </TableCell>
                  <TableCell>
                    <div
                      dangerouslySetInnerHTML={{ __html: stripHtml(followUp.examination_findings) }}
                    />
                  </TableCell>
                  <TableCell>
                    <div dangerouslySetInnerHTML={{ __html: stripHtml(followUp.plan) }} />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={followUp.od_iop || 'N/A'}
                      size="small"
                      color={followUp.od_iop ? 'error' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={followUp.os_iop || 'N/A'}
                      size="small"
                      color={followUp.os_iop ? 'error' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => handleView(followUp)} color="info">
                      <Visibility />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleEdit(followUp)} color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(followUp.id)}
                      color="error"
                    >
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

      {/* Previous History Modal */}
      <PreviousHistoryModal
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        data={examData}
      />

      {/* Update Dialog */}
      <UpdateFollowUp
        open={updateOpen}
        onClose={() => setUpdateOpen(false)}
        onSuccess={fetchFollowUps}
        followUpId={selectedFollowUp?.id || ''}
        followUpData={selectedFollowUp || undefined}
        patientId={patientId}
      />

      {/* View Dialog - Using the new component */}
      <ViewFollowUpModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        selectedFollowUp={selectedFollowUp}
      />

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
