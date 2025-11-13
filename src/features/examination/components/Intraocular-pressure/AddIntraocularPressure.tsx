import React from 'react';
import { Grid, TextField, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormDialog from '../../../shared/ui-component/formsDialog/FormDialog';

export interface MeasurementMethod {
  value: string;
  other?: string | null;
}

export interface PressureData {
  visit_id: string;
  left_eye: string;
  right_eye: string;
  time_of_measurement: string;
  method: MeasurementMethod;
}

interface AddIntraocularPressureProps {
  open: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (data: PressureData) => void;
  visit: string;
}

const validationSchema = Yup.object().shape({
  left_eye: Yup.number().required('Left eye pressure is required'),
  right_eye: Yup.number().required('Right eye pressure is required'),
  time_of_measurement: Yup.string().required('Time of measurement is required'),
  method: Yup.string().required('Please specify the method'),
});

const AddIntraocularPressure: React.FC<AddIntraocularPressureProps> = ({
  open,
  isSubmitting,
  onClose,
  onSubmit,
  visit,
}) => {
  const initialValues: PressureData = {
    visit_id: visit,
    left_eye: '',
    right_eye: '',
    time_of_measurement: '',
    method: { value: 'Applanation', other: null },
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={values => onSubmit(values)}
    >
      {({ values, handleChange, errors, touched }) => (
        <Form>
          <FormDialog
            open={open}
            title="Add Intraocular Pressure Measurement"
            onClose={onClose}
            onSubmit={() => {}}
            submitting={isSubmitting}
          >
            <Grid container spacing={2}>
              <Grid>
                <TextField
                  fullWidth
                  label="Left Eye Pressure (mmHg)"
                  name="left_eye"
                  value={values.left_eye}
                  onChange={handleChange}
                  error={touched.left_eye && Boolean(errors.left_eye)}
                  helperText={touched.left_eye && errors.left_eye}
                  type="number"
                  inputProps={{ step: 0.1 }}
                />
              </Grid>
              <Grid>
                <TextField
                  fullWidth
                  label="Right Eye Pressure (mmHg)"
                  name="right_eye"
                  value={values.right_eye}
                  onChange={handleChange}
                  error={touched.right_eye && Boolean(errors.right_eye)}
                  helperText={touched.right_eye && errors.right_eye}
                  type="number"
                  inputProps={{ step: 0.1 }}
                />
              </Grid>
              <Grid>
                <TextField
                  fullWidth
                  label="Time of Measurement"
                  name="time_of_measurement"
                  value={values.time_of_measurement}
                  onChange={handleChange}
                  error={touched.time_of_measurement && Boolean(errors.time_of_measurement)}
                  helperText={touched.time_of_measurement && errors.time_of_measurement}
                  type="time"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid>
                <FormControl fullWidth>
                  <InputLabel>Measurement Method</InputLabel>
                  <Select name="method.value" value={values.method.value} onChange={handleChange}>
                    <MenuItem value="Applanation">Applanation</MenuItem>
                    <MenuItem value="Non-contact">Non-contact</MenuItem>
                    <MenuItem value="Rebound">Rebound</MenuItem>
                    <MenuItem value="Digital">Digital palpation</MenuItem>
                    <MenuItem value="other">Other (specify)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {values.method.value === 'other' && (
                <Grid>
                  <TextField
                    fullWidth
                    label="Specify Method"
                    name="method.other"
                    value={values.method.other || ''}
                    onChange={handleChange}
                    error={touched.method?.other && Boolean(errors.method?.other)}
                    helperText={touched.method?.other && errors.method?.other}
                  />
                </Grid>
              )}
            </Grid>
          </FormDialog>
        </Form>
      )}
    </Formik>
  );
};

export default AddIntraocularPressure;
