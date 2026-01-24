import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Paper,
} from '@mui/material';
import { Close, Science, Description } from '@mui/icons-material';

// Define the shape of the data based on your types
interface OperationNoteData {
  pre_op_diagnosis?: string;
  post_op_diagnosis?: string;
  procedure?: string;
  anesthesia_type?: string;
  findings?: string;
  post_op_plan?: string;
}

interface OperationResultViewModalProps {
  open: boolean;
  onClose: () => void;
  testName: string;
  noteData?: OperationNoteData;
  plainText?: string;
}

const OperationResultViewModal: React.FC<OperationResultViewModalProps> = ({
  open,
  onClose,
  testName,
  noteData,
  plainText,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          py: 2,
        }}
      >
        <Science />
        <Box>
          <Typography variant="h6" sx={{ lineHeight: 1.2 }}>
            Operation Result
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.9 }}>
            {testName}
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ ml: 'auto', color: 'white' }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ bgcolor: '#f8f9fa', py: 3 }}>
        {noteData ? (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 2.5,
            }}
          >
            {[
              { label: 'Pre-op Diagnosis', value: noteData.pre_op_diagnosis, fullWidth: false },
              { label: 'Post-op Diagnosis', value: noteData.post_op_diagnosis, fullWidth: false },
              { label: 'Procedure', value: noteData.procedure, fullWidth: true },
              { label: 'Anesthesia Type', value: noteData.anesthesia_type, fullWidth: false },
              { label: 'Findings', value: noteData.findings, fullWidth: true },
              { label: 'Post-op Plan', value: noteData.post_op_plan, fullWidth: true },
            ].map((field, idx) => (
              <Box
                key={idx}
                sx={{
                  gridColumn: field.fullWidth ? { xs: 'span 1', sm: 'span 2' } : 'auto',
                }}
              >
                <Typography
                  variant="caption"
                  fontWeight="bold"
                  color="primary"
                  sx={{ textTransform: 'uppercase', ml: 0.5, mb: 0.5, display: 'block' }}
                >
                  {field.label}
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'white',
                    minHeight: '45px',
                    borderLeft: field.value ? '4px solid' : '1px solid',
                    borderLeftColor: field.value ? 'primary.light' : 'divider',
                  }}
                >
                  <Typography
                    variant="body2"
                    color={field.value ? 'text.primary' : 'text.disabled'}
                  >
                    {field.value && String(field.value).trim() !== ''
                      ? field.value
                      : 'No information provided'}
                  </Typography>
                </Paper>
              </Box>
            ))}
          </Box>
        ) : (
          <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
            <Description sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
            <Typography color="text.secondary">
              {plainText || 'No result details available for this operation.'}
            </Typography>
          </Paper>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, bgcolor: '#f8f9fa' }}>
        <Button onClick={onClose} variant="contained" sx={{ px: 4, borderRadius: 5 }}>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OperationResultViewModal;
