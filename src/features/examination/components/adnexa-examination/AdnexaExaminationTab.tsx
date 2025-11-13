import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  List,
  ListItem,
  Divider,
  CircularProgress,
  Collapse,
  TablePagination,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { toast, ToastContainer } from 'react-toastify';
import {
  AdnexaService,
  type AdnexaData,
} from '../../../../shared/api/services/examination.service';
import ErrorPrompt from '../../../shared/components/ErrorPrompt';
import Fallbacks from '../../../shared/components/Fallbacks';
import { DotMenu } from '../../../shared/ui-component/menu/DotMenu';
import { AddAdnexaExamination } from './AddAdnexaExamination';
import { EditAdnexaExamination } from './EditAdnexaExamination';

interface AdnexaExaminationTabProps {
  visitId: string;
}

interface PaginationState {
  page: number;
  per_page: number;
  last_page: number;
  total: number;
}

const AdnexaExaminationTab: React.FC<AdnexaExaminationTabProps> = ({ visitId }) => {
  const theme = useTheme();

  const [loading, setLoading] = useState<boolean>(false);
  const [adnexaExaminations, setAdnexaExaminations] = useState<AdnexaData[]>([]);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<boolean>(false);
  const [openAdd, setOpenAdd] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [selectedExamination, setSelectedExamination] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 0,
    per_page: 10,
    last_page: 0,
    total: 0,
  });

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPagination(prev => ({ ...prev, per_page: parseInt(event.target.value, 10), page: 0 }));
  };

  const fetchAdnexaExaminations = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await AdnexaService.list(visitId, pagination.page + 1, pagination.per_page);
      const data = response.data || response.data || [];

      const adnexaArray = Array.isArray(data?.data) ? data?.data : Array.isArray(data) ? data : [];

      setAdnexaExaminations(adnexaArray);

      const expandedInit: Record<string, boolean> = {};
      adnexaArray.forEach(r => (expandedInit[r.id] = false));
      setExpandedItems(expandedInit);

      const paginationData = response.data?.pagination || {};
      setPagination(prev => ({
        ...prev,
        total: paginationData.total || 0,
        last_page: paginationData.last_page || 0,
      }));
    } catch (err: any) {
      toast.error(err?.response?.data?.data?.message || 'Failed to fetch adnexa examinations');
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdnexaExamination = async (
    examinationData: Omit<AdnexaData, 'id' | 'created_at' | 'created_by'>
  ) => {
    setIsSubmitting(true);
    try {
      await AdnexaService.create(examinationData);
      toast.success('Adnexa examination added successfully');
      fetchAdnexaExaminations();
      setOpenAdd(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.data?.message || 'Failed to add adnexa examination');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateAdnexaExamination = async (
    updatedData: Partial<Omit<AdnexaData, 'id' | 'created_at' | 'created_by'>>
  ) => {
    if (!selectedExamination) return;
    setIsUpdating(true);
    try {
      await AdnexaService.update(selectedExamination.id, updatedData);
      toast.success('Adnexa examination updated successfully');
      fetchAdnexaExaminations();
      setOpenEdit(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.data?.message || 'Failed to update adnexa examination');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAdnexaExamination = async (id: string) => {
    try {
      await AdnexaService.delete(id);
      toast.success('Adnexa examination deleted successfully');
      fetchAdnexaExaminations();
    } catch (err: any) {
      toast.error(err?.response?.data?.data?.message || 'Failed to delete adnexa examination');
    }
  };

  useEffect(() => {
    fetchAdnexaExaminations();
  }, [pagination.page, pagination.per_page]);

  const renderExaminationTable = (examination: AdnexaData) => (
    <Box sx={{ mb: 3 }}>
      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Feature</TableCell>
              <TableCell align="right">OD (Right Eye)</TableCell>
              <TableCell align="right">OS (Left Eye)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(['lids', 'lashes', 'conjunctiva', 'sclera', 'lacrimal_system'] as const).map(
              field => (
                <TableRow key={field}>
                  <TableCell component="th" scope="row">
                    {field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ')}
                  </TableCell>
                  <TableCell align="right">
                    {examination[field].od.value === 'Other'
                      ? examination[field].od.other
                      : examination[field].od.value || '-'}
                  </TableCell>
                  <TableCell align="right">
                    {examination[field].os.value === 'Other'
                      ? examination[field].os.other
                      : examination[field].os.value || '-'}
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Adnexa Examination Records
        </Typography>
        <IconButton
          color="primary"
          onClick={() => setOpenAdd(true)}
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
        <ErrorPrompt
          title="Server Error"
          message="Unable to retrieve adnexa examination records."
        />
      ) : adnexaExaminations.length === 0 ? (
        <Fallbacks
          title="No Adnexa Examination Records Found"
          description="Patient adnexa examination records will be listed here when available."
        />
      ) : (
        <Card variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent sx={{ p: 0 }}>
            <List disablePadding>
              {adnexaExaminations.map(record => (
                <React.Fragment key={record.id}>
                  <ListItem
                    sx={{ p: 0, '&:hover': { backgroundColor: theme.palette.action.hover } }}
                  >
                    <Box width="100%">
                      <Box
                        display="flex"
                        alignItems="center"
                        p={2}
                        onClick={() => toggleExpand(record.id)}
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
                            {new Date(record.created_at!).toLocaleDateString()}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Recorded by: {record.created_by}
                          </Typography>
                        </Box>
                        <IconButton size="small">
                          {expandedItems[record.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </Box>
                      <Collapse in={expandedItems[record.id]} unmountOnExit>
                        <Box p={3}>{renderExaminationTable(record)}</Box>
                      </Collapse>
                    </Box>
                    <Box sx={{ ml: 'auto', alignSelf: 'flex-start' }}>
                      <DotMenu
                        onEdit={() => {
                          setOpenEdit(true);
                          setSelectedExamination(record);
                        }}
                        onDelete={() => handleDeleteAdnexaExamination(record.id)}
                      />
                    </Box>
                  </ListItem>
                  <Divider component="li" sx={{ mx: 3 }} />
                </React.Fragment>
              ))}
            </List>
          </CardContent>
          <TablePagination
            component="div"
            count={pagination.total}
            page={pagination.page}
            onPageChange={handleChangePage}
            rowsPerPage={pagination.per_page}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      )}

      <AddAdnexaExamination
        open={openAdd}
        isSubmitting={isSubmitting}
        onClose={() => setOpenAdd(false)}
        onSubmit={handleAddAdnexaExamination}
        visit={visitId}
      />

      {selectedExamination && (
        <EditAdnexaExamination
          open={openEdit}
          isSubmitting={isUpdating}
          onClose={() => setOpenEdit(false)}
          onSubmit={handleUpdateAdnexaExamination}
          initialData={selectedExamination}
        />
      )}

      <ToastContainer />
    </Box>
  );
};

export default AdnexaExaminationTab;
