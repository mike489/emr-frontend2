import React from 'react';
import {
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Divider,
  Typography,
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
}

interface AddOcularMotilityProps {
  open: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: OcularMotilityFormValues) => void;
  visit: string;
}

const validationSchema = Yup.object().shape({
  eom: Yup.string().required('EOM Status is required'),
  eom_gaze: Yup.string().required('EOM Gaze is required'),
  eom_eye: Yup.string().required('EOM Eye is required'),
  hirschberg_test: Yup.string().required('Hirschberg Test is required'),
  hirschberg_test_eye: Yup.string().required('Hirschberg Eye is required'),
  hirschberg_test_deviation: Yup.string().required('Hirschberg Deviation is required'),
  cover_uncover_test: Yup.string().required('Cover-Uncover Test is required'),
  cover_uncover_test_phoria: Yup.string().required('Phoria Type is required'),
  cover_uncover_test_tropia: Yup.string().required('Tropia Type is required'),
  cover_uncover_test_direction: Yup.string().required('Direction is required'),
  cover_uncover_test_distance: Yup.string().required('Distance is required'),
  cover_uncover_test_near: Yup.string().required('Near is required'),
  stereopsis: Yup.string().required('Stereopsis is required'),
  stereopsis_test: Yup.string().required('Stereopsis Test is required'),
});

