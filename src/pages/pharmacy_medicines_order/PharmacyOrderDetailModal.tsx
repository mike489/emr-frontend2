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
  Paper,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Button,
  styled,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PrintIcon from '@mui/icons-material/Print';

interface OrderItem {
  id: string;
  medicine_id: string;
  name: string;
  quantity: number;
  price: string;
  total_price: string;
  status: string | number;
  default_code: string;
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
}

// Styled component for print-only content
const PrintOnlyContent = styled(Box)(({}) => ({
  display: 'none',
  '@media print': {
    display: 'block',
  },
}));

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
}) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

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
    const selectedTotal = itemsToPrint.reduce((sum, item) => sum + parseFloat(item.total_price), 0);

    // Create print-specific window
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Order Details - ${order.order_number}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              color: #000;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #333;
              padding-bottom: 10px;
            }
            .patient-info {
              margin-bottom: 20px;
              padding: 10px;
              background: #f5f5f5;
              border-radius: 4px;
            }
            .print-title {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th {
              background-color: #f2f2f2;
              font-weight: bold;
              text-align: left;
              padding: 12px;
              border: 1px solid #ddd;
            }
            td {
              padding: 12px;
              border: 1px solid #ddd;
            }
            .total-row {
              font-weight: bold;
              background-color: #f9f9f9;
            }
            .print-date {
              color: #666;
              font-size: 14px;
            }
            .selection-note {
              margin: 10px 0;
              padding: 8px;
              background-color: #fff3cd;
              border: 1px solid #ffeaa7;
              border-radius: 4px;
              font-size: 14px;
            }
            @page {
              margin: 20mm;
            }
            @media print {
              body {
                margin: 0;
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="print-title">Order Receipt</div>
            <div class="print-date">${formatDate(order.created_at)}</div>
          </div>
          
          <div class="patient-info">
            <strong>Patient:</strong> ${order.patient_name}<br>
            <strong>Order #:</strong> ${order.order_number}
          </div>
          
          ${
            selectedItems.length > 0
              ? `<div class="selection-note">
                  <strong>Note:</strong> Showing ${selectedItems.length} selected item(s) of ${order.items.length} total
                </div>`
              : ''
          }
          
          <table>
            <thead>
              <tr>
                <th>Medicine</th>
                <th style="text-align: right;">Price</th>
                <th style="text-align: center;">Quantity</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsToPrint
                .map(
                  item => `
                <tr>
                  <td>${item.name}</td>
                  <td style="text-align: right;">Birr ${parseFloat(item.price).toFixed(2)}</td>
                  <td style="text-align: center;">${item.quantity}</td>
                  <td style="text-align: right;">Birr ${parseFloat(item.total_price).toFixed(2)}</td>
                </tr>
              `
                )
                .join('')}
              <tr class="total-row">
                <td colspan="3" style="text-align: right;">
                  <strong>${selectedItems.length > 0 ? 'Selected Total:' : 'Total Amount:'}</strong>
                </td>
                <td style="text-align: right;">
                  <strong>Birr ${selectedTotal.toFixed(2)}</strong>
                </td>
              </tr>
            </tbody>
          </table>
          
          ${
            order.notes
              ? `
            <div style="margin-top: 30px;">
              <strong>Notes:</strong>
              <div style="margin-top: 5px; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
                ${order.notes}
              </div>
            </div>
          `
              : ''
          }
          
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

  const getStatusChip = (status: string | number) => {
    const statusMap: Record<
      string | number,
      {
        label: string;
        color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
      }
    > = {
      '0': { label: 'Pending', color: 'warning' },
      '1': { label: 'Completed', color: 'success' },
      '2': { label: 'Rejected', color: 'error' },
    };

    return statusMap[status] || { label: 'Unknown', color: 'default' };
  };

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
        ) : order ? (
          <Box>
            {/* Print-only header */}
            <PrintOnlyContent>
              <Box sx={{ textAlign: 'center', mb: 3, borderBottom: '2px solid #333', pb: 2 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Order Receipt
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatDate(order.created_at)}
                </Typography>
              </Box>

              <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="body1" fontWeight="medium">
                  <strong>Patient:</strong> {order.patient_name}
                </Typography>
              </Box>
            </PrintOnlyContent>

            {/* Screen-only header */}
            <ScreenOnlyContent>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Patient
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {order.patient_name}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" align="right">
                      Date & Time
                    </Typography>
                    <Typography variant="body1">{formatDate(order.created_at)}</Typography>
                  </Box>
                </Box>
              </Box>

              {/* Selection controls */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                  p: 1,
                  bgcolor: 'grey.50',
                  borderRadius: 1,
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
                  label={`Select all (${selectedItems.length}/${order.items.length})`}
                />
                {selectedItems.length > 0 && (
                  <Typography variant="body2" color="primary" fontWeight="medium">
                    Selected total: Birr {calculateSelectedTotal().toFixed(2)}
                  </Typography>
                )}
              </Box>

              <Divider sx={{ my: 2, '@media print': { display: 'none' } }} />
            </ScreenOnlyContent>

            {/* Order Items - Always visible */}
            <PrintOnlyContent>
              <Typography variant="h6" gutterBottom sx={{ fontSize: '18px' }}>
                Order Items
              </Typography>
            </PrintOnlyContent>

            <ScreenOnlyContent>
              <Typography variant="h6" gutterBottom>
                Order Items
              </Typography>
            </ScreenOnlyContent>

            <TableContainer
              component={Paper}
              variant="outlined"
              sx={{
                '@media print': {
                  boxShadow: 'none',
                  border: '1px solid #ddd',
                },
              }}
            >
              <Table size="small">
                <TableHead>
                  <TableRow
                    sx={{
                      bgcolor: 'action.hover',
                      '@media print': {
                        bgcolor: 'grey.200',
                      },
                    }}
                  >
                    <TableCell sx={{ fontWeight: 'bold', width: 50 }} padding="checkbox">
                      <ScreenOnlyContent>
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
                      </ScreenOnlyContent>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Medicine</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      Price
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      Status
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                      Quantity
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      Total
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.map(item => (
                    <TableRow key={item.id} selected={selectedItems.includes(item.id)}>
                      <TableCell padding="checkbox">
                        <ScreenOnlyContent>
                          <Checkbox
                            checked={selectedItems.includes(item.id)}
                            onChange={() => handleSelectItem(item.id)}
                            size="small"
                          />
                        </ScreenOnlyContent>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {item.name}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">Birr {parseFloat(item.price).toFixed(2)}</TableCell>
                      <TableCell align="right">
                        <Chip size="small" {...getStatusChip(item.status)} />
                      </TableCell>
                      <TableCell align="center">
                        <ScreenOnlyContent>
                          <Chip label={item.quantity} size="small" variant="outlined" />
                        </ScreenOnlyContent>
                        <PrintOnlyContent>{item.quantity}</PrintOnlyContent>
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'medium' }}>
                        Birr {parseFloat(item.total_price).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* Print-only total row */}
                  <TableRow
                    sx={{
                      bgcolor: 'grey.50',
                      display: 'none',
                      '@media print': { display: 'table-row' },
                    }}
                  >
                    <TableCell colSpan={3} align="right" sx={{ fontWeight: 'bold' }}>
                      Total Amount:
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      Birr {parseFloat(order.total_amount).toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            {/* Print-only notes */}
            {order.notes && (
              <PrintOnlyContent sx={{ mt: 3 }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  Notes:
                </Typography>
                <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                  <Typography variant="body2">{order.notes}</Typography>
                </Box>
              </PrintOnlyContent>
            )}

            {/* Screen-only notes */}
            {order.notes && (
              <ScreenOnlyContent sx={{ mt: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Notes:
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                  <Typography variant="body2">{order.notes}</Typography>
                </Paper>
              </ScreenOnlyContent>
            )}
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
                disabled={order?.items.length === 0}
                sx={{ mr: 1 }}
              >
                Print {selectedItems.length > 0 ? 'Selected' : 'All'}
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
