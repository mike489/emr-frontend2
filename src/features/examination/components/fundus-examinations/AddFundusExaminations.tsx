// import React, { useState } from 'react';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Grid,
//   Box,
//   Typography,
//   Divider,
//   CircularProgress,
//   useTheme,
// } from '@mui/material';

// interface AddFundusExaminationsProps {
//   open: boolean;
//   onClose: () => void;
//   onSubmit: (data: any) => void;
//   isSubmitting: boolean;
//   visitId: string;
// }

// const AddFundusExaminations: React.FC<AddFundusExaminationsProps> = ({
//   open,
//   onClose,
//   onSubmit,
//   isSubmitting,
//   visitId,
// }) => {
//   const theme = useTheme();

//   const [formData, setFormData] = useState({
//     dilated: { value: 'No', time: '', drops: '' },
//     optic_disc: {
//       od: { value: 'Pink & Healthy', cupping: '', other: '' },
//       os: { value: 'Pink & Healthy', cupping: '', other: '' },
//     },
//     macula: {
//       od: { value: 'Flat & Intact', other: '' },
//       os: { value: 'Flat & Intact', other: '' },
//     },
//     vessels: {
//       od: { value: 'Normal', other: '' },
//       os: { value: 'Normal', other: '' },
//     },
//     periphery: {
//       od: { value: 'Attached', other: '' },
//       os: { value: 'Attached', other: '' },
//     },
//     visit_id: visitId || '',
//   });

//   const [errors, setErrors] = useState({
//     dilation_time: false,
//     dilation_drops: false,
//   });

//   const handleChange = (field: string, value: string, subField?: string, eye?: 'od' | 'os') => {
//     setFormData(prev => {
//       if (subField && eye) {
//         return {
//           ...prev,
//           [field]: {
//             ...prev[field as keyof typeof prev],
//             [eye]: {
//               ...(prev[field as keyof typeof prev] as any)[eye],
//               [subField]: value,
//             },
//           },
//         };
//       }
//       if (subField) {
//         return {
//           ...prev,
//           [field]: {
//             ...(prev[field as keyof typeof prev] as any),
//             [subField]: value,
//           },
//         };
//       }
//       return { ...prev, [field]: value };
//     });
//   };

//   const handleDilatedChange = (field: string, value: string) => {
//     setFormData(prev => ({
//       ...prev,
//       dilated: { ...prev.dilated, [field]: value },
//     }));
//   };

//   const handleSubmit = () => {
//     const formattedData: any = {
//       visit_id: visitId,
//       dilated: {
//         value: formData.dilated.value,
//         time: formData.dilated.value === 'Yes' ? formData.dilated.time : null,
//         drops: formData.dilated.value === 'Yes' ? formData.dilated.drops : null,
//       },
//       optic_disc: formData.optic_disc,
//       macula: formData.macula,
//       vessels: formData.vessels,
//       periphery: formData.periphery,
//     };

//     onSubmit(formattedData);
//   };

//   const opticDiscOptions = [
//     'Pink & Healthy',
//     'Cupping',
//     'Edema',
//     'Drusen',
//     'Hemorrhage',
//     'Pallor (Temporal/Global)',
//     'Other',
//   ];
//   const maculaOptions = [
//     'Flat & Intact',
//     'Edema',
//     'Drusen',
//     'Hemorrhage',
//     'Pigmentary Changes',
//     'Cyst',
//     'Hole',
//     'Other',
//   ];
//   const vesselsOptions = [
//     'Normal',
//     'Attenuated',
//     'Tortuosity',
//     'A-V Nicking',
//     'Sheathing',
//     'Exudates',
//     'Microaneurysms',
//     'Neovascularization',
//     'Hemorrhage',
//     'Other',
//   ];
//   const peripheryOptions = ['Attached', 'Detached', 'Degeneration', 'Other'];

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle>Add Fundus Examination</DialogTitle>
//       <DialogContent dividers>
//         {/* Dilation Info */}
//         <Box sx={{ mb: 3 }}>
//           <Typography variant="h6">Dilation Information</Typography>
//           <Grid container spacing={2}>
//             <Grid item xs={12} sm={4}>
//               <FormControl fullWidth>
//                 <InputLabel>Dilated</InputLabel>
//                 <Select
//                   value={formData.dilated.value}
//                   onChange={e => handleDilatedChange('value', e.target.value)}
//                   label="Dilated"
//                 >
//                   <MenuItem value="Yes">Yes</MenuItem>
//                   <MenuItem value="No">No</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>
//             {formData.dilated.value === 'Yes' && (
//               <>
//                 <Grid item xs={12} sm={4}>
//                   <TextField
//                     fullWidth
//                     type="time"
//                     label="Dilation Time *"
//                     value={formData.dilated.time}
//                     onChange={e => handleDilatedChange('time', e.target.value)}
//                     error={errors.dilation_time}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                   <TextField
//                     fullWidth
//                     label="Drops Used *"
//                     value={formData.dilated.drops}
//                     onChange={e => handleDilatedChange('drops', e.target.value)}
//                     error={errors.dilation_drops}
//                   />
//                 </Grid>
//               </>
//             )}
//           </Grid>
//         </Box>

//         <Divider sx={{ my: 3 }} />

//         {/* Shared render for OD/OS fields */}
//         {(
//           [
//             { title: 'Optic Disc', field: 'optic_disc', options: opticDiscOptions },
//             { title: 'Macula', field: 'macula', options: maculaOptions },
//             { title: 'Vessels', field: 'vessels', options: vesselsOptions },
//             { title: 'Periphery', field: 'periphery', options: peripheryOptions },
//           ] as const
//         ).map(({ title, field, options }) => (
//           <Box key={field} sx={{ mb: 3 }}>
//             <Typography variant="h6" gutterBottom>
//               {title}
//             </Typography>
//             <Grid container spacing={2}>
//               {(['od', 'os'] as const).map(eye => (
//                 <Grid item xs={12} md={6} key={eye}>
//                   <Typography variant="subtitle2" sx={{ mb: 1 }}>
//                     {eye === 'od' ? 'OD (Right Eye)' : 'OS (Left Eye)'}
//                   </Typography>
//                   <FormControl fullWidth sx={{ mb: 2 }}>
//                     <InputLabel>Status</InputLabel>
//                     <Select
//                       value={formData[field][eye].value}
//                       onChange={e => handleChange(field, e.target.value, 'value', eye)}
//                       label="Status"
//                     >
//                       {options.map(option => (
//                         <MenuItem key={option} value={option}>
//                           {option}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>

//                   {formData[field][eye].value === 'Cupping' && field === 'optic_disc' && (
//                     <TextField
//                       fullWidth
//                       label="Cupping Details"
//                       value={formData[field][eye].cupping}
//                       onChange={e => handleChange(field, e.target.value, 'cupping', eye)}
//                       sx={{ mb: 2 }}
//                     />
//                   )}

//                   {formData[field][eye].value === 'Other' && (
//                     <TextField
//                       fullWidth
//                       label="Other Details"
//                       value={formData[field][eye].other}
//                       onChange={e => handleChange(field, e.target.value, 'other', eye)}
//                       sx={{ mb: 2 }}
//                     />
//                   )}
//                 </Grid>
//               ))}
//             </Grid>
//           </Box>
//         ))}
//       </DialogContent>

//       <DialogActions>
//         <Button onClick={onClose}>Cancel</Button>
//         <Button onClick={handleSubmit} variant="contained" disabled={isSubmitting}>
//           {isSubmitting ? <CircularProgress size={20} /> : 'Save'}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default AddFundusExaminations;
