import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Grid,
  List,
  ListItem,
  CircularProgress,
  Avatar,
  Stack,
  useTheme,
  Collapse,
  TablePagination,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { toast, ToastContainer } from 'react-toastify';
import {
  type IntraocularPressure,
  IntraocularPressureService,
  type IntraocularPressureListResponse,
} from '../../../../shared/api/services/examination.service';
import ErrorPrompt from '../../../shared/components/ErrorPrompt';
import Fallbacks from '../../../shared/components/Fallbacks';
import { DotMenu } from '../../../shared/ui-component/menu/DotMenu';
import AddIntraocularPressure from './AddIntraocularPressure';
import EditIntraocularPressure from './EditIntraocularPressure';

interface IntraocularPressureTabProps {
  visitId: string;
}

const IntraocularPressureTab: React.FC<IntraocularPressureTabProps> = ({ visitId }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [pressures, setPressures] = useState<IntraocularPressure[]>([]);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedPressure, setSelectedPressure] = useState<IntraocularPressure | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pagination, setPagination] = useState({
    page: 0,
    per_page: 10,
    total: 0,
  });

  const fetchPressures = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await IntraocularPressureService.list(
        visitId,
        pagination.page + 1,
        pagination.per_page
      );

      const data: IntraocularPressureListResponse = response.data;

      if (!Array.isArray(data.data)) {
        console.error('Expected array, got:', data.data);
        setPressures([]);
        setExpandedItems({});
        return;
      }

      setPressures(data.data);
      setExpandedItems(data.data.reduce((acc, item) => ({ ...acc, [item.id]: false }), {}));
      setPagination(prev => ({ ...prev, total: data.pagination.total }));
    } catch (err: any) {
      toast.error(err?.response?.data?.data?.message || 'Failed to fetch intraocular pressures');
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPressure = async (
    pressureData: Omit<IntraocularPressure, 'id' | 'created_at' | 'created_by'>
  ) => {
    setIsSubmitting(true);
    try {
      await IntraocularPressureService.create(pressureData);
      toast.success('Pressure measurement added successfully');
      fetchPressures();
      setOpenAddModal(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.data?.message || 'Failed to add pressure measurement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditPressure = async (
    updatedData: Partial<Omit<IntraocularPressure, 'id' | 'created_at' | 'created_by'>>
  ) => {
    if (!selectedPressure) return;
    setIsSubmitting(true);
    try {
      await IntraocularPressureService.update(selectedPressure.id, updatedData);
      toast.success('Pressure measurement updated successfully');
      fetchPressures();
      setOpenEditModal(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.data?.message || 'Failed to update pressure measurement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePressure = async (id: string) => {
    try {
      await IntraocularPressureService.delete(id);
      toast.success('Pressure measurement deleted successfully');
      fetchPressures();
    } catch (err: any) {
      toast.error(err?.response?.data?.data?.message || 'Failed to delete pressure measurement');
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const parseMethod = (method: IntraocularPressure['method']) => {
    if (!method) return 'Unknown';
    return method.value === 'other' && method.other ? method.other : method.value;
  };

  useEffect(() => {
    fetchPressures();
  }, [pagination.page, pagination.per_page]);

  return (
    <Box>
      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress size={20} />
        </Box>
      ) : error ? (
        <ErrorPrompt
          title="Server Error"
          message="Unable to retrieve intraocular pressure measurements."
        />
      ) : (
        <Card variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent sx={{ p: 0 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" p={3}>
              <Typography variant="h6" fontWeight={600}>
                Intraocular Pressure Measurements
              </Typography>
              <IconButton
                color="primary"
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: 'white',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                    color: 'white',
                  },
                }}
                onClick={() => setOpenAddModal(true)}
              >
                <AddIcon />
              </IconButton>
            </Box>

            {pressures.length > 0 ? (
              <List disablePadding>
                {pressures.map(pressure => (
                  <ListItem
                    key={pressure.id}
                    sx={{ p: 0, '&:hover': { backgroundColor: theme.palette.action.hover } }}
                  >
                    <Box width="100%">
                      <Box
                        display="flex"
                        alignItems="center"
                        p={2}
                        onClick={() => toggleExpand(pressure.id)}
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
                        <Box flexGrow={1}>
                          <Typography variant="subtitle1">
                            {new Date(pressure.created_at || '').toLocaleDateString()}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Recorded by: {pressure.created_by || 'System'}
                          </Typography>
                        </Box>
                        <IconButton size="small">
                          {expandedItems[pressure.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </Box>
                      <Collapse in={expandedItems[pressure.id]} unmountOnExit>
                        <Box p={3}>
                          <Stack spacing={2}>
                            <Grid container spacing={2}>
                              <Grid>
                                <Typography variant="subtitle1">
                                  <strong>Left Eye:</strong> {pressure.left_eye} mmHg
                                </Typography>
                              </Grid>
                              <Grid>
                                <Typography variant="subtitle1">
                                  <strong>Right Eye:</strong> {pressure.right_eye} mmHg
                                </Typography>
                              </Grid>
                              <Grid>
                                <Typography variant="subtitle1">
                                  <strong>Time of Measurement:</strong>{' '}
                                  {pressure.time_of_measurement}
                                </Typography>
                              </Grid>
                              <Grid>
                                <Typography variant="subtitle1">
                                  <strong>Method:</strong> {parseMethod(pressure.method)}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Stack>
                        </Box>
                      </Collapse>
                    </Box>
                    <Box sx={{ ml: 'auto', alignSelf: 'flex-start' }}>
                      <DotMenu
                        onEdit={() => {
                          setSelectedPressure(pressure);
                          setOpenEditModal(true);
                        }}
                        onDelete={() => handleDeletePressure(pressure.id)}
                      />
                    </Box>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box p={3}>
                <Fallbacks
                  title="No Pressure Measurements Found"
                  description="Intraocular pressure measurements will be listed here when available."
                />
              </Box>
            )}
          </CardContent>
          {pressures.length > 0 && (
            <TablePagination
              component="div"
              count={pagination.total}
              page={pagination.page}
              onPageChange={(_, newPage) => setPagination(prev => ({ ...prev, page: newPage }))}
              rowsPerPage={pagination.per_page}
              onRowsPerPageChange={e =>
                setPagination(prev => ({ ...prev, per_page: Number(e.target.value), page: 0 }))
              }
            />
          )}
        </Card>
      )}

      <AddIntraocularPressure
        open={openAddModal}
        isSubmitting={isSubmitting}
        onClose={() => setOpenAddModal(false)}
        onSubmit={handleAddPressure}
        visit={visitId}
      />

      <EditIntraocularPressure
        open={openEditModal}
        isSubmitting={isSubmitting}
        onClose={() => setOpenEditModal(false)}
        onSubmit={handleEditPressure}
        pressure={selectedPressure}
        visit={visitId}
      />

      <ToastContainer />
    </Box>
  );
};

export default IntraocularPressureTab;
