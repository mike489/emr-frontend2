import { useState, type FormEvent } from 'react';
import { TextField, Box, Typography, Grid, Divider, FormHelperText } from '@mui/material';
import { toast } from 'react-toastify';
import FormDialog from '../../../shared/ui-component/formsDialog/FormDialog';

interface AcuityData {
  visit_id: string | number;
  [key: string]: string | number;
}

interface AddVisualAcuityProps {
  open: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (data: AcuityData) => void;
  visitId: string;
}

interface ValidationErrors {
  [key: string]: string;
}

// --- Component ---
const AddVisualAcuity: React.FC<AddVisualAcuityProps> = ({
  open,
  isSubmitting,
  onClose,
  onSubmit,
  visitId,
}) => {
  const [acuityData, setAcuityData] = useState<AcuityData>({
    visit_id: visitId,
    distance_od_ucva: '',
    distance_od_scva: '',
    distance_od_bcva: '',
    distance_os_ucva: '',
    distance_os_scva: '',
    distance_os_bcva: '',
    near_od_ucva: '',
    near_od_scva: '',
    near_od_bcva: '',
    near_os_ucva: '',
    near_os_scva: '',
    near_os_bcva: '',
    pupil_reaction_od_ucva: '',
    pupil_reaction_od_scva: '',
    pupil_reaction_od_bcva: '',
    pupil_reaction_os_ucva: '',
    pupil_reaction_os_scva: '',
    pupil_reaction_os_bcva: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  const handleChange = (field: string, value: string) => {
    setAcuityData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when field is modified
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateFields = (): boolean => {
    const newErrors: ValidationErrors = {};
    const requiredFields = [
      'distance_od_ucva',
      'distance_od_scva',
      'distance_od_bcva',
      'distance_os_ucva',
      'distance_os_scva',
      'distance_os_bcva',
      'near_od_ucva',
      'near_od_scva',
      'near_od_bcva',
      'near_os_ucva',
      'near_os_scva',
      'near_os_bcva',
      'pupil_reaction_od_ucva',
      'pupil_reaction_od_scva',
      'pupil_reaction_od_bcva',
      'pupil_reaction_os_ucva',
      'pupil_reaction_os_scva',
      'pupil_reaction_os_bcva',
    ];

    requiredFields.forEach(field => {
      if (!acuityData[field]) {
        newErrors[field] = `The ${field.replace(/_/g, ' ')} field is required.`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!validateFields()) {
      toast.error('Please fill all required fields');
      return;
    }

    onSubmit(acuityData);
  };

  const renderAcuityInputs = (title: string, prefix: string) => (
    <Box sx={{ mb: 3 }}>
      {title && (
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          {title}
        </Typography>
      )}
      <Grid container spacing={2}>
        {['ucva', 'scva', 'bcva'].map(type => {
          const fieldName = `${prefix}_${type}`;
          return (
            <Grid key={fieldName}>
              <TextField
                fullWidth
                label={type.toUpperCase()}
                value={acuityData[fieldName] || ''}
                onChange={e => {
                  const value = e.target.value;
                  const validFormat = /^\d{0,3}\s*\/?\s*\d{0,3}$/.test(value);
                  if (validFormat) {
                    handleChange(fieldName, value);
                  }
                }}
                margin="normal"
                placeholder="e.g. 6/6 or 20/20"
                error={!!errors[fieldName]}
                inputProps={{
                  inputMode: 'text',
                }}
              />
              {errors[fieldName] && <FormHelperText error>{errors[fieldName]}</FormHelperText>}
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );

  return (
    <FormDialog
      open={open}
      title="Add Visual Acuity"
      onClose={onClose}
      onSubmit={handleSubmit}
      submitting={isSubmitting}
    >
      <Box sx={{ mt: 2 }}>
        <Typography variant="h5" gutterBottom>
          Distance Vision (Snellen Chart - 20 feet/6 meters)
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Typography variant="subtitle2" gutterBottom>
          Right Eye (OD)
        </Typography>
        {renderAcuityInputs('', 'distance_od')}

        <Typography variant="subtitle2" gutterBottom>
          Left Eye (OS)
        </Typography>
        {renderAcuityInputs('', 'distance_os')}

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          Near (Jaeger/Reduced Snellen - 14 inches/35 cm)
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Typography variant="subtitle2" gutterBottom>
          Right Eye (OD)
        </Typography>
        {renderAcuityInputs('', 'near_od')}

        <Typography variant="subtitle2" gutterBottom>
          Left Eye (OS)
        </Typography>
        {renderAcuityInputs('', 'near_os')}

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          Pupil Reaction
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Typography variant="subtitle2" gutterBottom>
          Right Eye (OD)
        </Typography>
        {renderAcuityInputs('', 'pupil_reaction_od')}

        <Typography variant="subtitle2" gutterBottom>
          Left Eye (OS)
        </Typography>
        {renderAcuityInputs('', 'pupil_reaction_os')}
      </Box>
    </FormDialog>
  );
};

export default AddVisualAcuity;
