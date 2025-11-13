import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import {
  TextField,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import FormDialog from '../../../shared/ui-component/formsDialog/FormDialog';

/* ---------- Types ---------- */

interface MedicalHistory {
  systemic_conditions?: string[];
  allergies?: string[];
  current_systemic_medication?: string;
}

interface MedicalHistoryForm {
  visit_id: string;
  systemic_conditions: string[];
  allergies: string[];
  current_systemic_medication: string;
}

interface Props {
  open: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (data: MedicalHistoryForm) => void;
  medicalHistory?: MedicalHistory | null;
  visitId: string;
}

/* ---------- Component ---------- */
const EditMedicalHistories: React.FC<Props> = ({
  open,
  isSubmitting,
  onClose,
  onSubmit,
  medicalHistory,
  visitId,
}) => {
  const [form, setForm] = useState<MedicalHistoryForm>({
    visit_id: visitId,
    systemic_conditions: [],
    allergies: [],
    current_systemic_medication: '',
  });

  const [currentSystemicCondition, setCurrentSystemicCondition] = useState('');
  const [currentAllergy, setCurrentAllergy] = useState('');

  /* ---- Sync prop → state ---- */
  useEffect(() => {
    if (medicalHistory) {
      setForm({
        visit_id: visitId,
        systemic_conditions: medicalHistory.systemic_conditions ?? [],
        allergies: medicalHistory.allergies ?? [],
        current_systemic_medication: medicalHistory.current_systemic_medication ?? '',
      });
    }
  }, [medicalHistory, visitId]);

  /* ---- Handlers ---- */
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const addSystemicCondition = () => {
    if (!currentSystemicCondition.trim()) {
      toast.error('Please enter a systemic condition');
      return;
    }
    setForm(prev => ({
      ...prev,
      systemic_conditions: [...prev.systemic_conditions, currentSystemicCondition.trim()],
    }));
    setCurrentSystemicCondition('');
  };

  const removeSystemicCondition = (index: number) => {
    setForm(prev => ({
      ...prev,
      systemic_conditions: prev.systemic_conditions.filter((_, i) => i !== index),
    }));
  };

  const addAllergy = () => {
    if (!currentAllergy.trim()) {
      toast.error('Please enter an allergy');
      return;
    }
    setForm(prev => ({
      ...prev,
      allergies: [...prev.allergies, currentAllergy.trim()],
    }));
    setCurrentAllergy('');
  };

  const removeAllergy = (index: number) => {
    setForm(prev => ({
      ...prev,
      allergies: prev.allergies.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <FormDialog
      open={open}
      title="Edit Medical History"
      onClose={onClose}
      cancelText="Cancel"
      onSubmit={handleSubmit}
      submitting={isSubmitting}
    >
      {/* ---------- Systemic Conditions ---------- */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Systemic Conditions
        </Typography>

        <Box display="flex" alignItems="center">
          <TextField
            fullWidth
            label="Add Systemic Condition"
            value={currentSystemicCondition}
            onChange={e => setCurrentSystemicCondition(e.target.value)}
            margin="normal"
          />
          <Button variant="contained" onClick={addSystemicCondition} sx={{ ml: 2, height: 56 }}>
            Add
          </Button>
        </Box>

        <Typography variant="body2" color="textSecondary" sx={{ mt: 1, ml: 0.5 }}>
          e.g. Diabetes, Hypertension, Asthma
        </Typography>

        {form.systemic_conditions.length > 0 && (
          <Box sx={{ mt: 1 }}>
            <List dense>
              {form.systemic_conditions.map((item, idx) => (
                <ListItem
                  key={idx}
                  secondaryAction={
                    <IconButton edge="end" onClick={() => removeSystemicCondition(idx)}>
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

      {/* ---------- Allergies ---------- */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Allergies
        </Typography>

        <Box display="flex" alignItems="center">
          <TextField
            fullWidth
            label="Add Allergy"
            value={currentAllergy}
            onChange={e => setCurrentAllergy(e.target.value)}
            margin="normal"
          />
          <Button variant="contained" onClick={addAllergy} sx={{ ml: 2, height: 56 }}>
            Add
          </Button>
        </Box>

        <Typography variant="body2" color="textSecondary" sx={{ mt: 1, ml: 0.5 }}>
          e.g. Penicillin, Latex, Pollen
        </Typography>

        {form.allergies.length > 0 && (
          <Box sx={{ mt: 1 }}>
            <List dense>
              {form.allergies.map((item, idx) => (
                <ListItem
                  key={idx}
                  secondaryAction={
                    <IconButton edge="end" onClick={() => removeAllergy(idx)}>
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

      {/* ---------- Current Systemic Medication ---------- */}
      <TextField
        fullWidth
        label="Current Systemic Medication"
        name="current_systemic_medication"
        value={form.current_systemic_medication}
        onChange={handleChange}
        margin="normal"
        sx={{ mt: 3 }}
        multiline
        rows={3}
      />
    </FormDialog>
  );
};

export default EditMedicalHistories;
