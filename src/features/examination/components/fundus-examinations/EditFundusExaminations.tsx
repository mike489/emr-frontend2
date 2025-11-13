// import React, { useEffect, useState } from 'react';
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
// import { toast } from 'react-toastify';

// interface EditFundusExaminationsProps {
//   open: boolean;
//   onClose: () => void;
//   onSubmit: (data: Partial<any>) => void;
//   isSubmitting: boolean;
//   examination: any | null;
// }

// const EditFundusExaminations: React.FC<EditFundusExaminationsProps> = ({
//   open,
//   onClose,
//   onSubmit,
//   isSubmitting,
//   examination,
// }) => {
//   const theme = useTheme();
//   const [formData, setFormData] = useState<any | null>(null);

//   useEffect(() => {
//     if (examination) setFormData(examination);
//   }, [examination]);

//   const handleChange = (
//     section: keyof any,
//     value: string,
//     subField?: string,
//     eye?: 'od' | 'os'
//   ) => {
//     if (!formData) return;
//     setFormData((prev: any) => {
//       if (!prev) return null;
//       const updated = { ...prev };
//       if (subField && eye) {
//         (updated[section] as any)[eye][subField] = value;
//       } else if (subField) {
//         (updated[section] as any)[subField] = value;
//       } else {
//         (updated as any)[section] = value;
//       }
//       return updated;
//     });
//   };

//   const handleSubmit = () => {
//     if (!formData) return;
//     if (formData.dilated.value === 'Yes') {
//       if (!formData.dilated.time || !formData.dilated.drops) {
//         toast.error('Please fill dilation details');
//         return;
//       }
//     }
//     onSubmit(formData);
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

//   if (!formData) return null;

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle>Edit Fundus Examination</DialogTitle>
//       <DialogContent dividers>
//         <Box sx={{ mb: 3 }}>
//           <Typography variant="h6">Dilation Information</Typography>
//           <Grid container spacing={2}>
//             <Grid item xs={12} sm={4}>
//               <FormControl fullWidth>
//                 <InputLabel>Dilated</InputLabel>
//                 <Select
//                   value={formData.dilated.value}
//                   onChange={e => handleChange('dilated', e.target.value, 'value')}
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
//                     label="Dilation Time"
//                     value={formData.dilated.time || ''}
//                     onChange={e => handleChange('dilated', e.target.value, 'time')}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                   <TextField
//                     fullWidth
//                     label="Drops Used"
//                     value={formData.dilated.drops || ''}
//                     onChange={e => handleChange('dilated', e.target.value, 'drops')}
//                   />
//                 </Grid>
//               </>
//             )}
//           </Grid>
//         </Box>

//         <Divider sx={{ my: 3 }} />

//         {(
//           [
//             { title: 'Optic Disc', field: 'optic_disc', options: opticDiscOptions },
//             { title: 'Macula', field: 'macula', options: maculaOptions },
//             { title: 'Vessels', field: 'vessels', options: vesselsOptions },
//             { title: 'Periphery', field: 'periphery', options: peripheryOptions },
//           ] as const
//         ).map(({ title, field, options }) => (
//           <Box key={field} sx={{ mb: 3 }}>
//             <Typography variant="h6">{title}</Typography>
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
//                     >
//                       {options.map(option => (
//                         <MenuItem key={option} value={option}>
//                           {option}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>

//                   {field === 'optic_disc' && formData[field][eye].value === 'Cupping' && (
//                     <TextField
//                       fullWidth
//                       label="Cupping Details"
//                       value={formData[field][eye].cupping || ''}
//                       onChange={e => handleChange(field, e.target.value, 'cupping', eye)}
//                       sx={{ mb: 2 }}
//                     />
//                   )}

//                   {formData[field][eye].value === 'Other' && (
//                     <TextField
//                       fullWidth
//                       label="Other Details"
//                       value={formData[field][eye].other || ''}
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
//           {isSubmitting ? <CircularProgress size={20} /> : 'Update'}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default EditFundusExaminations;
