import React, { useState, useEffect } from 'react';
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



interface AddMedicalHistoriesProps {
  open: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  visitId: string;
}

const AddMedicalHistories: React.FC<AddMedicalHistoriesProps> = ({
  open,
  isSubmitting,
  onClose,
  onSubmit,
  visitId,
}) => {
  const [currentSystemic, setCurrentSystemic] = useState('');
  const [currentAllergy, setCurrentAllergy] = useState('');
  const [systemicConditions, setSystemicConditions] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [currentMedication, setCurrentMedication] = useState('');

  useEffect(() => {
    if (open) {
      setSystemicConditions([]);
      setAllergies([]);
      setCurrentMedication('');
      setCurrentSystemic('');
      setCurrentAllergy('');
    }
  }, [open]);

  const handleAddSystemic = () => {
    if (!currentSystemic.trim()) return toast.error('Enter a systemic condition');
    setSystemicConditions([...systemicConditions, currentSystemic.trim()]);
    setCurrentSystemic('');
  };

  const handleRemoveSystemic = (index: number) => {
    setSystemicConditions(systemicConditions.filter((_, i) => i !== index));
  };

  const handleAddAllergy = () => {
    if (!currentAllergy.trim()) return toast.error('Enter an allergy');
    setAllergies([...allergies, currentAllergy.trim()]);
    setCurrentAllergy('');
  };

  const handleRemoveAllergy = (index: number) => {
    setAllergies(allergies.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      visit_id: visitId,
      systemic_conditions: systemicConditions,
      allergies,
      current_systemic_medication: currentMedication,
    });
  };

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Add Medical History"
      submitting={isSubmitting}
    >
      {/* Systemic Conditions */}
      <Box mb={2}>
        <Typography>Systemic Conditions</Typography>
        <Box display="flex" mt={1}>
          <TextField
            fullWidth
            value={currentSystemic}
            onChange={e => setCurrentSystemic(e.target.value)}
            label="Add Condition"
          />
          <Button sx={{ ml: 1 }} variant="contained" onClick={handleAddSystemic}>
            Add
          </Button>
        </Box>
        <List dense>
          {systemicConditions.map((item, i) => (
            <ListItem
              key={i}
              secondaryAction={
                <IconButton onClick={() => handleRemoveSystemic(i)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Allergies */}
      <Box mb={2}>
        <Typography>Allergies</Typography>
        <Box display="flex" mt={1}>
          <TextField
            fullWidth
            value={currentAllergy}
            onChange={e => setCurrentAllergy(e.target.value)}
            label="Add Allergy"
          />
          <Button sx={{ ml: 1 }} variant="contained" onClick={handleAddAllergy}>
            Add
          </Button>
        </Box>
        <List dense>
          {allergies.map((item, i) => (
            <ListItem
              key={i}
              secondaryAction={
                <IconButton onClick={() => handleRemoveAllergy(i)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>
      </Box>

      <TextField
        fullWidth
        multiline
        rows={3}
        value={currentMedication}
        onChange={e => setCurrentMedication(e.target.value)}
        label="Current Systemic Medication"
      />
    </FormDialog>
  );
};

export default AddMedicalHistories;
