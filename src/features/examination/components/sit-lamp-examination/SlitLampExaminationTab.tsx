// import React, { useEffect, useState } from 'react';
// import {
//   Box,
//   Typography,
//   Card,
//   CardContent,
//   IconButton,
//   List,
//   ListItem,
//   Divider,
//   CircularProgress,
//   Collapse,
//   TablePagination,
//   useTheme,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Avatar,
// } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import DescriptionIcon from '@mui/icons-material/Description';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import ExpandLessIcon from '@mui/icons-material/ExpandLess';
// import { toast } from 'react-toastify';

// import AddSlitLampExamination from './AddSlitLampExamination';
// import EditSlitLampExamination from './EditSlitLampExamination';
// import {
//   type SlitLampExamination,
//   SlitLampService,
//   type SlitLampListResponse,
// } from '../../../../shared/api/services/examination.service';
// import ErrorPrompt from '../../../shared/components/ErrorPrompt';
// import Fallbacks from '../../../shared/components/Fallbacks';
// import { DotMenu } from '../../../shared/ui-component/menu/DotMenu';

// interface SlitLampExaminationTabProps {
//   visitId: string;
// }

// const SlitLampExaminationTab: React.FC<SlitLampExaminationTabProps> = ({ visitId }) => {
//   const theme = useTheme();
//   const [loading, setLoading] = useState(false);
//   const [slitLampExaminations, setSlitLampExaminations] = useState<SlitLampExamination[]>([]);
//   const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
//   const [error, setError] = useState(false);
//   const [openAdd, setOpenAdd] = useState(false);
//   const [openEdit, setOpenEdit] = useState(false);
//   const [selected, setSelected] = useState<SlitLampExamination | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isUpdating, setIsUpdating] = useState(false);
//   const [pagination, setPagination] = useState({
//     page: 0,
//     per_page: 10,
//     total: 0,
//   });

//   const toggleExpand = (id: string) => {
//     setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
//   };

//   const handleChangePage = (_: unknown, newPage: number) => {
//     setPagination(prev => ({ ...prev, page: newPage }));
//   };

//   const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setPagination({ ...pagination, per_page: parseInt(event.target.value, 10), page: 0 });
//   };

//   /* ----------------------- FETCH LIST ----------------------- */
//   const fetchSlitLampExaminations = async () => {
//     if (!visitId) return;
//     setLoading(true);
//     setError(false);

//     try {
//       const response = await SlitLampService.list(
//         visitId,
//         pagination.page + 1,
//         pagination.per_page
//       );
//       const data: SlitLampListResponse = response.data;

//       if (Array.isArray(data.data)) {
//         setSlitLampExaminations(data.data);
//         const initialExpanded = data.data.reduce<Record<string, boolean>>(
//           (acc: any, item: any) => ({ ...acc, [item.id]: false }),
//           {}
//         );
//         setExpandedItems(initialExpanded);
//         setPagination(prev => ({ ...prev, total: data.pagination.total }));
//       } else {
//         setSlitLampExaminations([]);
//       }
//     } catch (err: any) {
//       toast.error(err?.message || 'Failed to fetch slit lamp examinations');
//       setError(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ----------------------- ADD ----------------------- */
//   const handleAddSlitLampExamination = async (examinationData: any) => {
//     setIsSubmitting(true);
//     try {
//       await SlitLampService.create(examinationData);
//       toast.success('Slit lamp examination added successfully');
//       setOpenAdd(false);
//       fetchSlitLampExaminations();
//     } catch (err: any) {
//       toast.error(err?.message || 'Failed to add slit lamp examination');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   /* ----------------------- UPDATE ----------------------- */
//   const handleUpdateSlitLampExamination = async (updatedData: any) => {
//     if (!selected?.id) return;
//     setIsUpdating(true);
//     try {
//       await SlitLampService.update(selected.id, updatedData);
//       toast.success('Slit lamp examination updated successfully');
//       setOpenEdit(false);
//       fetchSlitLampExaminations();
//     } catch (err: any) {
//       toast.error(err?.message || 'Failed to update slit lamp examination');
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   /* ----------------------- DELETE ----------------------- */
//   const handleDeleteSlitLampExamination = async (id: string) => {
//     try {
//       await SlitLampService.delete(id);
//       toast.success('Slit lamp examination deleted successfully');
//       fetchSlitLampExaminations();
//     } catch (err: any) {
//       toast.error(err?.message || 'Failed to delete slit lamp examination');
//     }
//   };

//   useEffect(() => {
//     fetchSlitLampExaminations();
//   }, [pagination.page, pagination.per_page]);

