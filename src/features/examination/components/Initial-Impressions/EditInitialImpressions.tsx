import { useState, useEffect } from 'react';
import {
  TextField,
  Box,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  type SelectChangeEvent,
} from '@mui/material';
import { toast } from 'react-toastify';
import FormDialog from '../../../shared/ui-component/formsDialog/FormDialog';

const diagnosisOptions = [
  'Cataract',
  'Glaucoma',
  'Diabetic Retinopathy',
  'Macular Degeneration',
  'Dry Eye Syndrome',
  'Conjunctivitis',
  'Refractive Error',
  'Other',
] as const;

interface InitialImpressionData {
  visit_id: string | number;
  primary_diagnosis: string;
  plan: string;
}

interface EditInitialImpressionsProps {
  open: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (data: InitialImpressionData) => void;
  initialData: { visit_id: string | number } & Partial<Omit<InitialImpressionData, 'visit_id'>>;
}

const EditInitialImpressions: React.FC<EditInitialImpressionsProps> = ({
  open,
  isSubmitting,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [initialImpressionData, setInitialImpressionData] = useState<InitialImpressionData>({
    visit_id: '',
    primary_diagnosis: '',
    plan: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof InitialImpressionData, string>>>({});

  useEffect(() => {
    if (initialData) {
      setInitialImpressionData({
        visit_id: initialData.visit_id,
        primary_diagnosis: initialData.primary_diagnosis || '',
        plan: initialData.plan || '',
      });
    }
  }, [initialData]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const name = event.target.name as keyof InitialImpressionData;
    const value = event.target.value;

    setInitialImpressionData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateFields = () => {
    const newErrors: Partial<Record<keyof InitialImpressionData, string>> = {};
    const requiredFields: (keyof InitialImpressionData)[] = ['primary_diagnosis', 'plan'];

    requiredFields.forEach(field => {
      if (!initialImpressionData[field]) {
        newErrors[field] = `The ${field.replace(/_/g, ' ')} field is required.`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateFields()) {
      toast.error('Please fill all required fields');
      return;
    }
    onSubmit(initialImpressionData);
  };

  return (
    <FormDialog
      open={open}
      title="Edit Initial Impression"
      onClose={onClose}
      //   onCancel={onClose}
      onSubmit={handleSubmit}
      submitting={isSubmitting}
      //   maxWidth="md"
    >
      <Box sx={{ mt: 2 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Primary Diagnosis
            </Typography>
            <FormControl fullWidth margin="normal" required error={!!errors.primary_diagnosis}>
              <InputLabel>Primary Diagnosis</InputLabel>
              <Select
                name="primary_diagnosis"
                value={initialImpressionData.primary_diagnosis}
                onChange={handleChange}
                label="Primary Diagnosis"
              >
                {diagnosisOptions.map(option => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
              {errors.primary_diagnosis && (
                <FormHelperText>{errors.primary_diagnosis}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
              Treatment Plan
            </Typography>
            <TextField
              fullWidth
              label="Plan"
              name="plan"
              value={initialImpressionData.plan}
              onChange={handleChange}
              margin="normal"
              required
              error={!!errors.plan}
              helperText={errors.plan}
              multiline
              rows={4}
            />
          </Grid>
        </Grid>
      </Box>
    </FormDialog>
  );
};

export default EditInitialImpressions;
