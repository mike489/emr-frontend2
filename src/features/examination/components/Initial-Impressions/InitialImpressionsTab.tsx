import React, { useCallback, useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Stack,
  Chip,
  CircularProgress,
  Avatar,
  useTheme,
  TablePagination,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EventIcon from '@mui/icons-material/Event';
import DescriptionIcon from '@mui/icons-material/Description';
import { toast, ToastContainer } from 'react-toastify';
import AddInitialImpressions from './AddInitialImpressions';
import EditInitialImpressions from './EditInitialImpressions';
import {
  type InitialImpression,
  InitialImpressionsService,
} from '../../../../shared/api/services/examination.service';
import ErrorPrompt from '../../../shared/components/ErrorPrompt';
import Fallbacks from '../../../shared/components/Fallbacks';
import { DotMenu } from '../../../shared/ui-component/menu/DotMenu';

interface InitialImpressionsTabProps {
  visitId: string;
}

interface PaginationMeta {
  page: number;
  per_page: number;
  last_page: number;
  total: number;
}

const InitialImpressionsTab: React.FC<InitialImpressionsTabProps> = ({ visitId }) => {
  const theme = useTheme();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [search] = useState('');
  const [impressions, setImpressions] = useState<InitialImpression[]>([]);
  console.log('Impression Data:', impressions);
  const [pagination, setPagination] = useState({ page: 0, per_page: 10 });
  const [meta, setMeta] = useState<PaginationMeta>({
    total: 0,
    last_page: 0,
    page: 0,
    per_page: 10,
  });

  const [openAddImpression, setOpenAddImpression] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedImpression, setSelectedImpression] = useState<InitialImpression | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPagination({ ...pagination, per_page: parseInt(event.target.value, 10), page: 0 });
  };

  const fetchImpressions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await InitialImpressionsService.list(
        visitId,
        pagination.page + 1,
        pagination.per_page,
        search
      );

      console.log('Full API response:', response.data);

      // response.data.data is the object with current_page, data[], total, etc.
      const apiData = response.data.data;

      setImpressions(Array.isArray(apiData.data) ? apiData.data : []);

      setMeta({
        total: apiData.total ?? 0,
        last_page: apiData.last_page ?? 0,
        page: (apiData.current_page ?? 1) - 1,
        per_page: apiData.per_page ?? 10,
      });

      setError(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to fetch initial impressions');
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.per_page, search, visitId]);

  const handleAddImpression = async (data: any) => {
    setIsSubmitting(true);
    try {
      await InitialImpressionsService.create(data);
      toast.success('Initial impression added successfully');
      fetchImpressions();
      setOpenAddImpression(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.data?.message || 'Failed to add initial impression');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateImpression = async (data: any) => {
    if (!selectedImpression) return;
    setIsUpdating(true);
    try {
      await InitialImpressionsService.update(selectedImpression.id, data);
      toast.success('Initial impression updated successfully');
      fetchImpressions();
      setEditModalOpen(false);
      setSelectedImpression(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.data?.message || 'Failed to update initial impression');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteImpression = async (id: string) => {
    try {
      await InitialImpressionsService.delete(id);
      toast.success('Initial impression deleted successfully');

      // If deleting last item on page and not first page, go back a page
      if (impressions.length === 1 && pagination.page > 0) {
        setPagination(prev => ({ ...prev, page: prev.page - 1 }));
      } else {
        fetchImpressions();
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.data?.message || 'Failed to delete initial impression');
    }
  };

  useEffect(() => {
    const debounce = setTimeout(fetchImpressions, 500);
    return () => clearTimeout(debounce);
  }, [search]);

  useEffect(() => {
    fetchImpressions();
  }, [pagination.page, pagination.per_page]);

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Initial Impressions
        </Typography>
        <IconButton
          color="primary"
          onClick={() => setOpenAddImpression(true)}
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: 'white',
            '&:hover': { backgroundColor: theme.palette.primary.dark, color: 'white' },
          }}
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
      ) : impressions.length === 0 ? (
        <Fallbacks
          title="No Initial Impressions Found"
          description="Initial impressions will be listed here when available."
        />
      ) : (
        <Card variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent sx={{ p: 0 }}>
            <List disablePadding>
              {impressions.map((impression, index) => (
                <React.Fragment key={impression.id}>
                  <ListItem
                    alignItems="flex-start"
                    sx={{ p: 3, '&:hover': { backgroundColor: theme.palette.action.hover } }}
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
                            <strong>Primary Diagnosis: </strong>
                            {impression.primary_diagnosis}
                          </Typography>
                          <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Plan: </strong>
                            {impression.plan}
                          </Typography>
                          <Divider sx={{ my: 1 }} />
                          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <strong>Created: </strong>
                              <Chip
                                icon={<EventIcon fontSize="small" />}
                                label={
                                  impression.created_at
                                    ? new Date(impression.created_at).toLocaleDateString()
                                    : ''
                                }
                                size="small"
                                variant="outlined"
                                sx={{ ml: 1, backgroundColor: theme.palette.grey[100] }}
                              />
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              <strong>By: </strong>
                              {impression.created_by}
                            </Typography>
                          </Stack>
                        </Box>
                      }
                    />
                    <Box sx={{ ml: 'auto', alignSelf: 'flex-start' }}>
                      <DotMenu
                        onEdit={() => {
                          setEditModalOpen(true);
                          setSelectedImpression(impression);
                        }}
                        onDelete={() => handleDeleteImpression(impression.id)}
                      />
                    </Box>
                  </ListItem>
                  {index < impressions.length - 1 && <Divider component="li" sx={{ mx: 3 }} />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
          <TablePagination
            component="div"
            count={meta.total}
            page={pagination.page}
            onPageChange={handleChangePage}
            rowsPerPage={pagination.per_page}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Card>
      )}

      <AddInitialImpressions
        open={openAddImpression}
        isSubmitting={isSubmitting}
        onClose={() => setOpenAddImpression(false)}
        onSubmit={handleAddImpression}
        visit={visitId}
      />

      <EditInitialImpressions
        open={editModalOpen}
        isSubmitting={isUpdating}
        onClose={() => setEditModalOpen(false)}
        onSubmit={handleUpdateImpression}
        initialData={selectedImpression as any}
      />

      <ToastContainer />
    </Box>
  );
};

export default InitialImpressionsTab;
