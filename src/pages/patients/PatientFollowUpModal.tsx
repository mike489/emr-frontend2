import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Tabs,
  Tab,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { FollowUpService } from '../../shared/api/services/followUp.service';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`follow-up-tabpanel-${index}`}
      aria-labelledby={`follow-up-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

interface PatientFollowUpModalProps {
  open: boolean;
  onClose: () => void;
  patientId: string;
  patientName?: string;
}

const PatientFollowUpModal: React.FC<PatientFollowUpModalProps> = ({
  open,
  onClose,
  patientId,
  patientName,
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    visualAcuities: [] as any[],
    iopValues: [] as any[],
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const fetchData = async () => {
    if (!patientId) return;
    setLoading(true);
    try {
      const [vaRes, iopRes] = await Promise.all([
        FollowUpService.getVisualAcuitiesValues(patientId),
        FollowUpService.getIopValues(patientId),
      ]);

      setData({
        visualAcuities: vaRes.data?.data || [],
        iopValues: iopRes.data?.data?.iop_values || [],
      });
    } catch (error) {
      console.error('Error fetching follow-up data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && patientId) {
      fetchData();
    }
  }, [open, patientId]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Patient Follow-up Data - {patientName}</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ p: 0, minHeight: '400px' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
            <Tab label="Visual Acuities" />
            <Tab label="IOP Values" />
          </Tabs>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="300px">
            <CircularProgress />
          </Box>
        ) : (
          <>
            <CustomTabPanel value={tabValue} index={0}>
              {data.visualAcuities.length > 0 ? (
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: 'action.hover' }}>
                        <TableCell><strong>Date</strong></TableCell>
                        <TableCell><strong>Type</strong></TableCell>
                        <TableCell align="center"><strong>OD (Right)</strong></TableCell>
                        <TableCell align="center"><strong>OS (Left)</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.visualAcuities.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell>
                            {item.created_at ? new Date(item.created_at).toLocaleDateString() : '—'}
                          </TableCell>
                          <TableCell>{item.type || 'Distance'}</TableCell>
                          <TableCell align="center">{item.od || '—'}</TableCell>
                          <TableCell align="center">{item.os || '—'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
                   No visual acuities recorded.
                </Typography>
              )}
            </CustomTabPanel>

            <CustomTabPanel value={tabValue} index={1}>
              {data.iopValues.length > 0 ? (
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: 'action.hover' }}>
                        <TableCell><strong>Date</strong></TableCell>
                        <TableCell align="center"><strong>OD (Right)</strong></TableCell>
                        <TableCell align="center"><strong>OS (Left)</strong></TableCell>
                        <TableCell><strong>Method</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.iopValues.map((val, index) => (
                        <TableRow key={index}>
                          <TableCell>{val.date ? new Date(val.date).toLocaleDateString() : '—'}</TableCell>
                          <TableCell align="center">{val.iop_od || '—'}</TableCell>
                          <TableCell align="center">{val.iop_os || '—'}</TableCell>
                          <TableCell>{val.method || '—'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
                   No IOP values recorded.
                </Typography>
              )}
            </CustomTabPanel>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PatientFollowUpModal;
