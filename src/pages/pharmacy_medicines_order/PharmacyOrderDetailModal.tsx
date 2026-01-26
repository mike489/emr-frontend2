import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
  // Chip,
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
// import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';

interface MedicineInfo {
  id: string;
  name: string;
  price?: string;
  description?: string;
  default_code?: string;
  status?: string;
  created_at?: string;
}

interface OrderItem {
  id: string;
  medicine_id: string;
  name?: string;
  quantity: number | string;
  price?: string;
  total_price?: string;
  status?: string | number;
  default_code?: string;
  is_payment_completed: string | number | boolean;
  dose?: string;
  route?: string;
  frequency?: string;
  duration?: string;
  form?: string;
  strength?: string;
  instructions?: string;
  note?: string;
  created_at?: string;
  medicine?: MedicineInfo;
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

  const isPaid = (value: OrderItem['is_payment_completed']) => {
    return value === true || value === '1' || value === 1;
  };

  const getItemName = (item: OrderItem) => item.name || item.medicine?.name || 'Unknown';

  // const getItemCode = (item: OrderItem) => item.default_code || item.medicine?.default_code || '';

  // const getItemPrice = (item: OrderItem) => {
  //   const price = item.price || item.medicine?.price;
  //   return price ? parseFloat(price) : 0;
  // };
  const getMedicationSentence = (item: OrderItem) => {
    const dose = item.dose || '';
    const form = item.form || 'units';
    const route = item.route ? `by ${item.route}` : '';
    const freq = item.frequency ? `${item.frequency}` : '';
    const dur = item.duration ? `for ${item.duration}` : '';

    // Clean up extra spaces and return a natural sentence
    return `Take ${dose} ${form} ${route} ${freq} ${dur}`.replace(/\s+/g, ' ').trim() + '.';
  };

  // const DetailField: React.FC<{ label: string; value?: string | null }> = ({ label, value }) => (
  //   <Box>
  //     <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
  //       {label}
  //     </Typography>
  //     <Typography variant="body2" sx={{ fontWeight: 600 }}>
  //       {value && String(value).trim() !== '' ? value : '—'}
  //     </Typography>
  //   </Box>
  // );

  // const DetailLongField: React.FC<{ label: string; value?: string | null }> = ({
  //   label,
  //   value,
  // }) => (
  //   <Box>
  //     <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
  //       {label}
  //     </Typography>
  //     <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mt: 0.25 }}>
  //       {value && String(value).trim() !== '' ? value : '—'}
  //     </Typography>
  //   </Box>
  // );

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

