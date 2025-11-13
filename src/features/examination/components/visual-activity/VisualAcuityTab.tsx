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

import AddVisualAcuity from './AddVisualAcuity';
import EditVisualAcuity from './EditVisualAcuity';
import { VisualAcuityService } from '../../../../shared/api/services/examination.service';
import { DotMenu } from '../../../shared/ui-component/menu/DotMenu';
interface Visit {
  visitId: string;
}

const VisualAcuityTab: React.FC<Visit> = ({ visitId }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [visualAcuities, setVisualAcuities] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});
  const [error, setError] = useState(false);
  const [openAddVisualAcuity, setOpenAddVisualAcuity] = useState(false);
  const [openEditVisualAcuity, setOpenEditVisualAcuity] = useState(false);
  const [selectedVisualAcuity, setSelectedVisualAcuity] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [pagination, setPagination] = useState({
    page: 0,
    per_page: 10,
    last_page: 0,
    total: 0,
  });

  //   const toggleExpand = (id: string) => {
  //     setExpandedItems(prev => ({
  //       ...prev,
  //       [id]: !prev[id],
  //     }));
  //   };

  const handleChangePage = (_event: any, newPage: number) => {
    setPagination({ ...pagination, page: newPage });
  };

  const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
    setPagination({ ...pagination, per_page: parseInt(event.target.value, 10), page: 0 });
  };

  /* -------------------------------------------------------------------------- */
  /*                              FETCH VISUAL DATA                             */
  /* -------------------------------------------------------------------------- */
  const fetchVisualAcuities = async () => {
    if (!visitId) return;
    setLoading(true);
    try {
      const response = await VisualAcuityService.list(visitId);

      // Depending on backend, VisualAcuityService.list() returns either:
      // - { data: [...] } OR
      // - { data: { data: [...], pagination: {...} } }
      const rawData = response.data;
      const acuities = Array.isArray(rawData)
        ? rawData
        : Array.isArray(rawData?.data)
          ? rawData.data
          : [];

      setVisualAcuities(acuities);

      const initialExpanded: Record<string | number, boolean> = {};
      acuities.forEach((item: { id: string | number }) => {
        initialExpanded[item.id] = false;
      });
      setExpandedItems(initialExpanded);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.data?.message || 'Failed to fetch visual acuity records');
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                               ADD NEW RECORDS                              */
  /* -------------------------------------------------------------------------- */
  const handleAddVisualAcuity = async (acuityData: any) => {
    if (!visitId) {
      toast.error('Missing visit ID — cannot add visual acuity');
      return;
    }

    setIsSubmitting(true);
    try {
      // Ensure visit_id is included in the payload
      const payload = {
        ...acuityData,
        visit_id: visitId,
      };

      await VisualAcuityService.create(payload);

      toast.success('Visual acuity added successfully');
      fetchVisualAcuities();
      setOpenAddVisualAcuity(false);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.data?.message || 'Failed to add visual acuity');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                             UPDATE EXISTING RECORD                         */
  /* -------------------------------------------------------------------------- */
  const handleUpdateVisualAcuity = async (updatedData: any) => {
    if (!selectedVisualAcuity) return;
    setIsUpdating(true);
    try {
      await VisualAcuityService.update(selectedVisualAcuity, updatedData);
      toast.success('Visual acuity updated successfully');
      fetchVisualAcuities();
      setOpenEditVisualAcuity(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.data?.message || 'Failed to update visual acuity');
    } finally {
      setIsUpdating(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                              DELETE A RECORD                               */
  /* -------------------------------------------------------------------------- */
  const handleDeleteVisualAcuity = async (id: string) => {
    try {
      await VisualAcuityService.delete(id);
      toast.success('Visual acuity deleted successfully');
      fetchVisualAcuities();
    } catch (error: any) {
      toast.error(error?.response?.data?.data?.message || 'Failed to delete visual acuity');
    }
  };

  useEffect(() => {
    fetchVisualAcuities();
  }, [pagination.page, pagination.per_page, visitId]);

  const renderAcuityTable = (_acuityData: never, title: string) => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        {title}
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell align="right">OD (Right Eye)</TableCell>
              <TableCell align="right">OS (Left Eye)</TableCell>
            </TableRow>
          </TableHead>
          {/* <TableBody>
            <TableRow>
              <TableCell>UCVA</TableCell>
              <TableCell align="right">{acuityData?.distance_od?.ucva || '-'}</TableCell>
              <TableCell align="right">{acuityData?.distance_os?.ucva || '-'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>SCVA</TableCell>
              <TableCell align="right">{acuityData?.distance_od?.scva || '-'}</TableCell>
              <TableCell align="right">{acuityData?.distance_os?.scva || '-'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>BCVA</TableCell>
              <TableCell align="right">{acuityData?.distance_od?.bcva || '-'}</TableCell>
              <TableCell align="right">{acuityData?.distance_os?.bcva || '-'}</TableCell>
            </TableRow>
          </TableBody> */}
        </Table>
      </TableContainer>
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Visual Acuity Records
        </Typography>
        <IconButton
          color="primary"
          onClick={() => setOpenAddVisualAcuity(true)}
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

      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress size={20} />
        </Box>
      ) : error ? (
        <></>
      ) : // <ErrorPrompt title="Server Error" message="Unable to retrieve visual acuity records." />
      visualAcuities.length === 0 ? (
        <></>
      ) : (
        // <Fallbacks
        //   severity="info"
        //   title="No Visual Acuity Records Found"
        //   description="Patient visual acuity records will be listed here when available."
        //   sx={{ paddingTop: 6 }}
        // />
        <Card variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent sx={{ p: 0 }}>
            <List disablePadding>
              {visualAcuities.map((record, index) => (
                <React.Fragment key={record}>
                  <ListItem
                    sx={{
                      p: 0,
                      '&:hover': { backgroundColor: theme.palette.action.hover },
                    }}
                  >
                    <Box>
                      <Box
                        display="flex"
                        alignItems="center"
                        p={2}
                        // onClick={() => toggleExpand(record.id)}
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
                            {/* {new Date(record.created_at).toLocaleDateString()} */}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Recorded by: {record}
                          </Typography>
                        </Box>
                        <IconButton size="small">
                          {expandedItems[record] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </Box>
                      <Collapse in={expandedItems[record]} unmountOnExit>
                        <Box p={3}>
                          {renderAcuityTable(record, 'Distance Visual Acuity')}
                          {renderAcuityTable(record, 'Near Visual Acuity')}
                          {renderAcuityTable(record, 'Pupil Reaction')}
                        </Box>
                      </Collapse>
                    </Box>
                    <Box sx={{ ml: 'auto', alignSelf: 'flex-start' }}>
                      <DotMenu
                        onEdit={() => {
                          setOpenEditVisualAcuity(true);
                          setSelectedVisualAcuity(record);
                        }}
                        onDelete={() => handleDeleteVisualAcuity(record)}
                      />
                    </Box>
                  </ListItem>
                  {index < visualAcuities.length - 1 && <Divider component="li" sx={{ mx: 3 }} />}
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

      <AddVisualAcuity
        open={openAddVisualAcuity}
        isSubmitting={isSubmitting}
        onClose={() => setOpenAddVisualAcuity(false)}
        onSubmit={handleAddVisualAcuity}
        visitId={visitId}
      />

      <EditVisualAcuity
        open={openEditVisualAcuity}
        isSubmitting={isUpdating}
        onClose={() => setOpenEditVisualAcuity(false)}
        onSubmit={handleUpdateVisualAcuity}
        visualAcuity={selectedVisualAcuity}
        visitId={visitId}
      />

      <ToastContainer />
    </Box>
  );
};

export default VisualAcuityTab;
