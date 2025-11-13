import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Divider,
  TablePagination,
  useTheme,
  Avatar,
  Chip,
  Stack,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';
import EventIcon from '@mui/icons-material/Event';
import { toast, ToastContainer } from 'react-toastify';
import AddComplaint from './AddComplaint';
import EditComplaint from './EditComplaint';
import { ComplaintService } from '../../../../shared/api/services/examination.service';
import { DotMenu } from '../../../shared/ui-component/menu/DotMenu';
import ErrorPrompt from '../../../shared/components/ErrorPrompt';
import Fallbacks from '../../../shared/components/Fallbacks';

interface Complaint {
  id: string;
  primary_complaint: string;
  visit_date: string;
  created_by: string;
  created_at: string;
}

interface ComplaintTabProps {
  visitId: string;
}

const ComplaintTab: React.FC<ComplaintTabProps> = ({ visitId }) => {
  const theme = useTheme();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(false);

  const fetchComplaints = async () => {
    if (!visitId) return;
    setLoading(true);
    try {
      const res = await ComplaintService.list(visitId, page + 1, rowsPerPage);
      setComplaints(res.data?.data.data || []);
      setTotal(res.data.data.total || 0);
      setError(false);
    } catch (err: any) {
      setError(true);
      toast.error(err.response?.data?.data.message || 'Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComplaint = async (data: any) => {
    try {
      await ComplaintService.create(data);
      toast.success('Complaint added');
      setOpenAdd(false);
      fetchComplaints();
    } catch (err: any) {
      console.log('err', err);
      toast.error(err.response.data.data.message || 'Failed to add complaint');
    }
  };

  const handleEditComplaint = async (data: { primary_complaint: string }) => {
    if (!selectedComplaint) return;
    try {
      await ComplaintService.update(selectedComplaint.id, data);
      toast.success('Complaint updated');
      setOpenEdit(false);
      fetchComplaints();
    } catch (err: any) {
      toast.error(err.response.data.data.message || 'Failed to update complaint');
    }
  };

  const handleDeleteComplaint = async (id: string) => {
    if (!confirm('Are you sure you want to delete this complaint?')) return;
    try {
      await ComplaintService.delete(id);
      toast.success('Complaint deleted');
      fetchComplaints();
    } catch (err: any) {
      toast.error(err.response.data.data.message || 'Failed to delete complaint');
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [visitId, page, rowsPerPage]);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Patient Complaints</Typography>
        <IconButton
          color="primary"
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: 'white',
            '&:hover': { backgroundColor: theme.palette.primary.dark, color: 'white' },
          }}
          onClick={() => setOpenAdd(true)}
        >
          <AddIcon />
        </IconButton>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress size={20} />
        </Box>
      ) : error ? (
        <ErrorPrompt title="Server Error" message="Unable to retrieve initial impressions." />
      ) : complaints.length === 0 ? (
        <Fallbacks
          title="No Initial Impressions Found"
          description="Initial impressions will be listed here when available."
        />
      ) : (
        <Card variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent sx={{ p: 0 }}>
            <List disablePadding>
              {complaints.map((complaint, index) => (
                <React.Fragment key={complaint.id}>
                  <ListItem
                    alignItems="flex-start"
                    sx={{
                      p: 3,
                      '&:hover': { backgroundColor: theme.palette.action.hover },
                    }}
                  >
                    <Avatar
                      sx={{
                        mr: 2,
                        backgroundColor: theme.palette.primary.light,
                        color: theme.palette.primary.dark,
                      }}
                    >
                      <DescriptionIcon />
                    </Avatar>
                    <ListItemText
                      primary={
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle1" sx={{ mb: 1 }}>
                            <strong>Primary Complaint: </strong>
                            {complaint.primary_complaint}
                          </Typography>
                          <Divider sx={{ my: 1 }} />
                          <Stack
                            direction="column"
                            spacing={2}
                            alignItems="flex-start"
                            flexWrap="wrap"
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <strong>Visit Date: </strong>
                              <Chip
                                icon={<EventIcon fontSize="small" />}
                                label={new Date(complaint.visit_date).toLocaleDateString()}
                                size="small"
                                variant="outlined"
                                sx={{ ml: 1, backgroundColor: theme.palette.grey[100] }}
                              />
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              <strong>Creator: </strong>
                              {complaint.created_by}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              <strong>Recorded: </strong>
                              {new Date(complaint.created_at).toLocaleString()}
                            </Typography>
                          </Stack>
                        </Box>
                      }
                    />
                    <Box sx={{ ml: 'auto', alignSelf: 'flex-start' }}>
                      <DotMenu
                        onEdit={() => {
                          setSelectedComplaint(complaint);
                          setOpenEdit(true);
                        }}
                        onDelete={() => handleDeleteComplaint(complaint.id)}
                      />
                    </Box>
                  </ListItem>
                  {index < complaints.length - 1 && <Divider component="li" sx={{ mx: 3 }} />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
          {complaints.length > 0 && (
            <TablePagination
              component="div"
              count={total}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={(_e, newPage) => setPage(newPage)}
              onRowsPerPageChange={e => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 25]}
            />
          )}
        </Card>
      )}

      <AddComplaint
        open={openAdd}
        isSubmitting={loading}
        onClose={() => setOpenAdd(false)}
        onSubmit={handleAddComplaint}
        visitId={visitId}
      />

      <EditComplaint
        open={openEdit}
        isSubmitting={loading}
        onClose={() => setOpenEdit(false)}
        onSubmit={handleEditComplaint}
        complaint={selectedComplaint}
      />

      <ToastContainer />
    </Box>
  );
};

export default ComplaintTab;
