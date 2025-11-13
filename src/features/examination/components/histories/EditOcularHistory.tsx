import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import {
  TextField,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import FormDialog from '../../../shared/ui-component/formsDialog/FormDialog';

/* ---------- Types ---------- */
interface OcularHistory {
  current_oscular_medication?: string;
  current_contact_lense_use?: boolean;
  lens_type?: string;
  family_history?: string[];
}

interface OcularHistoryForm {
  current_oscular_medication: string;
  current_contact_lense_use: boolean;
  lens_type: string;
  family_history: string[];
}

interface Props {
  open: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (data: OcularHistoryForm) => void;
  ocularHistory?: OcularHistory | null;
}

/* ---------- Component ---------- */
const EditOcularHistory: React.FC<Props> = ({
  open,
  isSubmitting,
  onClose,
  onSubmit,
  ocularHistory,
}) => {
  const [form, setForm] = useState<OcularHistoryForm>({
    current_oscular_medication: '',
    current_contact_lense_use: false,
    lens_type: '',
    family_history: [],
  });

  const [currentFamilyHistory, setCurrentFamilyHistory] = useState('');

  /* ---- Sync prop → state ---- */
  useEffect(() => {
    if (ocularHistory) {
      setForm({
        current_oscular_medication: ocularHistory.current_oscular_medication ?? '',
        current_contact_lense_use: ocularHistory.current_contact_lense_use ?? false,
        lens_type: ocularHistory.lens_type ?? '',
        family_history: ocularHistory.family_history ?? [],
      });
    }
  }, [ocularHistory]);

  /* ---- Handlers ---- */
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: checked }));
  };

  const addFamilyHistory = () => {
    if (!currentFamilyHistory.trim()) {
      toast.error('Please enter a family history item');
      return;
    }
    setForm(prev => ({
      ...prev,
      family_history: [...prev.family_history, currentFamilyHistory.trim()],
    }));
    setCurrentFamilyHistory('');
  };

  const removeFamilyHistory = (index: number) => {
    setForm(prev => ({
      ...prev,
      family_history: prev.family_history.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <FormDialog
      open={open}
      title="Edit Ocular History"
      onClose={onClose}
      onSubmit={handleSubmit}
      submitting={isSubmitting}
    >
      {/* Current Ocular Medication */}
      <TextField
        fullWidth
        label="Current Ocular Medication"
        name="current_oscular_medication"
        value={form.current_oscular_medication}
        onChange={handleChange}
        margin="normal"
      />

      {/* Contact Lens Checkbox */}
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              name="current_contact_lense_use"
              checked={form.current_contact_lense_use}
              onChange={handleCheckbox}
            />
          }
          label="Currently using contact lenses"
        />
      </FormGroup>

      {/* Lens Type – shown only when checkbox is true */}
      {form.current_contact_lense_use && (
        <TextField
          fullWidth
          label="Lens Type"
          name="lens_type"
          value={form.lens_type}
          onChange={handleChange}
          margin="normal"
        />
      )}

      {/* Family History */}
      <Box sx={{ mt: 2 }}>
        <Box display="flex" alignItems="center">
          <TextField
            fullWidth
            label="Add Family History"
            value={currentFamilyHistory}
            onChange={e => setCurrentFamilyHistory(e.target.value)}
            margin="normal"
          />
          <Button variant="contained" onClick={addFamilyHistory} sx={{ ml: 2, height: 56 }}>
            Add
          </Button>
        </Box>

        {form.family_history.length > 0 && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Family History:
            </Typography>
            <List dense>
              {form.family_history.map((item, idx) => (
                <ListItem
                  key={idx}
                  secondaryAction={
                    <IconButton edge="end" onClick={() => removeFamilyHistory(idx)}>
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

export default EditOcularHistory;
