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
// import { toast, ToastContainer } from 'react-toastify';

// import PropTypes from 'prop-types';
// import AddFundusExaminations from './AddFundusExaminations';
// import EditFundusExaminations from './EditFundusExaminations';
// import {
//   FundusExaminationsService,
//   type FundusExamination,
// } from '../../../../shared/api/services/examination.service';
// import ErrorPrompt from '../../../shared/components/ErrorPrompt';
// import Fallbacks from '../../../shared/components/Fallbacks';
// import { DotMenu } from '../../../shared/ui-component/menu/DotMenu';

// interface AdnexaExaminationTabProps {
//   visitId: string;
// }

// const FundusExaminationsTab: React.FC<AdnexaExaminationTabProps> = ({ visitId }) => {
//   const theme = useTheme();
//   const [loading, setLoading] = useState(false);
//   const [fundusExaminations, setFundusExaminations] = useState<FundusExamination[]>([]);
//   const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
//   const [error, setError] = useState(false);
//   const [openAddModal, setOpenAddModal] = useState(false);
//   const [openEditModal, setOpenEditModal] = useState(false);
//   const [selectedExamination, setSelectedExamination] = useState<FundusExamination | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isUpdating, setIsUpdating] = useState(false);
//   const [pagination, setPagination] = useState({
//     page: 0,
//     per_page: 10,
//     last_page: 0,
//     total: 0,
//   });

//   const toggleExpand = (id: string) => {
//     setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
//   };

//   const handleChangePage = (_event: unknown, newPage: number) => {
//     setPagination(prev => ({ ...prev, page: newPage }));
//   };

//   const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setPagination(prev => ({
//       ...prev,
//       per_page: parseInt(event.target.value, 10),
//       page: 0,
//     }));
//   };

//   /* ------------------ FETCH FUNDUS EXAMINATIONS ------------------ */
//   const fetchFundusExaminations = async () => {
//     setLoading(true);
//     setError(false);
//     try {
//       const response = await FundusExaminationsService.list(
//         visitId,
//         pagination.page + 1,
//         pagination.per_page
//       );
//       const data = response.data;
//       setFundusExaminations(data.data);

//       const expandedInit = data.data.reduce(
//         (acc: any, item: any) => ({ ...acc, [item.id]: false }),
//         {}
//       );
//       setExpandedItems(expandedInit);

//       setPagination(prev => ({
//         ...prev,
//         total: data.pagination.total,
//         last_page: data.pagination.total,
//       }));
//     } catch (err: any) {
//       toast.error(err?.message || 'Failed to fetch fundus examinations');
//       setError(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ------------------ CREATE ------------------ */
//   const handleAddFundusExamination = async (values: Partial<FundusExamination>) => {
//     setIsSubmitting(true);
//     try {
//       await FundusExaminationsService.create({
//         ...values,
//         visit_id: visitId,
//       });
//       toast.success('Fundus examination added successfully');
//       setOpenAddModal(false);
//       fetchFundusExaminations();
//     } catch (err: any) {
//       toast.error(err?.message || 'Failed to add fundus examination');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   /* ------------------ UPDATE ------------------ */
//   const handleUpdateFundusExamination = async (values: Partial<FundusExamination>) => {
//     if (!selectedExamination) return;
//     setIsUpdating(true);
//     try {
//       await FundusExaminationsService.update(selectedExamination.id, values);
//       toast.success('Fundus examination updated successfully');
//       setOpenEditModal(false);
//       fetchFundusExaminations();
//     } catch (err: any) {
//       toast.error(err?.message || 'Failed to update fundus examination');
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   /* ------------------ DELETE ------------------ */
//   const handleDeleteFundusExamination = async (id: string) => {
//     try {
//       await FundusExaminationsService.delete(id);
//       toast.success('Fundus examination deleted successfully');
//       fetchFundusExaminations();
//     } catch (err: any) {
//       toast.error(err?.message || 'Failed to delete fundus examination');
//     }
//   };

//   useEffect(() => {
//     if (visitId) fetchFundusExaminations();
//   }, [pagination.page, pagination.per_page, visitId]);

