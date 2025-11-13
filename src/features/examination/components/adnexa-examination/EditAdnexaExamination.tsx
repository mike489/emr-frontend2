import { useState, useEffect } from 'react';
import {
  TextField,
  Box,
  Typography,
  Grid,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import { toast } from 'react-toastify';
import FormDialog from '../../../shared/ui-component/formsDialog/FormDialog';

// ----------------- Types -----------------
export interface AdnexaEyeData {
  value: string;
  other?: string;
}

export interface AdnexaField {
  od: AdnexaEyeData;
  os: AdnexaEyeData;
}

export interface AdnexaData {
  visit_id: string;
  lids: AdnexaField;
  lashes: AdnexaField;
  conjunctiva: AdnexaField;
  sclera: AdnexaField;
  lacrimal_system: AdnexaField;
}

interface EditAdnexaExaminationProps {
  open: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (data: AdnexaData) => void;
  initialData: AdnexaData;
}

// ----------------- Flattened State Hook -----------------
const useFlattenedAdnexaState = (initialData: AdnexaData) => {
  const [flatData, setFlatData] = useState<Record<string, string>>({});

  useEffect(() => {
    const flatten = (data: AdnexaData) => {
      const result: Record<string, string> = { visit_id: data.visit_id };
      (['lids', 'lashes', 'conjunctiva', 'sclera', 'lacrimal_system'] as const).forEach(field => {
        result[`${field}_od`] = data[field].od.value || '';
        result[`${field}_od_other`] = data[field].od.other || '';
        result[`${field}_os`] = data[field].os.value || '';
        result[`${field}_os_other`] = data[field].os.other || '';
      });
      return result;
    };
    setFlatData(flatten(initialData));
  }, [initialData]);

  const handleChange = (field: string, value: string) => {
    setFlatData(prev => ({ ...prev, [field]: value }));
  };

  const toNested = (): AdnexaData => {
    const nested: AdnexaData = {
      visit_id: flatData.visit_id,
      lids: { od: { value: '', other: '' }, os: { value: '', other: '' } },
      lashes: { od: { value: '', other: '' }, os: { value: '', other: '' } },
      conjunctiva: { od: { value: '', other: '' }, os: { value: '', other: '' } },
      sclera: { od: { value: '', other: '' }, os: { value: '', other: '' } },
      lacrimal_system: { od: { value: '', other: '' }, os: { value: '', other: '' } },
    };

    (['lids', 'lashes', 'conjunctiva', 'sclera', 'lacrimal_system'] as const).forEach(field => {
      nested[field].od.value = flatData[`${field}_od`] || '';
      nested[field].od.other = flatData[`${field}_od_other`] || '';
      nested[field].os.value = flatData[`${field}_os`] || '';
      nested[field].os.other = flatData[`${field}_os_other`] || '';
    });
    return nested;
  };

  return { flatData, handleChange, toNested };
};

// ----------------- Options -----------------
const adnexaOptions = {
  lids: ['Normal', 'Ptosis', 'Ectropion', 'Entropion', 'Edema', 'Erythema', 'Other'],
  lashes: ['Normal', 'Trichiasis', 'Madarosis', 'Blepharitis', 'Poliosis', 'Other'],
  conjunctiva: ['Normal', 'Injected', 'Pale', 'Chemosis', 'Follicles', 'Papillae', 'Other'],
  sclera: ['Normal', 'Blue', 'Yellow', 'Red', 'Other'],
  lacrimal_system: ['Normal', 'Swelling', 'Discharge', 'Tenderness', 'Other'],
};

// ----------------- Component -----------------
export const EditAdnexaExamination: React.FC<EditAdnexaExaminationProps> = ({
  open,
  isSubmitting,
  onClose,
  onSubmit,
  initialData,
}) => {
  const { flatData, handleChange, toNested } = useFlattenedAdnexaState(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateFields = (): boolean => {
    const newErrors: Record<string, string> = {};
    (['lids', 'lashes', 'conjunctiva', 'sclera', 'lacrimal_system'] as const).forEach(field => {
      ['od', 'os'].forEach(eye => {
        if (!flatData[`${field}_${eye}`]) {
          newErrors[`${field}_${eye}`] = `${field.replace(/_/g, ' ')} (${eye}) is required`;
        }
        if (flatData[`${field}_${eye}`] === 'Other' && !flatData[`${field}_${eye}_other`]) {
          newErrors[`${field}_${eye}_other`] = 'Please specify details for "Other" option';
        }
      });
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFields()) {
      toast.error('Please fill all required fields');
      return;
    }
    onSubmit(toNested());
  };

  const renderSection = (fieldName: keyof typeof adnexaOptions) => {
    const options = adnexaOptions[fieldName];
    return (
      <Box sx={{ mb: 3 }} key={fieldName}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          {fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace('_', ' ')}
        </Typography>
        <Grid container spacing={2}>
          {(['od', 'os'] as const).map(eye => (
            <Grid size={{ xs: 6 }} key={`${fieldName}_${eye}`}>
              <Typography variant="subtitle2" gutterBottom>
                {eye === 'od' ? 'Right Eye (OD)' : 'Left Eye (OS)'}
              </Typography>
              <FormControl fullWidth margin="normal" error={!!errors[`${fieldName}_${eye}`]}>
                <InputLabel>{fieldName}</InputLabel>
                <Select
                  value={flatData[`${fieldName}_${eye}`] || ''}
                  onChange={e => handleChange(`${fieldName}_${eye}`, e.target.value)}
                >
                  {options.map(option => (
                    <MenuItem key={`${fieldName}_${eye}_${option}`} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
                {errors[`${fieldName}_${eye}`] && (
                  <FormHelperText>{errors[`${fieldName}_${eye}`]}</FormHelperText>
                )}
              </FormControl>
              {flatData[`${fieldName}_${eye}`] === 'Other' && (
                <TextField
                  fullWidth
                  label={`Specify ${fieldName} (${eye === 'od' ? 'OD' : 'OS'})`}
                  value={flatData[`${fieldName}_${eye}_other`] || ''}
                  onChange={e => handleChange(`${fieldName}_${eye}_other`, e.target.value)}
                  margin="normal"
                  error={!!errors[`${fieldName}_${eye}_other`]}
                  helperText={errors[`${fieldName}_${eye}_other`]}
                />
              )}
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  return (
    <FormDialog
      open={open}
      title="Edit Adnexa Examination"
      onClose={onClose}
      onSubmit={handleSubmit}
      submitting={isSubmitting}
    >
      <Box sx={{ mt: 2 }}>
        <Typography variant="h5" gutterBottom>
          Edit Adnexa Examination
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {(['lids', 'lashes', 'conjunctiva', 'sclera', 'lacrimal_system'] as const).map(
          renderSection
        )}
      </Box>
    </FormDialog>
  );
};
