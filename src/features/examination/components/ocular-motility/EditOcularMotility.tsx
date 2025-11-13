import React from 'react';
import {
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Divider,
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormDialog from '../../../shared/ui-component/formsDialog/FormDialog';

interface OcularMotilityFormValues {
  visit_id: string;
  eom: string;
  eom_gaze: string;
  eom_eye: string;
  hirschberg_test: string;
  hirschberg_test_eye: string;
  hirschberg_test_deviation: string;
  cover_uncover_test: string;
  cover_uncover_test_phoria: string;
  cover_uncover_test_tropia: string;
  cover_uncover_test_direction: string;
  cover_uncover_test_distance: string;
  cover_uncover_test_near: string;
  stereopsis: string;
  stereopsis_test: string;
  systemic_conditions: string[];
  allergies: string[];
  current_systemic_medication: string;
  eye_movement_restriction: string;
  strabismus_type: string;
  deviation_measurements: string[];
}

interface EditOcularMotilityProps {
  open: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData: any;
}

const validationSchema = Yup.object({
  eom: Yup.string().required('EOM is required'),
  eom_gaze: Yup.string().required('EOM Gaze is required'),
  eom_eye: Yup.string().required('EOM Eye is required'),
  hirschberg_test: Yup.string().required('Hirschberg Test is required'),
  hirschberg_test_eye: Yup.string().required('Hirschberg Eye is required'),
  hirschberg_test_deviation: Yup.string().required('Deviation is required'),
  cover_uncover_test: Yup.string().required('Cover-Uncover Test is required'),
  cover_uncover_test_phoria: Yup.string().required('Phoria is required'),
  cover_uncover_test_tropia: Yup.string().required('Tropia is required'),
  cover_uncover_test_direction: Yup.string().required('Direction is required'),
  cover_uncover_test_distance: Yup.string().required('Distance is required'),
  cover_uncover_test_near: Yup.string().required('Near is required'),
  stereopsis: Yup.string().required('Stereopsis is required'),
  stereopsis_test: Yup.string().required('Stereopsis Test is required'),
});

const EditOcularMotility: React.FC<EditOcularMotilityProps> = ({
  open,
  isSubmitting,
  onClose,
  onSubmit,
  initialData,
}) => {
  const initialValues: OcularMotilityFormValues = {
    visit_id: initialData?.visit_id || '',
    eom: initialData?.eom?.value || '',
    eom_gaze: initialData?.eom?.gaze || '',
    eom_eye: initialData?.eom?.eye || '',
    hirschberg_test: initialData?.hirschberg_test?.value || '',
    hirschberg_test_eye: initialData?.hirschberg_test?.eye || '',
    hirschberg_test_deviation: initialData?.hirschberg_test?.deviation || '',
    cover_uncover_test: initialData?.cover_uncover_test?.value || '',
    cover_uncover_test_phoria: initialData?.cover_uncover_test?.phoria || '',
    cover_uncover_test_tropia: initialData?.cover_uncover_test?.tropia || '',
    cover_uncover_test_direction: initialData?.cover_uncover_test?.direction || '',
    cover_uncover_test_distance: initialData?.cover_uncover_test?.distance || '',
    cover_uncover_test_near: initialData?.cover_uncover_test?.near || '',
    stereopsis: initialData?.stereopsis?.value || '',
    stereopsis_test: initialData?.stereopsis?.test || '',
    systemic_conditions: initialData?.systemic_conditions || [],
    allergies: initialData?.allergies || [],
    current_systemic_medication: initialData?.current_systemic_medication || '',
    eye_movement_restriction: initialData?.eye_movement_restriction || '',
    strabismus_type: initialData?.strabismus_type || '',
    deviation_measurements: initialData?.deviation_measurements || [],
  };

  return (
    <FormDialog
      open={open}
      title="Edit Ocular Motility Examination"
      onClose={onClose}
      //   onCancel={onClose}
      onSubmit={() => {}}
      submitting={isSubmitting}
      //   maxWidth="md"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={values => {
          const transformedData = {
            visit_id: values.visit_id,
            eom: {
              value: values.eom,
              gaze: values.eom_gaze,
              eye: values.eom_eye,
            },
            hirschberg_test: {
              value: values.hirschberg_test,
              eye: values.hirschberg_test_eye,
              deviation: values.hirschberg_test_deviation,
            },
            cover_uncover_test: {
              value: values.cover_uncover_test,
              phoria: values.cover_uncover_test_phoria,
              tropia: values.cover_uncover_test_tropia,
              direction: values.cover_uncover_test_direction,
              distance: values.cover_uncover_test_distance,
              near: values.cover_uncover_test_near,
            },
            stereopsis: {
              value: values.stereopsis,
              test: values.stereopsis_test,
            },
            systemic_conditions: values.systemic_conditions,
            allergies: values.allergies,
            current_systemic_medication: values.current_systemic_medication,
            eye_movement_restriction: values.eye_movement_restriction,
            strabismus_type: values.strabismus_type,
            deviation_measurements: values.deviation_measurements,
          };
          onSubmit(transformedData);
        }}
      >
        {({ values, handleChange }) => (
          <Form>
            <Grid container spacing={3}>
              {/* Example: EOM Section */}
              <Grid>
                <Typography variant="h6" gutterBottom>
                  Extraocular Movements (EOM)
                </Typography>
                <Divider />
              </Grid>
              <Grid>
                <FormControl fullWidth margin="normal">
                  <InputLabel>EOM Status</InputLabel>
                  <Select name="eom" value={values.eom} onChange={handleChange}>
                    <MenuItem value="Full">Full</MenuItem>
                    <MenuItem value="Restricted">Restricted</MenuItem>
                    <MenuItem value="Painful">Painful</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid>
                <FormControl fullWidth margin="normal">
                  <InputLabel>EOM Gaze</InputLabel>
                  <Select name="eom_gaze" value={values.eom_gaze} onChange={handleChange}>
                    <MenuItem value="Primary">Primary</MenuItem>
                    <MenuItem value="Right">Right</MenuItem>
                    <MenuItem value="Left">Left</MenuItem>
                    <MenuItem value="Up">Up</MenuItem>
                    <MenuItem value="Down">Down</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid>
                <FormControl fullWidth margin="normal">
                  <InputLabel>EOM Eye</InputLabel>
                  <Select name="eom_eye" value={values.eom_eye} onChange={handleChange}>
                    <MenuItem value="OD">Right Eye (OD)</MenuItem>
                    <MenuItem value="OS">Left Eye (OS)</MenuItem>
                    <MenuItem value="OU">Both Eyes (OU)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Additional sections (Hirschberg, Cover-Uncover, Stereopsis) go here, same pattern */}
            </Grid>
            <Box mt={3}>
              <Button type="submit" variant="contained" fullWidth>
                Save Changes
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </FormDialog>
  );
};

export default EditOcularMotility;