const AddOcularMotility: React.FC<AddOcularMotilityProps> = ({
  open,
  isSubmitting,
  onClose,
  onSubmit,
  visit,
}) => {
  const initialValues: OcularMotilityFormValues = {
    visit_id: visit,
    eom: '',
    eom_gaze: '',
    eom_eye: '',
    hirschberg_test: '',
    hirschberg_test_eye: '',
    hirschberg_test_deviation: '',
    cover_uncover_test: '',
    cover_uncover_test_phoria: '',
    cover_uncover_test_tropia: '',
    cover_uncover_test_direction: '',
    cover_uncover_test_distance: '',
    cover_uncover_test_near: '',
    stereopsis: '',
    stereopsis_test: '',
  };

  return (
    <FormDialog
      open={open}
      title="Add Ocular Motility Examination"
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
          onSubmit(values);
        }}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Extraocular Movements (EOM) Section */}
              <Grid>
                <Typography variant="h6" gutterBottom>
                  Extraocular Movements (EOM)
                </Typography>
                <Divider />
              </Grid>

              <FormControl fullWidth margin="normal" required>
                <InputLabel>EOM Status</InputLabel>
                <Select
                  name="eom"
                  value={values.eom}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  label="EOM Status"
                >
                  <MenuItem value="Full">Full</MenuItem>
                  <MenuItem value="Restricted">Restricted</MenuItem>
                  <MenuItem value="Painful">Painful</MenuItem>
                </Select>
                {touched.eom && errors.eom && (
                  <Typography color="error" variant="caption">
                    {errors.eom}
                  </Typography>
                )}
              </FormControl>

              <FormControl fullWidth margin="normal" required>
                <InputLabel>EOM Gaze</InputLabel>
                <Select
                  name="eom_gaze"
                  value={values.eom_gaze}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  label="EOM Gaze"
                >
                  <MenuItem value="Primary">Primary</MenuItem>
                  <MenuItem value="Right">Right</MenuItem>
                  <MenuItem value="Left">Left</MenuItem>
                  <MenuItem value="Up">Up</MenuItem>
                  <MenuItem value="Down">Down</MenuItem>
                </Select>
                {touched.eom_gaze && errors.eom_gaze && (
                  <Typography color="error" variant="caption">
                    {errors.eom_gaze}
                  </Typography>
                )}
              </FormControl>

              <FormControl fullWidth margin="normal" required>
                <InputLabel>EOM Eye</InputLabel>
                <Select
                  name="eom_eye"
                  value={values.eom_eye}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  label="EOM Eye"
                >
                  <MenuItem value="OD">Right Eye (OD)</MenuItem>
                  <MenuItem value="OS">Left Eye (OS)</MenuItem>
                  <MenuItem value="OU">Both Eyes (OU)</MenuItem>
                </Select>
                {touched.eom_eye && errors.eom_eye && (
                  <Typography color="error" variant="caption">
                    {errors.eom_eye}
                  </Typography>
                )}
              </FormControl>

              {/* Hirschberg Test Section */}
              <Grid>
                <Typography variant="h6" gutterBottom>
                  Hirschberg Test
                </Typography>
                <Divider />
              </Grid>

              <FormControl fullWidth margin="normal" required>
                <InputLabel>Hirschberg Test</InputLabel>
                <Select
                  name="hirschberg_test"
                  value={values.hirschberg_test}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  label="Hirschberg Test"
                >
                  <MenuItem value="Normal">Normal</MenuItem>
                  <MenuItem value="Centered">Centered</MenuItem>
                  <MenuItem value="Nasal">Nasal</MenuItem>
                  <MenuItem value="Temporal">Temporal</MenuItem>
                </Select>
                {touched.hirschberg_test && errors.hirschberg_test && (
                  <Typography color="error" variant="caption">
                    {errors.hirschberg_test}
                  </Typography>
                )}
              </FormControl>

              <FormControl fullWidth margin="normal" required>
                <InputLabel>Eye</InputLabel>
                <Select
                  name="hirschberg_test_eye"
                  value={values.hirschberg_test_eye}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  label="Eye"
                >
                  <MenuItem value="OD">Right Eye</MenuItem>
                  <MenuItem value="OS">Left Eye</MenuItem>
                </Select>
                {touched.hirschberg_test_eye && errors.hirschberg_test_eye && (
                  <Typography color="error" variant="caption">
                    {errors.hirschberg_test_eye}
                  </Typography>
                )}
              </FormControl>

              <FormControl fullWidth margin="normal" required>
                <InputLabel>Deviation</InputLabel>
                <Select
                  name="hirschberg_test_deviation"
                  value={values.hirschberg_test_deviation}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  label="Deviation"
                >
                  <MenuItem value="None">None</MenuItem>
                  <MenuItem value="Esotropia">Esotropia</MenuItem>
                  <MenuItem value="Exotropia">Exotropia</MenuItem>
                  <MenuItem value="Hypertropia">Hypertropia</MenuItem>
                  <MenuItem value="Hypotropia">Hypotropia</MenuItem>
                </Select>
                {touched.hirschberg_test_deviation && errors.hirschberg_test_deviation && (
                  <Typography color="error" variant="caption">
                    {errors.hirschberg_test_deviation}
                  </Typography>
                )}
              </FormControl>

              {/* Cover-Uncover Test Section */}
              <Grid>
                <Typography variant="h6" gutterBottom>
                  Cover-Uncover Test
                </Typography>
                <Divider />
              </Grid>

              <FormControl fullWidth margin="normal" required>
                <InputLabel>Test Result</InputLabel>
                <Select
                  name="cover_uncover_test"
                  value={values.cover_uncover_test}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  label="Test Result"
                >
                  <MenuItem value="Normal">Normal</MenuItem>
                  <MenuItem value="Abnormal">Abnormal</MenuItem>
                </Select>
                {touched.cover_uncover_test && errors.cover_uncover_test && (
                  <Typography color="error" variant="caption">
                    {errors.cover_uncover_test}
                  </Typography>
                )}
              </FormControl>

              {/* Add other fields similarly */}

              {/* Stereopsis Section */}
              <Grid>
                <Typography variant="h6" gutterBottom>
                  Stereopsis
                </Typography>
                <Divider />
              </Grid>

              <FormControl fullWidth margin="normal" required>
                <InputLabel>Stereopsis</InputLabel>
                <Select
                  name="stereopsis"
                  value={values.stereopsis}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  label="Stereopsis"
                >
                  <MenuItem value="Present">Present</MenuItem>
                  <MenuItem value="Absent">Absent</MenuItem>
                  <MenuItem value="Reduced">Reduced</MenuItem>
                </Select>
                {touched.stereopsis && errors.stereopsis && (
                  <Typography color="error" variant="caption">
                    {errors.stereopsis}
                  </Typography>
                )}
              </FormControl>

              <FormControl fullWidth margin="normal" required>
                <InputLabel>Stereopsis Test</InputLabel>
                <Select
                  name="stereopsis_test"
                  value={values.stereopsis_test}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  label="Stereopsis Test"
                >
                  <MenuItem value="Normal">Normal</MenuItem>
                  <MenuItem value="Reduced">Reduced</MenuItem>
                  <MenuItem value="Absent">Absent</MenuItem>
                  <MenuItem value="Uncooperative">Uncooperative</MenuItem>
                </Select>
                {touched.stereopsis_test && errors.stereopsis_test && (
                  <Typography color="error" variant="caption">
                    {errors.stereopsis_test}
                  </Typography>
                )}
              </FormControl>

              <Grid display="flex" justifyContent="flex-end">
                <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                  Save
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </FormDialog>
  );
};

export default AddOcularMotility;
