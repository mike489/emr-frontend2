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

  const getItemCode = (item: OrderItem) => item.default_code || item.medicine?.default_code || '';

  // const getItemPrice = (item: OrderItem) => {
  //   const price = item.price || item.medicine?.price;
  //   return price ? parseFloat(price) : 0;
  // };

  const DetailField: React.FC<{ label: string; value?: string | null }> = ({ label, value }) => (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {value && String(value).trim() !== '' ? value : '—'}
      </Typography>
    </Box>
  );

  const DetailLongField: React.FC<{ label: string; value?: string | null }> = ({
    label,
    value,
  }) => (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mt: 0.25 }}>
        {value && String(value).trim() !== '' ? value : '—'}
      </Typography>
    </Box>
  );

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
              min-height: 900px;
              padding-bottom: 80px;
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
              position: relative;
              width: 100%;
              display: flex;
              justify-content: flex-end;
              margin-top: 40px;
              page-break-inside: avoid;
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
            <div style="display: flex; flex-direction: column; gap: 18px; margin-top: 10px;">
              ${itemsToPrint
                .map(
                  item => `
                <div style="border: 1px solid #e0e0e0; border-radius: 10px; padding: 14px 16px; background: ${isPaid(item.is_payment_completed) ? '#f8fff8' : '#fff'}; box-shadow: 0 6px 18px rgba(0,0,0,0.05); text-decoration: ${isPaid(item.is_payment_completed) ? 'line-through' : 'none'};">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;">
                    <div>
                      <div style="font-weight: 700; font-size: 18px;">${getItemName(item)}${getItemCode(item) ? ' • ' + getItemCode(item) : ''}</div>
                      <div style="font-size: 14px; color: #555;">Qty: ${item.quantity}</div>
                      ${item.created_at ? `<div style=\"font-size: 13px; color: #777;\">${formatDate(item.created_at)}</div>` : ''}
                    </div>
                    <span style="padding: 0; min-width: 12px;"></span>
                  </div>
                  <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; margin-top: 10px; font-size: 14px; color: #333;">
                    <div><strong>Dose:</strong> ${item.dose || '-'}</div>
                    <div><strong>Route:</strong> ${item.route || '-'}</div>
                    <div><strong>Frequency:</strong> ${item.frequency || '-'}</div>
                    <div><strong>Duration:</strong> ${item.duration || '-'}</div>
                    <div><strong>Form:</strong> ${item.form || '-'}</div>
                    <div><strong>Strength:</strong> ${item.strength || '-'}</div>
                  </div>
                </div>
              `
                )
                .join('')}
            </div>
            
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
            <Box sx={{ mt: 1 }}>
              <Stack spacing={1}>
                {order.items.map(item => {
                  const selected = selectedItems.includes(item.id);
                  return (
                    <Box
                      key={item.id}
                      onClick={() => handleSelectItem(item.id)}
                      data-paid={isPaid(item.is_payment_completed) ? 'true' : 'false'}
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: selected ? 'primary.main' : 'grey.200',
                        boxShadow: selected
                          ? '0 4px 12px rgba(26,35,126,0.12)'
                          : '0 2px 6px rgba(0,0,0,0.04)',
                        backgroundColor: selected ? 'rgba(26,35,126,0.04)' : 'white',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer',
                        textDecoration: isPaid(item.is_payment_completed) ? 'line-through' : 'none',
                      }}
                    >
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="flex-start"
                        gap={1}
                      >
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 0.5 }}>
                            {getItemName(item)}
                            {getItemCode(item) ? ` • ${getItemCode(item)}` : ''}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Quantity: {item.quantity}
                          </Typography>
                          <Typography variant="caption" display="block" color="text.secondary">
                            {item.created_at ? formatDate(item.created_at) : '—'}
                          </Typography>
                        </Box>
                        <Box sx={{ minWidth: 24 }} />
                      </Box>

                      <Box
                        sx={{
                          mt: 1,
                          display: 'grid',
                          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(0, 1fr))' },
                          gap: 1,
                        }}
                      >
                        <DetailField label="Dose" value={item.dose} />
                        <DetailField label="Route" value={item.route} />
                        <DetailField label="Frequency" value={item.frequency} />
                        <DetailField label="Duration" value={item.duration} />
                        <DetailField label="Form" value={item.form} />
                        <DetailField label="Strength" value={item.strength} />
                      </Box>

                      <Box
                        sx={{
                          mt: 1,
                          display: 'grid',
                          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                          gap: 1,
                        }}
                      >
                        <DetailLongField label="Instructions" value={item.instructions} />
                        <DetailLongField label="Note" value={item.note} />
                      </Box>
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
