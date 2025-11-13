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
  Collapse,
  TablePagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';

import AddOcularMotility from './AddOcularMotility';
import EditOcularMotility from './EditOcularMotility';

import {
  OcularMotilityService,
  type OcularMotility,
} from '../../../../shared/api/services/examination.service';
import { DotMenu } from '../../../shared/ui-component/menu/DotMenu';
import ErrorPrompt from '../../../shared/components/ErrorPrompt';
import Fallbacks from '../../../shared/components/Fallbacks';

interface OcularMotilityProps {
  visitId: string;
}

const OcularMotilityTab: React.FC<OcularMotilityProps> = ({ visitId }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [search] = useState('');
  const [ocularMotilities, setOcularMotilities] = useState<OcularMotility[]>([]);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const [selectedMotility, setSelectedMotility] = useState<OcularMotility | null>(null);
  const [pagination, setPagination] = useState({
    page: 0,
    per_page: 10,
    total: 0,
  });

  const fetchOcularMotilities = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await OcularMotilityService.list(
        visitId,
        pagination.page + 1,
        pagination.per_page,
        search
      );

      const data = response.data;

      setOcularMotilities(data.data);
      setExpandedItems(
        data.data.reduce((acc: any, item: any) => ({ ...acc, [item.id]: false }), {})
      );
      setPagination(prev => ({ ...prev, total: data.pagination.total }));
    } catch (err: any) {
      console.error(err); // helpful for debugging
      toast.error(err?.response?.data?.data?.message || 'Failed to fetch ocular motilities');
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (motilityData: any) => {
    setIsSubmitting(true);
    try {
      await OcularMotilityService.create(motilityData);
      toast.success('Ocular motility examination added successfully');
      fetchOcularMotilities();
      setOpenAdd(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.data?.message || 'Failed to add ocular motility');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (
    updatedData: Partial<Omit<OcularMotility, 'id' | 'created_at' | 'created_by'>>
  ) => {
    if (!selectedMotility) return;
    setIsSubmitting(true);
    try {
      await OcularMotilityService.update(selectedMotility.id, updatedData);
      toast.success('Ocular motility examination updated successfully');
      fetchOcularMotilities();
      setOpenEdit(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.data?.message || 'Failed to update ocular motility');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await OcularMotilityService.delete(id);
      toast.success('Ocular motility examination deleted successfully');
      fetchOcularMotilities();
    } catch (err: any) {
      toast.error(err?.response?.data?.data?.message || 'Failed to delete ocular motility');
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    fetchOcularMotilities();
  }, [pagination.page, pagination.per_page, search]);

  const renderExaminationDetails = (motility: OcularMotility) => (
    <Box sx={{ p: 3 }}>
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Test</TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>EOM</TableCell>
              <TableCell>
                <Typography variant="body2">
                  <strong>Value:</strong> {motility.eom?.value || '-'}
                </Typography>
                <Typography variant="body2">
                  <strong>Gaze:</strong> {motility.eom?.gaze || '-'}
                </Typography>
                <Typography variant="body2">
                  <strong>Eye:</strong> {motility.eom?.eye || '-'}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Hirschberg Test</TableCell>
              <TableCell>
                <Typography variant="body2">
                  <strong>Value:</strong> {motility.hirschberg_test?.value || '-'}
                </Typography>
                <Typography variant="body2">
                  <strong>Eye:</strong> {motility.hirschberg_test?.eye || '-'}
                </Typography>
                <Typography variant="body2">
                  <strong>Deviation:</strong> {motility.hirschberg_test?.deviation || '-'}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Cover/Uncover Test</TableCell>
              <TableCell>
                <Typography variant="body2">
                  <strong>Value:</strong> {motility.cover_uncover_test?.value || '-'}
                </Typography>
                <Typography variant="body2">
                  <strong>Phoria:</strong> {motility.cover_uncover_test?.phoria || '-'}
                </Typography>
                <Typography variant="body2">
                  <strong>Tropia:</strong> {motility.cover_uncover_test?.tropia || '-'}
                </Typography>
                <Typography variant="body2">
                  <strong>Direction:</strong> {motility.cover_uncover_test?.direction || '-'}
                </Typography>
                <Typography variant="body2">
                  <strong>Distance:</strong> {motility.cover_uncover_test?.distance || '-'}
                </Typography>
                <Typography variant="body2">
                  <strong>Near:</strong> {motility.cover_uncover_test?.near || '-'}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Stereopsis</TableCell>
              <TableCell>
                <Typography variant="body2">
                  <strong>Value:</strong> {motility.stereopsis?.value || '-'}
                </Typography>
                <Typography variant="body2">
                  <strong>Test:</strong> {motility.stereopsis?.test || '-'}
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  return (
    <Box>
      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress size={20} />
        </Box>
      ) : error ? (
        <ErrorPrompt
          title="Server Error"
          message="Unable to retrieve ocular motility examinations."
          onRetry={fetchOcularMotilities}
        />
      ) : (
        <Card variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent sx={{ p: 0 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" p={3}>
              <Typography variant="h6" fontWeight={600}>
                Ocular Motility Examinations
              </Typography>
              <IconButton
                onClick={() => setOpenAdd(true)}
                color="primary"
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: 'white',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                    color: 'white',
                  },
                }}
              >
                <AddIcon />
              </IconButton>
            </Box>

            {ocularMotilities.length > 0 ? (
              <List disablePadding>
                {ocularMotilities.map(motility => (
                  <ListItem
                    key={motility.id}
                    sx={{ p: 0, '&:hover': { backgroundColor: theme.palette.action.hover } }}
                  >
                    <Box width="100%">
                      <Box
                        display="flex"
                        alignItems="center"
                        p={2}
                        onClick={() => toggleExpand(motility.id)}
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
                            {new Date(motility.created_at || '').toLocaleDateString()}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Recorded by: {motility.created_by || 'System'}
                          </Typography>
                        </Box>
                        <IconButton size="small">
                          {expandedItems[motility.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </Box>
                      <Collapse in={expandedItems[motility.id]} unmountOnExit>
                        {renderExaminationDetails(motility)}
                      </Collapse>
                    </Box>
                    <Box sx={{ ml: 'auto', alignSelf: 'flex-start' }}>
                      <DotMenu
                        onEdit={() => {
                          setSelectedMotility(motility);
                          setOpenEdit(true);
                        }}
                        onDelete={() => handleDelete(motility.id)}
                      />
                    </Box>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box p={3}>
                <Fallbacks
                  title="No Ocular Motility Examinations Found"
                  description="Patient ocular motility examinations will be listed here when available."
                />
              </Box>
            )}
          </CardContent>
          <TablePagination
            component="div"
            count={pagination.total}
            page={pagination.page}
            onPageChange={(_e, newPage) => setPagination(prev => ({ ...prev, page: newPage }))}
            rowsPerPage={pagination.per_page}
            onRowsPerPageChange={e =>
              setPagination(prev => ({ ...prev, per_page: parseInt(e.target.value), page: 0 }))
            }
          />
        </Card>
      )}

      <AddOcularMotility
        open={openAdd}
        isSubmitting={isSubmitting}
        onClose={() => setOpenAdd(false)}
        onSubmit={handleAdd}
        visit={visitId}
      />

      <EditOcularMotility
        open={openEdit}
        isSubmitting={isSubmitting}
        onClose={() => setOpenEdit(false)}
        onSubmit={handleEdit}
        initialData={selectedMotility}
      />
      <ToastContainer />
    </Box>
  );
};

export default OcularMotilityTab;
