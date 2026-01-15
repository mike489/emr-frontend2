import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Button,
  styled,
  Checkbox,
  FormControlLabel,
  Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PrintIcon from '@mui/icons-material/Print';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';

interface OrderItem {
  id: string;
  medicine_id: string;
  name: string;
  quantity: number;
  price: string;
  total_price: string;
  status: string | number;
  default_code: string;
  is_payment_completed: any;
}

interface PharmacyOrder {
  id: string;
  patient_id: string;
  patient_name: string;
  order_number: string;
  total_amount: string;
  status: string;
  created_at: string;
  items: OrderItem[];
  notes?: string;
}

interface PharmacyOrderDetailModalProps {
  open: boolean;
  onClose: () => void;
  order: PharmacyOrder | null;
  loading: boolean;
  error: string | null;
  onResultSubmit?: () => void;
}


// Styled component for screen-only content
const ScreenOnlyContent = styled(Box)(({}) => ({
  '@media print': {
    display: 'none',
  },
}));

const PharmacyOrderDetailModal: React.FC<PharmacyOrderDetailModalProps> = ({
  open,
  onClose,
  order,
  loading,
  error,
  onResultSubmit,
}) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [results, setResults] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleResultChange = (itemId: string, value: string) => {
    setResults(prev => ({ ...prev, [itemId]: value }));
  };

  console.log('first', handleResultChange);

  const handleSubmitResults = async () => {
    if (!order) return;
    try {
      setSubmitting(true);
      setSubmitError(null);

      // We'll follow the pattern of LaboratoryService.createPharmacyMedicinesOrder
      // but targeting a new (assumed) endpoint for results
      const resultsToSubmit = Object.entries(results)
        .filter(([itemId, result]) => {
          const item = order.items.find(i => i.id === itemId);
          const isPaid = item?.is_payment_completed === '1';
          return result.trim() !== '' && isPaid;
        })
        .map(([itemId, result]) => ({
          order_item_id: itemId,
          result: result,
        }));

      if (resultsToSubmit.length === 0) {
        setSubmitError('Please enter results for paid items');
        setSubmitting(false);
        return;
      }

      // Placeholder for actual result submission service call
      // await LaboratoryService.submitPharmacyResults(resultsToSubmit);

      onResultSubmit?.();
      onClose();
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || 'Failed to submit results');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked && order) {
      setSelectedItems(order.items.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId: string) => {
    setSelectedItems(prev =>
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const handlePrint = () => {
    if (!order) return;

    // Filter items based on selection
    const itemsToPrint =
      selectedItems.length > 0
        ? order.items.filter(item => selectedItems.includes(item.id))
        : order.items;

    // Calculate total for selected items

    // Create print-specific window
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Prescription - ${order.patient_name}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&display=swap');
            body {
              font-family: 'Crimson Pro', serif;
              margin: 40px;
              color: #1a1a1a;
              line-height: 1.6;
            }
            .prescription-pad {
              max-width: 800px;
              margin: 0 auto;
              position: relative;
              min-height: 1000px;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
              border-bottom: 2px double #2c3e50;
              padding-bottom: 20px;
            }
            .clinic-name {
              font-size: 32px;
              font-weight: 700;
              color: #2c3e50;
              letter-spacing: 1px;
            }
            .clinic-details {
              font-size: 14px;
              color: #7f8c8d;
            }
            .patient-section {
              display: grid;
              grid-template-columns: 2fr 1fr;
              margin-bottom: 40px;
              font-size: 18px;
              border-bottom: 1px solid #eee;
              padding-bottom: 10px;
            }
            .rx-symbol {
              font-size: 60px;
              font-family: 'Times New Roman', serif;
              font-weight: bold;
              color: #2c3e50;
              margin: 20px 0;
            }
            .medication-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 50px;
            }
            .medication-table th {
              text-align: left;
              border-bottom: 2px solid #2c3e50;
              padding: 12px;
              font-size: 16px;
              text-transform: uppercase;
              color: #2c3e50;
            }
            .medication-table td {
              padding: 15px 12px;
              border-bottom: 1px solid #eee;
              font-size: 18px;
            }
            .footer {
              position: absolute;
              bottom: 100px;
              width: 100%;
              display: flex;
              justify-content: flex-end;
            }
            .signature-box {
              text-align: center;
              width: 250px;
            }
            .signature-line {
              border-top: 1px solid #2c3e50;
              margin-top: 50px;
              padding-top: 10px;
              font-weight: 600;
            }
            @media print {
              .no-print { display: none; }
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          <div class="prescription-pad">
            <div class="header">
              <div class="clinic-name">DROGA TECHNOLOGY EMR</div>
              <div class="clinic-details">
                Addis Ababa, Ethiopia | Tel: +251 112 345 678 | Email: contact@drogatech.com
              </div>
            </div>
            
            <div class="patient-section">
              <div>
                <strong>Patient Name:</strong> ${order.patient_name}
              </div>
              <div style="text-align: right;">
                <strong>Date:</strong> ${formatDate(order.created_at)}
              </div>
            </div>
            
            <div class="rx-symbol">℞</div>
            
            <table class="medication-table">
              <thead>
                <tr>
                  <th>Medication Details</th>
                  <th style="text-align: center; width: 100px;">Qty</th>
                  <th style="text-align: right; width: 150px;">Status</th>
                </tr>
              </thead>
              <tbody>
                ${itemsToPrint
                  .map(
                    item => `
                  <tr style="${item.is_payment_completed === '1' ? 'text-decoration: line-through;' : ''}">
                    <td>
                      <div style="font-weight: bold;">${item.name}</div>
                      <div style="font-size: 14px; color: #666;">Unit Price: Birr ${parseFloat(item.price).toFixed(2)}</div>
                    </td>
                    <td style="text-align: center;">${item.quantity}</td>
                    <td style="text-align: right; font-style: italic; color: ${item.is_payment_completed === '1' ? '#27ae60' : '#e74c3c'}">
                      ${item.is_payment_completed === '1' ? 'Paid' : 'Unpaid'}
                    </td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>
            
            ${
              order.notes
                ? `
              <div style="margin-top: 20px;">
                <strong>Instructions:</strong>
                <p style="white-space: pre-wrap;">${order.notes}</p>
              </div>
            `
                : ''
            }
            
            <div class="footer">
              <div class="signature-box">
                <div class="signature-line">Doctor's Signature & Stamp</div>
              </div>
            </div>
          </div>
          
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() {
                window.close();
              }, 100);
            };
          </script>
        </body>
        </html>
      `);

      printWindow.document.close();
    }
  };

  // const getStatusChip = (status: string | number) => {
  //   const statusMap: Record<
  //     string | number,
  //     {
  //       label: string;
  //       color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  //     }
  //   > = {
  //     '0': { label: 'Pending', color: 'warning' },
  //     '1': { label: 'Completed', color: 'success' },
  //     '2': { label: 'Rejected', color: 'error' },
  //   };

  //   return statusMap[status] || { label: 'Unknown', color: 'default' };
  // };

  const calculateSelectedTotal = () => {
    if (!order) return 0;
    return order.items
      .filter(item => selectedItems.includes(item.id))
      .reduce((sum, item) => sum + parseFloat(item.total_price), 0);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          '@media print': {
            margin: 0,
            height: '100%',
            maxWidth: '100%',
            boxShadow: 'none',
            position: 'absolute',
            top: 0,
            left: 0,
          },
        },
      }}
    >
      {/* Screen-only content */}
      <ScreenOnlyContent>
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            bgcolor: 'primary.main',
            color: 'white',
            py: 2,
            '@media print': {
              display: 'none',
            },
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Order Details
          </Typography>
          <IconButton onClick={onClose} sx={{ color: 'white' }} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
      </ScreenOnlyContent>

      <DialogContent sx={{ p: 3 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2, '@media print': { display: 'none' } }}>
            {error}
          </Alert>
        ) : submitError ? (
          <Alert severity="error" sx={{ mb: 2, '@media print': { display: 'none' } }}>
            {submitError}
          </Alert>
        ) : order ? (
          <Box
            sx={{
              bgcolor: '#fff',
              minHeight: '700px',
              padding: '40px',
              position: 'relative',
              boxShadow: '0 0 20px rgba(0,0,0,0.05)',
              borderRadius: '8px',
              border: '1px solid #e0e0e0',
              fontFamily: '"Crimson Pro", serif',
            }}
          >
            {/* Prescription Header */}
            <Box sx={{ textAlign: 'center', mb: 4, borderBottom: '2px double #1a237e', pb: 2 }}>
              <Typography variant="h4" sx={{ color: '#1a237e', fontWeight: 'bold', mb: 0.5 }}>
                DROGA TECHNOLOGY EMR
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Addis Ababa, Ethiopia | Tel: +251 112 345 678
              </Typography>
            </Box>

            {/* Patient Info Bar */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, borderBottom: '1px solid #eee', pb: 1 }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Typography variant="body1" fontWeight="bold">Patient Name:</Typography>
                <Typography variant="body1">{order.patient_name}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Typography variant="body1" fontWeight="bold">Date:</Typography>
                <Typography variant="body1">{formatDate(order.created_at)}</Typography>
              </Box>
            </Box>

            {/* Selection controls - Screen Only */}
            <ScreenOnlyContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                  p: 1.5,
                  bgcolor: 'rgba(26, 35, 126, 0.04)',
                  borderRadius: 1,
                  border: '1px dashed #1a237e',
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={order.items.length > 0 && selectedItems.length === order.items.length}
                      indeterminate={selectedItems.length > 0 && selectedItems.length < order.items.length}
                      onChange={handleSelectAll}
                      size="small"
                    />
                  }
                  label={
                    <Typography variant="body2" fontWeight="medium">
                      Select for Print (${selectedItems.length}/${order.items.length})
                    </Typography>
                  }
                />
                <Stack direction="row" spacing={2}>
                  <Chip
                    icon={<LocalPharmacyIcon />}
                    label={`Bill: Birr ${calculateSelectedTotal().toFixed(2)}`}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                </Stack>
              </Box>
            </ScreenOnlyContent>

            {/* Rx Symbol */}
            <Typography
              variant="h2"
              sx={{
                fontFamily: 'serif',
                fontWeight: 'bold',
                color: '#1a237e',
                mt: 2,
                userSelect: 'none',
              }}
            >
              ℞
            </Typography>

            {/* Medication List */}
            <Box sx={{ mt: 2 }}>
              <TableContainer component={Box}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ borderBottom: '2px solid #1a237e', fontWeight: 'bold' }}>Medication</TableCell>
                      <TableCell align="center" sx={{ borderBottom: '2px solid #1a237e', fontWeight: 'bold' }}>Qty</TableCell>
                      <TableCell align="right" sx={{ borderBottom: '2px solid #1a237e', fontWeight: 'bold' }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.items.map(item => (
                      <TableRow
                        key={item.id}
                        sx={{
                          '& td': { borderBottom: '1px solid #f5f5f5', py: 2 },
                          textDecoration: (item.is_payment_completed === '1' && selectedItems.length === 0) || (selectedItems.includes(item.id) && item.is_payment_completed === '1') ? 'line-through' : 'none',
                          opacity: (selectedItems.length > 0 && !selectedItems.includes(item.id)) ? 0.5 : 1,
                          transition: 'opacity 0.2s',
                          cursor: 'pointer'
                        }}
                        onClick={() => handleSelectItem(item.id)}
                      >
                        <TableCell>
                          <Typography variant="body1" fontWeight="bold">{item.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Unit Price: Birr {parseFloat(item.price).toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body1">{item.quantity}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label={item.is_payment_completed === '1' ? 'Paid' : 'Unpaid'}
                            size="small"
                            color={item.is_payment_completed === '1' ? 'success' : 'error'}
                            variant="outlined"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Instructions / Notes */}
            {order.notes && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#1a237e' }}>
                  Instructions:
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mt: 1, p: 2, bgcolor: '#fafafa', borderRadius: 1 }}>
                  {order.notes}
                </Typography>
              </Box>
            )}

            {/* Footer Signature Area */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                mt: 10,
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <Box sx={{ width: '250px' }}>
                <Box sx={{ borderTop: '1px solid #1a237e', pt: 1 }}>
                  <Typography variant="body2" fontWeight="bold">Doctor's Signature & Stamp</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        ) : (
          <Typography color="text.secondary" align="center">
            No order details available
          </Typography>
        )}
      </DialogContent>

      <ScreenOnlyContent>
        <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Box
            sx={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Typography variant="body2" color="text.secondary">
              {selectedItems.length > 0
                ? `${selectedItems.length} item(s) selected`
                : 'Select items to print'}
            </Typography>
            <Box>
              <Button
                startIcon={<PrintIcon />}
                onClick={handlePrint}
                variant="outlined"
                size="small"
                disabled={order?.items.length === 0 || submitting}
                sx={{ mr: 1 }}
              >
                Print {selectedItems.length > 0 ? 'Selected' : 'All'}
              </Button>
              <Button
                onClick={handleSubmitResults}
                variant="contained"
                size="small"
                color="success"
                disabled={submitting || Object.keys(results).length === 0}
                sx={{ mr: 1 }}
              >
                {submitting ? <CircularProgress size={20} color="inherit" /> : 'Give Result'}
              </Button>
              <Button onClick={onClose} variant="contained" size="small">
                Close
              </Button>
            </Box>
          </Box>
        </DialogActions>
      </ScreenOnlyContent>
    </Dialog>
  );
};

export default PharmacyOrderDetailModal;
