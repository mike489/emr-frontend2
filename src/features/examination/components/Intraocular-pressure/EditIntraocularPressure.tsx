import React from 'react';
import { Grid, TextField, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormDialog from '../../../shared/ui-component/formsDialog/FormDialog';
import type { PressureData } from './AddIntraocularPressure';

interface EditIntraocularPressureProps {
  open: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (data: PressureData) => void;
  pressure: PressureData | null;
  visit: string;
}

const validationSchema = Yup.object().shape({
  left_eye: Yup.number().required('Left eye pressure is required'),
  right_eye: Yup.number().required('Right eye pressure is required'),
  time_of_measurement: Yup.string().required('Time of measurement is required'),
  method: Yup.string().required('Please specify the method'),
});

const EditIntraocularPressure: React.FC<EditIntraocularPressureProps> = ({
  open,
  isSubmitting,
  onClose,
  onSubmit,
  pressure,
  visit,
}) => {
  if (!pressure) return null;

  const initialValues: PressureData = {
    ...pressure,
    visit_id: visit,
  };

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={values => onSubmit(values)}
    >
      {({ values, handleChange, errors, touched }) => (
        <Form>
          <FormDialog
            open={open}
            title="Edit Intraocular Pressure Measurement"
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

export default EditIntraocularPressure;
