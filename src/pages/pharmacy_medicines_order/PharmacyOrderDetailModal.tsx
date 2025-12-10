// PharmacyOrderDetailModal.tsx
import React from 'react';
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
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handlePrint = () => {
    // Create print-specific window
    const printWindow = window.open('', '_blank');
    if (printWindow && order) {
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
            <strong>Patient:</strong> ${order.patient_name}
          </div>
          
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
              ${order.items
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
                <td colspan="3" style="text-align: right;"><strong>Total Amount:</strong></td>
                <td style="text-align: right;"><strong>Birr ${parseFloat(order.total_amount).toFixed(2)}</strong></td>
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
                    <Typography variant="body1" fontWeight="medium">
                      {order.status}
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
                    <TableCell sx={{ fontWeight: 'bold' }}>Medicine</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      Price
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
                    <TableRow key={item.id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {item.name}
                        </Typography>
                        <ScreenOnlyContent>
                          <Typography variant="caption" color="text.secondary">
                            ID: {item.medicine_id}
                          </Typography>
                        </ScreenOnlyContent>
                      </TableCell>
                      <TableCell align="right">Birr {parseFloat(item.price).toFixed(2)}</TableCell>
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

      {/* Screen-only actions */}
      <ScreenOnlyContent>
        <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button startIcon={<PrintIcon />} onClick={handlePrint} variant="outlined" size="small">
            Print
          </Button>
          <Button onClick={onClose} variant="contained" size="small">
            Close
          </Button>
        </DialogActions>
      </ScreenOnlyContent>
    </Dialog>
  );
};

export default PharmacyOrderDetailModal;
