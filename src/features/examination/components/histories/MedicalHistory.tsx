import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  List,
  ListItem,
  CircularProgress,
  Avatar,
  useTheme,
  TablePagination,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { toast, ToastContainer } from 'react-toastify';

import {
  MedicalHistoryService,
  type MedicalHistory,
  type OcularHistory,
} from '../../../../shared/api/services/examination.service';
import { DotMenu } from '../../../shared/ui-component/menu/DotMenu';
import AddMedicalHistories from './AddMedicalHistories';
import EditMedicalHistories from './EditMedicalHistories';
import ErrorPrompt from '../../../shared/components/ErrorPrompt';
import Fallbacks from '../../../shared/components/Fallbacks';

interface Visit {
  visitId: string;
}

interface Pagination {
  page: number;
  per_page: number;
  last_page: number;
  total: number;
}

const MedicalHistoryTab: React.FC<Visit> = ({ visitId }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [ocularHistories, setOcularHistories] = useState<MedicalHistory[]>([]);
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [openAddOcularHistory, setOpenAddOcularHistory] = useState(false);
  const [openEditOcularHistory, setOpenEditOcularHistory] = useState(false);
  const [selectedOcularHistory, setSelectedOcularHistory] = useState<MedicalHistory | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    page: 0,
    per_page: 10,
    last_page: 0,
    total: 0,
  });

  const toggleExpand = (id: number) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPagination(prev => ({
      ...prev,
      per_page: parseInt(event.target.value, 10),
      page: 0,
    }));
  };

  // Fetch ocular histories using the service
  const fetchOcularHistories = async () => {
    setLoading(true);
    try {
      const response = await MedicalHistoryService.list(
        visitId,
        pagination.page + 1,
        pagination.per_page
      );

      const result = response.data;
      const list = result?.data?.data || [];

      setOcularHistories(list);

      // initialize expanded state
      const initialExpanded: Record<number, boolean> = {};
      list.forEach((item: OcularHistory) => {
        initialExpanded[item.id] = false;
      });
      setExpandedItems(initialExpanded);

      setPagination(prev => ({
        ...prev,
        last_page: result?.data?.last_page || 1,
        total: result?.data?.total || 0,
      }));

      setError(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.data?.message || 'Failed to fetch ocular history');
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOcularHistories();
  }, [pagination.page, pagination.per_page, visitId]);

  // Add ocular history
  const handleAddOcularHistory = async (historyData: any) => {
    setIsSubmitting(true);
    try {
      await MedicalHistoryService.create(historyData);
      toast.success('Ocular history added successfully');
      setOpenAddOcularHistory(false);
      fetchOcularHistories();
    } catch (err: any) {
      toast.error(err?.response?.data?.data?.message || 'Failed to add ocular history');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit ocular history
  const handleEditOcularHistory = async (updatedData: any) => {
    if (!selectedOcularHistory) return;
    setIsSubmitting(true);
    try {
      await MedicalHistoryService.update(selectedOcularHistory.id, updatedData);
      toast.success('Ocular history updated successfully');
      setOpenEditOcularHistory(false);
      setSelectedOcularHistory(null);
      fetchOcularHistories();
    } catch (err: any) {
      toast.error(err?.response?.data?.data?.message || 'Failed to update ocular history');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete ocular history
  const handleDeleteOcularHistory = async (id: number) => {
    try {
      await MedicalHistoryService.delete(id);
      toast.success('Ocular history deleted successfully');
      fetchOcularHistories();
    } catch (err: any) {
      toast.error(err?.response?.data?.data?.message || 'Failed to delete ocular history');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress size={24} />
        </Box>
      ) : error ? (
        <ErrorPrompt title="Server Error" message="Unable to retrieve ocular history." />
      ) : (
        <Card variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent sx={{ p: 0 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" p={3}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Medical History
              </Typography>
              <IconButton
                color="primary"
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: 'white',
                  '&:hover': { backgroundColor: theme.palette.primary.dark },
                }}
                onClick={() => setOpenAddOcularHistory(true)}
              >
                <AddIcon />
              </IconButton>
            </Box>

            {ocularHistories.length > 0 ? (
              <List disablePadding>
                {ocularHistories.map(history => (
                  <React.Fragment key={history.id}>
                    <ListItem
                      alignItems="flex-start"
                      sx={{
                        p: 0,
                        '&:hover': { backgroundColor: theme.palette.action.hover },
                      }}
                    >
                      <Box sx={{ width: '100%' }}>
                        <Box
                          display="flex"
                          alignItems="center"
                          p={2}
                          onClick={() => toggleExpand(history.id)}
                          sx={{
                            cursor: 'pointer',
                            borderBottom: `1px solid ${theme.palette.divider}`,
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
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="subtitle1">
                              {new Date(history.created_at).toLocaleDateString()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Recorded by: {history.created_by}
                            </Typography>
                          </Box>
                          <IconButton size="small">
                            {expandedItems[history.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          </IconButton>
                        </Box>

                        {/* <Collapse in={expandedItems[history.id]} timeout="auto" unmountOnExit>
                              <Box p={3}>
                                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                  <strong>Current Ocular Medication:</strong>{' '}
                                  {history.current_ocular_medication || 'Not specified'}
                                </Typography>
                                <Divider sx={{ my: 1 }} />
                                <Stack spacing={2}>
                                  <Box>
                                    <Typography variant="body2">
                                      <strong>Contact Lens Use:</strong>{' '}
                                      {history.current_contact_lense_use ? 'Yes' : 'No'}
                                    </Typography>
                                    {history.current_contact_lense_use && (
                                      <Typography variant="body2">
                                        <strong>Lens Type:</strong>{' '}
                                        {history.lens_type || 'Not specified'}
                                      </Typography>
                                    )}
                                  </Box>
                                  <Box>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                      <strong>Family History:</strong>
                                    </Typography>
                                    {history.family_history.length > 0 ? (
                                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {history.family_history.map(
                                          (
                                            condition:
                                              | boolean
                                              | React.ReactElement<
                                                  unknown,
                                                  string | React.JSXElementConstructor<any>
                                                >
                                              | Iterable<React.ReactNode>
                                              | Promise<
                                                  | string
                                                  | number
                                                  | bigint
                                                  | boolean
                                                  | React.ReactPortal
                                                  | React.ReactElement<
                                                      unknown,
                                                      string | React.JSXElementConstructor<any>
                                                    >
                                                  | Iterable<React.ReactNode>
                                                  | null
                                                  | undefined
                                                >
                                              | React.Key
                                              | null
                                              | undefined
                                          ) => (
                                            <Chip
                                              label={condition}
                                              size="small"
                                              variant="outlined"
                                              sx={{ backgroundColor: theme.palette.grey[100] }}
                                            />
                                          )
                                        )}
                                      </Box>
                                    ) : (
                                      'No family history recorded'
                                    )}
                                  </Box>
                                </Stack>
                              </Box>
                            </Collapse> */}
                      </Box>

                      <Box sx={{ ml: 'auto', alignSelf: 'flex-start' }}>
                        <DotMenu
                          onEdit={() => {
                            setSelectedOcularHistory(history);
                            setOpenEditOcularHistory(true);
                          }}
                          onDelete={() => handleDeleteOcularHistory(history.id)}
                        />
                      </Box>
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Box sx={{ p: 3 }}>
                <Fallbacks
                  title="No Ocular History Found"
                  description="Patient ocular history will be listed here when available."
                />
              </Box>
            )}
          </CardContent>
          {ocularHistories.length > 0 && (
            <TablePagination
              component="div"
              count={pagination.total}
              page={pagination.page}
              onPageChange={handleChangePage}
              rowsPerPage={pagination.per_page}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          )}
        </Card>
      )}

      <AddMedicalHistories
        open={openAddOcularHistory}
        isSubmitting={isSubmitting}
        onClose={() => setOpenAddOcularHistory(false)}
        onSubmit={handleAddOcularHistory} // visit={visitId}
        visitId={visitId}
      />

      {selectedOcularHistory && (
        <EditMedicalHistories
          open={openEditOcularHistory}
          isSubmitting={isSubmitting}
          onClose={() => setOpenEditOcularHistory(false)}
          onSubmit={handleEditOcularHistory}
          medicalHistory={selectedOcularHistory}
          visitId={visitId}
        />
      )}

      <ToastContainer />
    </Box>
  );
};

export default MedicalHistoryTab;