    const itemsToPrint =
      selectedItems.length > 0
        ? order.items.filter(item => selectedItems.includes(item.id))
        : order.items;

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
              margin: 50px;
              color: #1a1a1a;
              line-height: 1.5;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #1a237e;
              padding-bottom: 15px;
            }
            .clinic-name {
              font-size: 28px;
              font-weight: 700;
              color: #1a237e;
              text-transform: uppercase;
            }
            .patient-info {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
              font-size: 16px;
              border-bottom: 1px solid #eee;
              padding-bottom: 10px;
            }
            .rx-symbol {
              font-size: 45px;
              font-weight: bold;
              margin: 10px 0;
              color: #1a237e;
            }
            .medication-list {
              margin-left: 20px;
            }
            .medication-item {
              margin-bottom: 25px;
            }
            .med-name {
              font-size: 18px;
              font-weight: 700;
              text-decoration: underline;
            }
            .med-sentence {
              font-size: 17px;
              margin-top: 5px;
              font-style: italic;
              color: #333;
            }
            .instructions {
              margin-top: 5px;
              font-size: 15px;
              color: #555;
              padding-left: 20px;
              border-left: 2px solid #eee;
            }
            .footer {
              margin-top: 100px;
              display: flex;
              justify-content: flex-end;
            }
            .sig-box {
              text-align: center;
              width: 250px;
            }
            .sig-line {
              border-top: 1px solid #000;
              padding-top: 5px;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="clinic-name">DROGA TECHNOLOGY EMR</div>
            <div style="font-size: 14px;">Addis Ababa, Ethiopia | Tel: +251 112 345 678</div>
          </div>
          
          <div class="patient-info">
            <div><strong>Patient:</strong> ${order.patient_name}</div>
            <div><strong>Date:</strong> ${formatDate(order.created_at)}</div>
          </div>
          
          <div class="rx-symbol">℞</div>
          
          <div class="medication-list">
            ${itemsToPrint
              .map(item => {
                // Create the sentence logic
                const dose = item.dose ? item.dose : '';
                const form = item.form ? item.form : 'units';
                const route = item.route ? `by ${item.route}` : '';
                const freq = item.frequency ? `${item.frequency}` : '';
                const dur = item.duration ? `for ${item.duration}` : '';

                // Formatting the sentence: "Take 2 Tablet by mouth Daily for 7 days"
                const sentence = `Take ${dose} ${form} ${route} ${freq} ${dur}.`
                  .replace(/\s+/g, ' ')
                  .trim();

                return `
                <div class="medication-item">
                  <div class="med-name">${getItemName(item)} ${item.strength || ''} (Qty: ${item.quantity})</div>
                  <div class="med-sentence">Sig: ${sentence}</div>
                  ${item.instructions ? `<div class="instructions"><strong>Note:</strong> ${item.instructions}</div>` : ''}
                </div>
              `;
              })
              .join('')}
          </div>

          ${
            order.notes
              ? `
            <div style="margin-top: 30px;">
              <strong>General Consultation Notes:</strong>
              <p>${order.notes}</p>
            </div>
          `
              : ''
          }
          
          <div class="footer">
            <div class="sig-box">
              <br><br>
              <div class="sig-line">Doctor's Signature & Stamp</div>
            </div>
          </div>

          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => window.close(), 500);
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

  // const calculateSelectedTotal = () => {
  //   if (!order) return 0;
  //   return order.items
  //     .filter(item => selectedItems.includes(item.id))
  //     .reduce((sum, item) => {
  //       const qty = typeof item.quantity === 'string' ? parseFloat(item.quantity) : item.quantity;
  //       return sum + getItemPrice(item) * (qty || 0);
  //     }, 0);
  // };

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
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mb: 4,
                borderBottom: '1px solid #eee',
                pb: 1,
              }}
            >
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Typography variant="body1" fontWeight="bold">
                  Patient Name:
                </Typography>
                <Typography variant="body1">{order.patient_name}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Typography variant="body1" fontWeight="bold">
                  Date:
                </Typography>
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
                      checked={
                        order.items.length > 0 && selectedItems.length === order.items.length
                      }
                      indeterminate={
                        selectedItems.length > 0 && selectedItems.length < order.items.length
                      }
                      onChange={handleSelectAll}
                      size="small"
                    />
                  }
                  label={
                    <Typography variant="body2" fontWeight="medium">
                      Select for Print
                    </Typography>
                  }
                />
                {/* <Stack direction="row" spacing={2}>
                  <Chip
                    icon={<LocalPharmacyIcon />}
                    label={`Bill: Birr ${calculateSelectedTotal().toFixed(2)}`}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                </Stack> */}
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
            <Box sx={{ mt: 3, px: 2 }}>
              <Stack spacing={4}>
                {order.items.map((item, index) => {
                  // const selected = selectedItems.includes(item.id);
                  const paid = isPaid(item.is_payment_completed);

                  return (
                    <Box
                      key={item.id}
                      onClick={() => handleSelectItem(item.id)}
                      sx={{
                        position: 'relative',
                        pl: 4,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        opacity: paid ? 0.6 : 1,
                        '&:hover': { transform: 'translateX(5px)' },
                      }}
                    >
                      {/* Selection Indicator */}
                      {/* <Box sx={{ position: 'absolute', left: 0, top: 0 }}>
                        <Checkbox checked={selected} size="small" sx={{ p: 0, color: '#1a237e' }} />
                      </Box> */}

                      {/* Medicine Name & Strength */}
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: '#1a237e',
                          textDecoration: paid ? 'line-through' : 'none',
                          fontSize: '1.1rem',
                          mb: 0.5,
                        }}
                      >
                        {index + 1}. {getItemName(item)} {item.strength || ''}
                      </Typography>

                      {/* The "Sentence" Instruction */}
                      <Typography
                        variant="body1"
                        sx={{
                          fontStyle: 'italic',
                          color: '#333',
                          fontSize: '1.05rem',
                          lineHeight: 1.4,
                          pl: 1,
                          borderLeft: '3px solid #e0e0e0',
                        }}
                      >
                        Sig: {getMedicationSentence(item)}
                      </Typography>

                      {/* Instructions/Notes */}
                      {(item.instructions || item.note) && (
                        <Box sx={{ mt: 1, ml: 1 }}>
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 700,
                              color: 'text.secondary',
                              textTransform: 'uppercase',
                            }}
                          >
                            Additional Notes:
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.instructions} {item.note}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  );
                })}
              </Stack>
            </Box>

            {/* Instructions / Notes */}
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
                  <Typography variant="body2" fontWeight="bold">
                    Doctor's Signature & Stamp
                  </Typography>
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