//   /* ------------------ RENDER TABLE ------------------ */
//   const renderExaminationTable = (record: FundusExamination) => (
//     <Box sx={{ mb: 3 }}>
//       <Box sx={{ mb: 2 }}>
//         <Typography variant="subtitle2" gutterBottom>
//           Dilated: {record.dilated?.value || 'No'}
//         </Typography>
//         {record.dilated?.value === 'Yes' && (
//           <Typography variant="body2" color="text.secondary">
//             {record.dilated?.time && `Time: ${record.dilated.time}`}
//             {record.dilated?.drops && ` | Drops: ${record.dilated.drops}`}
//           </Typography>
//         )}
//       </Box>

//       <TableContainer component={Paper} sx={{ mb: 2 }}>
//         <Table size="small">
//           <TableHead>
//             <TableRow>
//               <TableCell>Feature</TableCell>
//               <TableCell align="right">OD (Right Eye)</TableCell>
//               <TableCell align="right">OS (Left Eye)</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {['optic_disc', 'macula', 'vessels', 'periphery'].map(feature => (
//               <TableRow key={feature}>
//                 <TableCell component="th" scope="row">
//                   {feature.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
//                 </TableCell>
//                 <TableCell align="right">
//                   {record[feature]?.od?.value === 'Other'
//                     ? record[feature]?.od?.other
//                     : record[feature]?.od?.value === 'Cupping'
//                       ? `${record[feature]?.od?.value} (${record[feature]?.od?.cupping})`
//                       : record[feature]?.od?.value || '-'}
//                 </TableCell>
//                 <TableCell align="right">
//                   {record[feature]?.os?.value === 'Other'
//                     ? record[feature]?.os?.other
//                     : record[feature]?.os?.value === 'Cupping'
//                       ? `${record[feature]?.os?.value} (${record[feature]?.os?.cupping})`
//                       : record[feature]?.os?.value || '-'}
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );

//   /* ------------------ UI ------------------ */
//   return (
//     <Box sx={{ p: 3 }}>
//       <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//         <Typography variant="h5" sx={{ fontWeight: 600 }}>
//           Fundus Examination Records
//         </Typography>
//         <IconButton
//           color="primary"
//           onClick={() => setOpenAddModal(true)}
//           sx={{
//             backgroundColor: theme.palette.primary.main,
//             color: 'white',
//             '&:hover': {
//               backgroundColor: theme.palette.primary.dark,
//               color: 'white',
//             },
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
//           message="Unable to retrieve fundus examination records."
//         />
//       ) : fundusExaminations.length === 0 ? (
//         <Fallbacks
//           title="No Fundus Examination Records Found"
//           description="Patient fundus examination records will be listed here when available."
//         />
//       ) : (
//         <Card variant="outlined" sx={{ borderRadius: 2 }}>
//           <CardContent sx={{ p: 0 }}>
//             <List disablePadding>
//               {fundusExaminations.map((record, index) => (
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
//                             {new Date(record.created_at || '').toLocaleDateString()}
//                           </Typography>
//                           <Typography variant="caption" color="text.secondary">
//                             Recorded by: {record.created_by || 'Unknown'}
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
//                           setSelectedExamination(record);
//                           setOpenEditModal(true);
//                         }}
//                         onDelete={() => handleDeleteFundusExamination(record.id)}
//                       />
//                     </Box>
//                   </ListItem>
//                   {index < fundusExaminations.length - 1 && (
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

//       <AddFundusExaminations
//         open={openAddModal}
//         isSubmitting={isSubmitting}
//         onClose={() => setOpenAddModal(false)}
//         onSubmit={handleAddFundusExamination}
//         visitId={visitId}
//       />

//       <EditFundusExaminations
//         open={openEditModal}
//         isSubmitting={isUpdating}
//         onClose={() => setOpenEditModal(false)}
//         onSubmit={handleUpdateFundusExamination}
//         examination={selectedExamination}
//       />

//       <ToastContainer />
//     </Box>
//   );
// };

// FundusExaminationsTab.propTypes = {
//   visit: PropTypes.object.isRequired,
// };

// export default FundusExaminationsTab;
