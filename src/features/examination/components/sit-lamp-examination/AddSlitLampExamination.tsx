// import React from 'react';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Grid,
//   MenuItem,
//   TextField,
// } from '@mui/material';
// import { useFormik } from 'formik';
// import * as Yup from 'yup';
// import { toast } from 'react-toastify';

// interface EyeField {
//   value: string;
//   other?: string;
// }

// export interface SlitLampFormValues {
//   lids: { od: EyeField; os: EyeField };
//   lashes: { od: EyeField; os: EyeField };
//   conjunctiva: { od: EyeField; os: EyeField };
//   sclera: { od: EyeField; os: EyeField };
//   lacrimal_system: { od: EyeField; os: EyeField };
//   visit_id: string | number;
// }

// interface AddSlitLampExaminationProps {
//   open: boolean;
//   onClose: () => void;
//   onSubmit: (data: SlitLampFormValues) => Promise<void>;
//   isSubmitting?: boolean;
//   visit: string;
// }

// const options = ['Normal', 'Abnormal', 'Other'];

// const validationSchema = Yup.object({
//   lids: Yup.object({
//     od: Yup.object({
//       value: Yup.string().required('Required'),
//       other: Yup.string().when('value', {
//         is: 'Other',
//         then: schema => schema.required('Specify other value'),
//         otherwise: schema => schema.notRequired(),
//       }),
//     }),
//     os: Yup.object({
//       value: Yup.string().required('Required'),
//       other: Yup.string().when('value', {
//         is: 'Other',
//         then: schema => schema.required('Specify other value'),
//         otherwise: schema => schema.notRequired(),
//       }),
//     }),
//   }),
//   // Repeat for other fields
//   lashes: Yup.object().shape({
//     od: Yup.object({
//       value: Yup.string().required('Required'),
//       other: Yup.string().when('value', {
//         is: 'Other',
//         then: schema => schema.required('Specify other value'),
//       }),
//     }),
//     os: Yup.object({
//       value: Yup.string().required('Required'),
//       other: Yup.string().when('value', {
//         is: 'Other',
//         then: schema => schema.required('Specify other value'),
//       }),
//     }),
//   }),
//   conjunctiva: Yup.object().shape({
//     od: Yup.object({
//       value: Yup.string().required('Required'),
//       other: Yup.string().when('value', {
//         is: 'Other',
//         then: schema => schema.required('Specify other value'),
//       }),
//     }),
//     os: Yup.object({
//       value: Yup.string().required('Required'),
//       other: Yup.string().when('value', {
//         is: 'Other',
//         then: schema => schema.required('Specify other value'),
//       }),
//     }),
//   }),
//   sclera: Yup.object().shape({
//     od: Yup.object({
//       value: Yup.string().required('Required'),
//       other: Yup.string().when('value', {
//         is: 'Other',
//         then: schema => schema.required('Specify other value'),
//       }),
//     }),
//     os: Yup.object({
//       value: Yup.string().required('Required'),
//       other: Yup.string().when('value', {
//         is: 'Other',
//         then: schema => schema.required('Specify other value'),
//       }),
//     }),
//   }),
//   lacrimal_system: Yup.object().shape({
//     od: Yup.object({
//       value: Yup.string().required('Required'),
//       other: Yup.string().when('value', {
//         is: 'Other',
//         then: schema => schema.required('Specify other value'),
//       }),
//     }),
//     os: Yup.object({
//       value: Yup.string().required('Required'),
//       other: Yup.string().when('value', {
//         is: 'Other',
//         then: schema => schema.required('Specify other value'),
//       }),
//     }),
//   }),
// });

