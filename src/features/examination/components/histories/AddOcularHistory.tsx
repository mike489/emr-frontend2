import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import FormDialog from '../../../shared/ui-component/formsDialog/FormDialog';


interface OcularHistoryData {
  visitId: string;
  current_ocular_medication: string;
  current_contact_lense_use: boolean;
  lens_type: string;
  family_history: string[];
}

interface AddOcularHistoryProps {
  open: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (data: OcularHistoryData) => Promise<void>;
  visitId:string;
}

const AddOcularHistory: React.FC<AddOcularHistoryProps> = ({
  open,
  isSubmitting,
  onClose,
  onSubmit,
  visitId,
}) => {
  const initialFormState: OcularHistoryData = {
    visitId,
    current_ocular_medication: '',
    current_contact_lense_use: false,
    lens_type: '',
    family_history: [],
  };

  const [ocularHistoryData, setOcularHistoryData] = useState<OcularHistoryData>(initialFormState);
  const [currentFamilyHistory, setCurrentFamilyHistory] = useState('');

  useEffect(() => {
    if (open) {
      setOcularHistoryData({ ...initialFormState, visitId });
      setCurrentFamilyHistory('');
    }
  }, [open, visitId]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setOcularHistoryData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setOcularHistoryData(prev => ({ ...prev, [name]: checked }));
  };

  const handleAddFamilyHistory = () => {
    if (!currentFamilyHistory.trim()) {
      toast.error('Please enter a family history item');
      return;
    }
    setOcularHistoryData(prev => ({
      ...prev,
      family_history: [...prev.family_history, currentFamilyHistory.trim()],
    }));
    setCurrentFamilyHistory('');
  };

  const handleRemoveFamilyHistory = (index: number) => {
    setOcularHistoryData(prev => ({
      ...prev,
      family_history: prev.family_history.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    if (ocularHistoryData.family_history.length === 0) {
      toast.error('Please add at least one family history item');
      return;
    }

    try {
      await onSubmit(ocularHistoryData);
      // Reset form after submission
      setOcularHistoryData({ ...initialFormState, visitId });
      setCurrentFamilyHistory('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit ocular history');
    }
  };

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      cancelText="Cancel"
      onSubmit={handleSubmit}
      title="Add Ocular History"
      submitting={isSubmitting}
    >
      <TextField
        fullWidth
        label="Current Ocular Medications"
        name="current_ocular_medication"
        value={ocularHistoryData.current_ocular_medication}
        onChange={handleChange}
        margin="normal"
      />

      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              name="current_contact_lense_use"
              checked={ocularHistoryData.current_contact_lense_use}
              onChange={handleCheckboxChange}
            />
          }
          label="Current Spectacle/Contact Lens Use"
        />
      </FormGroup>

      {ocularHistoryData.current_contact_lense_use && (
        <TextField
          fullWidth
          label="Lens Type"
          name="lens_type"
          value={ocularHistoryData.lens_type}
          onChange={handleChange}
          margin="normal"
        />
      )}

      <Box mt={2}>
        <Box display="flex" alignItems="center">
          <TextField
            fullWidth
            label="Family History of Ocular Diseases"
            value={currentFamilyHistory}
            onChange={e => setCurrentFamilyHistory(e.target.value)}
            margin="normal"
          />
          <Button
            variant="contained"
            onClick={handleAddFamilyHistory}
            sx={{ ml: 2, height: '56px' }}
          >
            Add
          </Button>
        </Box>

        {ocularHistoryData.family_history.length > 0 && (
          <Box mt={1}>
            <Typography variant="subtitle2" gutterBottom>
              Family History:
            </Typography>
            <List dense>
              {ocularHistoryData.family_history.map((item, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton edge="end" onClick={() => handleRemoveFamilyHistory(index)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Box>
    </FormDialog>
  );
};

export default AddOcularHistory;
