import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  List,
  ListItem,
  Chip,
  CircularProgress,
  Avatar,
  Divider,
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
  OcularHistoryService,
  type OcularHistory,
} from '../../../../shared/api/services/examination.service';
import { DotMenu } from '../../../shared/ui-component/menu/DotMenu';
import AddOcularHistory from './AddOcularHistory';
import EditOcularHistory from './EditOcularHistory';
import Fallbacks from '../../../shared/components/Fallbacks';

interface Visit {
  visitId: string;
}

/* ---------- Pagination type ---------- */
interface Pagination {
  page: number; // 0-based for MUI
  per_page: number;
  last_page: number;
  total: number;
}

const HistoryTab: React.FC<Visit> = ({ visitId }) => {
  const theme = useTheme();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [histories, setHistories] = useState<OcularHistory[]>([]);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState<OcularHistory | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    page: 0,
    per_page: 10,
    last_page: 0,
    total: 0,
  });

  /* ---------- Helpers ---------- */
  const toggleExpand = (id: number) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const changePage = (_: unknown, newPage: number) => setPagination(p => ({ ...p, page: newPage }));

  const changeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const perPage = Number(e.target.value);
    setPagination(p => ({ ...p, per_page: perPage, page: 0 }));
  };

  /* ---------- Fetch ---------- */
  const fetchHistories = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await OcularHistoryService.list(
        visitId,
        pagination.page + 1,
        pagination.per_page
      );

      const responseData = res.data?.data ?? res.data ?? [];
      const dataList = Array.isArray(responseData.data) ? responseData.data : responseData;

      setHistories(dataList);
      const initialExpanded: Record<number, boolean> = {};
      dataList.forEach((item: OcularHistory) => {
        initialExpanded[item.id] = false;
      });
      setExpanded(initialExpanded);

      setPagination(p => ({
        ...p,
        last_page: responseData.last_page ?? 1,
        total: responseData.total ?? dataList.length,
      }));
    } catch (err: any) {
      toast.error(err?.response?.data?.data?.message ?? 'Failed to load ocular history');
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, pagination.per_page, visitId]);

  /* ---------- CRUD ---------- */
  const addHistory = async (payload: Omit<OcularHistory, 'id' | 'created_at' | 'created_by'>) => {
    setSubmitting(true);
    try {
      await OcularHistoryService.create(payload);
      toast.success('Ocular history added');
      setOpenAdd(false);
      fetchHistories();
    } catch (err: any) {
      toast.error(err?.response?.data?.data?.message ?? 'Add failed');
    } finally {
      setSubmitting(false);
    }
  };

  const editHistory = async (payload: Partial<Omit<OcularHistory, 'id'>>) => {
    if (!selected) return;
    setSubmitting(true);
    try {
      await OcularHistoryService.update(selected.id, payload);
      toast.success('Ocular history updated');
      setOpenEdit(false);
      setSelected(null);
      fetchHistories();
    } catch (err: any) {
      toast.error(err?.response?.data?.data?.message ?? 'Update failed');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteHistory = async (id: number) => {
    try {
      await OcularHistoryService.delete(id);
      toast.success('Ocular history deleted');
      fetchHistories();
    } catch (err: any) {
      toast.error(err?.response?.data?.data?.message ?? 'Delete failed');
    }
  };

  /* ---------- Render ---------- */
  return (
    <Box sx={{ p: 3 }}>
      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress size={30} />
        </Box>
      ) : error ? (
        <Box textAlign="center" py={4}>
          <Fallbacks
            title="No Ocular history Found"
            description="Ocular history will be listed here when available."
          />
          <IconButton onClick={fetchHistories} sx={{ mt: 2 }}>
            <AddIcon />
          </IconButton>
        </Box>
      ) : (
        <Card variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent sx={{ p: 0 }}>
            {/* Header */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              p={3}
              borderBottom={`1px solid ${theme.palette.divider}`}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Ocular History
              </Typography>
              <IconButton
                color="primary"
                sx={{
                  bgcolor: theme.palette.primary.main,
                  color: 'white',
                  '&:hover': { bgcolor: theme.palette.primary.dark },
                }}
                onClick={() => setOpenAdd(true)}
              >
                <AddIcon />
              </IconButton>
            </Box>

            {/* List */}
            {histories.length > 0 ? (
              <List disablePadding>
                {histories.map(h => (
                  <React.Fragment key={h.id}>
                    <ListItem
                      alignItems="flex-start"
                      sx={{
                        p: 0,
                        '&:hover': { bgcolor: theme.palette.action.hover },
                      }}
                    >
                      <Box sx={{ width: '100%' }}>
                        {/* Header Row */}
                        <Box
                          display="flex"
                          alignItems="center"
                          p={2}
                          onClick={() => toggleExpand(h.id)}
                          sx={{
                            cursor: 'pointer',
                            borderBottom: `1px solid ${theme.palette.divider}`,
                          }}
                        >
                          <Avatar
                            sx={{
                              mr: 2,
                              bgcolor: theme.palette.primary.light,
                              color: theme.palette.primary.dark,
                            }}
                          >
                            <DescriptionIcon />
                          </Avatar>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="subtitle1">
                              {new Date(h.created_at).toLocaleDateString()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Recorded by: {h.created_by}
                            </Typography>
                          </Box>
                          <IconButton size="small">
                            {expanded[h.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          </IconButton>
                        </Box>

                        {/* Collapsible Details */}
                        <Collapse in={expanded[h.id]} timeout="auto" unmountOnExit>
                          <Box p={3}>
                            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                              <strong>Current Ocular Medication:</strong>{' '}
                              {h.current_ocular_medication || 'Not specified'}
                            </Typography>
                            <Divider sx={{ my: 1 }} />
                            <Stack spacing={2}>
                              <Box>
                                <Typography variant="body2">
                                  <strong>Contact Lens Use:</strong>{' '}
                                  {h.current_contact_lense_use ? 'Yes' : 'No'}
                                </Typography>
                                {h.current_contact_lense_use && (
                                  <Typography variant="body2">
                                    <strong>Lens Type:</strong> {h.lens_type || 'Not specified'}
                                  </Typography>
                                )}
                              </Box>
                              <Box>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                  <strong>Family History:</strong>
                                </Typography>
                                {h.family_history?.length ? (
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {h.family_history.map((c, i) => (
                                      <Chip
                                        key={i}
                                        label={c}
                                        size="small"
                                        variant="outlined"
                                        sx={{ bgcolor: theme.palette.grey[100] }}
                                      />
                                    ))}
                                  </Box>
                                ) : (
                                  'No family history recorded'
                                )}
                              </Box>
                            </Stack>
                          </Box>
                        </Collapse>
                      </Box>

                      {/* Dot Menu */}
                      <Box sx={{ ml: 'auto', alignSelf: 'flex-start' }}>
                        <DotMenu
                          onEdit={() => {
                            setSelected(h);
                            setOpenEdit(true);
                          }}
                          onDelete={() => deleteHistory(h.id)}
                        />
                      </Box>
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Box sx={{ p: 3 }}>
                <Fallbacks
                  title="No Medical History Found"
                  description="Patient Medical history will be listed here when available."
                />
              </Box>
            )}
          </CardContent>

          {/* Pagination */}
          {histories.length > 0 && (
            <TablePagination
              component="div"
              count={pagination.total}
              page={pagination.page}
              onPageChange={changePage}
              rowsPerPage={pagination.per_page}
              onRowsPerPageChange={changeRowsPerPage}
            />
          )}
        </Card>
      )}

      {/* Modals */}
      <AddOcularHistory
        open={openAdd}
        isSubmitting={submitting}
        onClose={() => setOpenAdd(false)}
        onSubmit={addHistory}
        visitId={visitId}
      />

      {selected && (
        <EditOcularHistory
          open={openEdit}
          isSubmitting={submitting}
          onClose={() => {
            setOpenEdit(false);
            setSelected(null);
          }}
          onSubmit={editHistory}
          ocularHistory={selected}
        />
      )}

      <ToastContainer />
    </Box>
  );
};

export default HistoryTab;