// const AddSlitLampExamination: React.FC<AddSlitLampExaminationProps> = ({
//   open,
//   onClose,
//   onSubmit,
//   isSubmitting,
//   visit,
// }) => {
//   const formik = useFormik<SlitLampFormValues>({
//     initialValues: {
//       lids: { od: { value: '', other: '' }, os: { value: '', other: '' } },
//       lashes: { od: { value: '', other: '' }, os: { value: '', other: '' } },
//       conjunctiva: { od: { value: '', other: '' }, os: { value: '', other: '' } },
//       sclera: { od: { value: '', other: '' }, os: { value: '', other: '' } },
//       lacrimal_system: { od: { value: '', other: '' }, os: { value: '', other: '' } },
//       visit_id: visit,
//     },
//     validationSchema,
//     onSubmit: async values => {
//       try {
//         await onSubmit(values);
//         formik.resetForm();
//         onClose();
//       } catch (error: any) {
//         toast.error(error.message || 'Failed to add slit lamp exam');
//       }
//     },
//   });

//   const renderEyeField = (label: string, field: keyof SlitLampFormValues) => (
//     <Grid item xs={12} md={6} key={field}>
//       <TextField
//         select
//         fullWidth
//         name={`${field}.od.value`}
//         label={`${label} (OD)`}
//         value={formik.values[field].od.value}
//         onChange={formik.handleChange}
//         error={Boolean(formik.touched[field]?.od?.value && formik.errors[field]?.od?.value)}
//         helperText={formik.touched[field]?.od?.value && (formik.errors[field]?.od as any)?.value}
//         sx={{ mb: 2 }}
//       >
//         {options.map(opt => (
//           <MenuItem key={opt} value={opt}>
//             {opt}
//           </MenuItem>
//         ))}
//       </TextField>

//       {formik.values[field].od.value === 'Other' && (
//         <TextField
//           fullWidth
//           name={`${field}.od.other`}
//           label={`${label} (OD) - Specify`}
//           value={formik.values[field].od.other}
//           onChange={formik.handleChange}
//           error={Boolean(formik.touched[field]?.od?.other && formik.errors[field]?.od?.other)}
//           helperText={formik.touched[field]?.od?.other && (formik.errors[field]?.od as any)?.other}
//         />
//       )}

//       <TextField
//         select
//         fullWidth
//         name={`${field}.os.value`}
//         label={`${label} (OS)`}
//         value={formik.values[field].os.value}
//         onChange={formik.handleChange}
//         error={Boolean(formik.touched[field]?.os?.value && formik.errors[field]?.os?.value)}
//         helperText={formik.touched[field]?.os?.value && (formik.errors[field]?.os as any)?.value}
//         sx={{ mt: 2, mb: 2 }}
//       >
//         {options.map(opt => (
//           <MenuItem key={opt} value={opt}>
//             {opt}
//           </MenuItem>
//         ))}
//       </TextField>

//       {formik.values[field].os.value === 'Other' && (
//         <TextField
//           fullWidth
//           name={`${field}.os.other`}
//           label={`${label} (OS) - Specify`}
//           value={formik.values[field].os.other}
//           onChange={formik.handleChange}
//           error={Boolean(formik.touched[field]?.os?.other && formik.errors[field]?.os?.other)}
//           helperText={formik.touched[field]?.os?.other && (formik.errors[field]?.os as any)?.other}
//         />
//       )}
//     </Grid>
//   );

//   return (
//     <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
//       <DialogTitle>Add Slit Lamp Examination</DialogTitle>
//       <DialogContent>
//         <form onSubmit={formik.handleSubmit}>
//           <Grid container spacing={2} sx={{ mt: 1 }}>
//             {(
//               [
//                 'lids',
//                 'lashes',
//                 'conjunctiva',
//                 'sclera',
//                 'lacrimal_system',
//               ] as (keyof SlitLampFormValues)[]
//             ).map(key =>
//               renderEyeField(key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' '), key)
//             )}
//           </Grid>

//           <DialogActions sx={{ mt: 3 }}>
//             <Button onClick={onClose} color="secondary" variant="outlined">
//               Cancel
//             </Button>
//             <Button type="submit" color="primary" variant="contained" disabled={isSubmitting}>
//               {isSubmitting ? 'Saving...' : 'Save'}
//             </Button>
//           </DialogActions>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default AddSlitLampExamination;
