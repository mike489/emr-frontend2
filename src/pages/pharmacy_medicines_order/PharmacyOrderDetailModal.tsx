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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PrintIcon from '@mui/icons-material/Print';
// import DownloadIcon from '@mui/icons-material/Download';

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

  //   const getStatusColor = (status: string) => {
  //     switch (status.toLowerCase()) {
  //       case 'pending':
  //         return 'warning';
  //       case 'approved':
  //         return 'success';
  //       case 'completed':
  //         return 'info';
  //       case 'cancelled':
  //         return 'error';
  //       default:
  //         return 'default';
  //     }
  //   };

  const handlePrint = () => {
    window.print();
  };

  //   const handleDownload = () => {

  //     console.log('Download order:', order);
  //   };

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
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: 'primary.main',
          color: 'white',
          py: 2,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Order Details
        </Typography>
        <IconButton onClick={onClose} sx={{ color: 'white' }} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : order ? (
          <Box>
            {/* Order Header */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                {/* <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Order Number
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {order.order_number}
                  </Typography>
                </Box> */}
                {/* <Box>
                  <Typography variant="subtitle2" color="text.secondary" align="right">
                    Status
                  </Typography>
                  <Chip
                    label={order.status}
                    color={getStatusColor(order.status) as any}
                    size="small"
                    sx={{ fontWeight: 'bold' }}
                  />
                </Box> */}
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
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

            <Divider sx={{ my: 2 }} />

            {/* Order Items */}
            <Typography variant="h6" gutterBottom>
              Order Items
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: 'action.hover' }}>
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
                        <Typography variant="caption" color="text.secondary">
                          ID: {item.medicine_id}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">Birr {parseFloat(item.price).toFixed(2)}</TableCell>
                      <TableCell align="center">
                        <Chip label={item.quantity} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'medium' }}>
                        Birr {parseFloat(item.total_price).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Order Summary */}
            {/* <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Box sx={{ width: 250 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Subtotal:</Typography>
                  <Typography>${(parseFloat(order.total_amount) * 0.9).toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Tax (10%):</Typography>
                  <Typography>${(parseFloat(order.total_amount) * 0.1).toFixed(2)}</Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6">Total:</Typography>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    ${parseFloat(order.total_amount).toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </Box> */}

            {/* Notes */}
            {order.notes && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Notes:
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                  <Typography variant="body2">{order.notes}</Typography>
                </Paper>
              </Box>
            )}
          </Box>
        ) : (
          <Typography color="text.secondary" align="center">
            No order details available
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button startIcon={<PrintIcon />} onClick={handlePrint} variant="outlined" size="small">
          Print
        </Button>
        {/* <Button
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
          variant="outlined"
          size="small"
        >
          Download
        </Button> */}
        <Button onClick={onClose} variant="contained" size="small">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PharmacyOrderDetailModal;