//   /* ----------------------- TABLE ----------------------- */
//   const renderExaminationTable = (exam: SlitLampExamination) => (
//     <Box sx={{ mb: 3 }}>
//       <TableContainer component={Paper}>
//         <Table size="small">
//           <TableHead>
//             <TableRow>
//               <TableCell>Feature</TableCell>
//               <TableCell align="right">OD (Right Eye)</TableCell>
//               <TableCell align="right">OS (Left Eye)</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {['cornea', 'anterior_chamber', 'iris', 'lens', 'vitreous'].map(field => (
//               <TableRow key={field}>
//                 <TableCell>{field.replace('_', ' ').toUpperCase()}</TableCell>
//                 <TableCell align="right">
//                   {exam[field as keyof SlitLampExamination]?.od?.value === 'Other'
//                     ? exam[field as keyof SlitLampExamination]?.od?.other
//                     : exam[field as keyof SlitLampExamination]?.od?.value || '-'}
//                 </TableCell>
//                 <TableCell align="right">
//                   {exam[field as keyof SlitLampExamination]?.os?.value === 'Other'
//                     ? exam[field as keyof SlitLampExamination]?.os?.other
//                     : exam[field as keyof SlitLampExamination]?.os?.value || '-'}
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );

//   /* ----------------------- RENDER ----------------------- */
//   return (
//     <Box sx={{ p: 3 }}>
//       <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//         <Typography variant="h5" fontWeight={600}>
//           Slit Lamp Examination Records
//         </Typography>
//         <IconButton
//           color="primary"
//           onClick={() => setOpenAdd(true)}
//           sx={{
//             backgroundColor: theme.palette.primary.main,
//             color: 'white',
//             '&:hover': { backgroundColor: theme.palette.primary.dark },
//           }}
//         >
//           <AddIcon />
//         </IconButton>
//       </Box>

//       {loading ? (
//         <Box display="flex" justifyContent="center" py={4}>
//           <CircularProgress size={20} />
//         </Box>
//       ) : error ? (
//         <ErrorPrompt
//           title="Server Error"
//           message="Unable to retrieve slit lamp examination records."
//         />
//       ) : slitLampExaminations.length === 0 ? (
//         <Fallbacks
//           title="No Slit Lamp Examination Records Found"
//           description="Patient slit lamp examination records will be listed here when available."
//         />
//       ) : (
//         <Card variant="outlined" sx={{ borderRadius: 2 }}>
//           <CardContent sx={{ p: 0 }}>
//             <List disablePadding>
//               {slitLampExaminations.map((record, index) => (
//                 <React.Fragment key={record.id}>
//                   <ListItem
//                     sx={{
//                       p: 0,
//                       '&:hover': { backgroundColor: theme.palette.action.hover },
//                     }}
//                   >
//                     <Box width="100%">
//                       <Box
//                         display="flex"
//                         alignItems="center"
//                         p={2}
//                         onClick={() => toggleExpand(record.id)}
//                         sx={{
//                           cursor: 'pointer',
//                           borderBottom: `1px solid ${theme.palette.divider}`,
//                         }}
//                       >
//                         <Avatar
//                           sx={{
//                             mr: 2,
//                             backgroundColor: theme.palette.primary.light,
//                             color: theme.palette.primary.dark,
//                           }}
//                         >
//                           <DescriptionIcon />
//                         </Avatar>
//                         <Box flexGrow={1}>
//                           <Typography variant="subtitle1">
//                             {record.created_at
//                               ? new Date(record.created_at).toLocaleDateString()
//                               : '—'}
//                           </Typography>
//                           <Typography variant="caption" color="text.secondary">
//                             Recorded by: {record.created_by || '—'}
//                           </Typography>
//                         </Box>
//                         <IconButton size="small">
//                           {expandedItems[record.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
//                         </IconButton>
//                       </Box>
//                       <Collapse in={expandedItems[record.id]} unmountOnExit>
//                         <Box p={3}>{renderExaminationTable(record)}</Box>
//                       </Collapse>
//                     </Box>
//                     <Box sx={{ ml: 'auto', alignSelf: 'flex-start' }}>
//                       <DotMenu
//                         onEdit={() => {
//                           setSelected(record);
//                           setOpenEdit(true);
//                         }}
//                         onDelete={() => handleDeleteSlitLampExamination(record.id)}
//                       />
//                     </Box>
//                   </ListItem>
//                   {index < slitLampExaminations.length - 1 && (
//                     <Divider component="li" sx={{ mx: 3 }} />
//                   )}
//                 </React.Fragment>
//               ))}
//             </List>
//           </CardContent>
//           <TablePagination
//             component="div"
//             count={pagination.total}
//             page={pagination.page}
//             onPageChange={handleChangePage}
//             rowsPerPage={pagination.per_page}
//             onRowsPerPageChange={handleChangeRowsPerPage}
//           />
//         </Card>
//       )}

//       {/* ADD / EDIT MODALS */}
//       <AddSlitLampExamination
//         open={openAdd}
//         isSubmitting={isSubmitting}
//         onClose={() => setOpenAdd(false)}
//         onSubmit={handleAddSlitLampExamination}
//         visit={visitId}
//       />
//       <EditSlitLampExamination
//         open={openEdit}
//         isSubmitting={isUpdating}
//         onClose={() => setOpenEdit(false)}
//         onSubmit={handleUpdateSlitLampExamination}
//         initialData={selected}
//       />
//     </Box>
//   );
// };

// export default SlitLampExaminationTab;
