import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  CircularProgress,
  Paper,
  Container,
  IconButton,
  Stack,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Grid,
  Tabs,
  Tab,
} from '@mui/material';
import { ExpandMore, Science, CheckCircle, Delete, Search, Clear, MedicalInformation } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { OperationalService } from '../../shared/api/services/operations.service';
import OperationNoteModal from './OperationNoteModal';
import ResultOperationPage from './ResultOperationPage';
import { Pagination } from '@mui/material';

interface Operation {
  id: string;
  name: string;
  price?: number | string;
  description?: string;
  type?: string;
  created_at?: string;
}

interface SelectedOperation {
  id: string;
  name: string;
  price?: number | string;
  note?: any;
}

interface LabPageProps {
  patientId: string;
  patientName: string;
}

const OperPage: React.FC<LabPageProps> = ({ patientId, patientName }) => {
  const navigate = useNavigate();
  const [operations, setOperations] = useState<Operation[]>([]);
  const [filteredOperations, setFilteredOperations] = useState<Operation[]>([]);
  const [selectedOperations, setSelectedOperations] = useState<SelectedOperation[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [selectedOpForNote, setSelectedOpForNote] = useState<SelectedOperation | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const rowsPerPage = 10;

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  // Fetch operations on component mount
  useEffect(() => {
    fetchOperations();
  }, []);

  const paginatedOperations = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredOperations.slice(start, end);
  }, [filteredOperations, page]);

  // Filter operations based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredOperations(operations);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = operations.filter(
        op =>
          op.name.toLowerCase().includes(query) ||
          (op.description && op.description.toLowerCase().includes(query)) ||
          (op.type && op.type.toLowerCase().includes(query))
      );
      setFilteredOperations(filtered);
    }
  }, [searchQuery, operations]);

  const fetchOperations = async (search?: string) => {
    try {
      setLoading(true);
      const response = await OperationalService.getOR(search);

      // Handle both response structures
      let data = [];

      if (response.data && typeof response.data === 'object') {
        if (response.data.success && Array.isArray(response.data.data)) {
          data = response.data.data;
        } else if (Array.isArray(response.data.data)) {
          data = response.data.data;
        } else if (Array.isArray(response.data)) {
          data = response.data;
        }
      }

      console.log('Fetched operations:', data);
      setOperations(data);
      setFilteredOperations(data);
    } catch (error) {
      console.error('Error fetching operations:', error);
      toast.error('Failed to load operations');
      setOperations([]);
      setFilteredOperations([]);
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  const handleSearch = () => {
    setSearchLoading(true);
    fetchOperations(searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchLoading(true);
    fetchOperations(); // Fetch without search query
  };

  const handleOperationToggle = (operation: Operation) => {
    setSelectedOperations(prev => {
      const existingIndex = prev.findIndex(op => op.id === operation.id);

      if (existingIndex >= 0) {
        return prev.filter((_, index) => index !== existingIndex);
      } else {
        return [
          ...prev,
          {
            id: operation.id,
            name: operation.name,
            price: operation.price,
          },
        ];
      }
    });
  };

  const handleOpenNoteModal = (operation: SelectedOperation) => {
    setSelectedOpForNote(operation);
    setNoteModalOpen(true);
  };

  const handleNoteSubmit = (noteData: any) => {
    if (selectedOpForNote) {
      setSelectedOperations(prev =>
        prev.map(op => (op.id === selectedOpForNote.id ? { ...op, note: noteData } : op))
      );
    }
  };

  const isOperationSelected = (operationId: string) => {
    return selectedOperations.some(op => op.id === operationId);
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      // Prepare the request body
      const requestBody = {
        service_ids: selectedOperations.map(op => op.id),
        department: 'OPD3',
        operations_data: selectedOperations.map(op => ({
          service_ids: op.id,
          operation_name: op.name,
          price: op.price || 0,
          operation_note: op.note,
        })),
      };

      console.log('Submitting operation request:', requestBody);

      // Submit the operation request
      await OperationalService.createOperationRequest(patientId, requestBody);

      setSelectedOperations([]);
      toast.success('Operation request submitted successfully!');

      // Navigate back or refresh as needed
      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } catch (error: any) {
      console.error('Error submitting operation request:', error);

      if (error.response?.data?.message) {
        toast.error(`Error: ${error.response.data.message}`);
      } else {
        toast.error('Error submitting operation request. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveOperation = (operationId: string) => {
    setSelectedOperations(prev => prev.filter(op => op.id !== operationId));
  };

  const handleClearAll = () => {
    setSelectedOperations([]);
  };

  // Calculate total price
  // const totalPrice = selectedOperations.reduce((total, op) => {
  //   const price = op.price ? Number(op.price) : 0;
  //   return total + (isNaN(price) ? 0 : price);
  // }, 0);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} aria-label="operation tasks">
          <Tab label="New Operation Request" />
          <Tab label="Operation Results" />
        </Tabs>
      </Box>

      {tabValue === 0 && (
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3 }}>
        {/* Left Column - Available Operations */}
        <Box sx={{ width: { xs: '100%', lg: '65%' } }}>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
              Available Operations
            </Typography>

            {/* Search Bar */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, sm: 9 }}>
                <TextField
                  fullWidth
                  placeholder="Search operations by name, description, or type..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyPress={e => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                    endAdornment: searchQuery && (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={handleClearSearch} edge="end">
                          <Clear />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 3 }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleSearch}
                  disabled={searchLoading}
                  startIcon={searchLoading ? <CircularProgress size={20} /> : <Search />}
                >
                  {searchLoading ? 'Searching...' : 'Search'}
                </Button>
              </Grid>
            </Grid>

            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" sx={{ py: 8 }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Loading operations...</Typography>
              </Box>
            ) : (
              <Box>
                {filteredOperations.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Science sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="body1" color="textSecondary">
                      {searchQuery
                        ? 'No operations match your search.'
                        : 'No operations available.'}
                    </Typography>
                    {searchQuery && (
                      <Button variant="text" onClick={handleClearSearch} sx={{ mt: 2 }}>
                        Clear search
                      </Button>
                    )}
                  </Box>
                ) : (
                  <Accordion defaultExpanded sx={{ mb: 2 }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Box sx={{ width: '100%' }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="subtitle1" fontWeight="bold">
                            All Operations
                          </Typography>
                          <Chip
                            label={`${filteredOperations.length} operations`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </Stack>
                        {searchQuery && (
                          <Typography variant="caption" color="textSecondary">
                            Showing results for "{searchQuery}"
                          </Typography>
                        )}
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <FormGroup>
                        {paginatedOperations.map(operation => (
                          <FormControlLabel
                            key={operation.id}
                            control={
                              <Checkbox
                                checked={isOperationSelected(operation.id)}
                                onChange={() => handleOperationToggle(operation)}
                                icon={<Science />}
                                checkedIcon={<Science color="primary" />}
                              />
                            }
                            label={
                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  width: '100%',
                                }}
                              >
                                <Box>
                                  <Typography variant="body1">{operation.name}</Typography>
                                  {operation.description && (
                                    <Typography variant="caption" color="textSecondary">
                                      {operation.description}
                                    </Typography>
                                  )}
                                </Box>
                                {/* {operation.price && (
                                  <Typography variant="body2" color="primary" fontWeight="bold">
                                    Birr
                                    {typeof operation.price === 'string'
                                      ? parseFloat(operation.price)
                                      : operation.price}
                                  </Typography>
                                )} */}
                              </Box>
                            }
                            sx={{
                              mb: 1,
                              px: 1,
                              py: 0.5,
                              '&:hover': {
                                backgroundColor: 'action.hover',
                                borderRadius: 1,
                              },
                              width: '100%',
                            }}
                          />
                        ))}
                      </FormGroup>
                    </AccordionDetails>
                    <Pagination
                      count={Math.ceil(filteredOperations.length / rowsPerPage)}
                      page={page}
                      onChange={(_, value) => setPage(value)}
                      color="primary"
                      sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
                    />
                  </Accordion>
                )}
              </Box>
            )}
          </Paper>
        </Box>

        {/* Right Column - Selected Operations Summary */}
        <Box sx={{ width: { xs: '100%', lg: '35%' } }}>
          <Paper elevation={2} sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 3 }}
            >
              <Typography variant="h6" fontWeight="bold">
                Selected Operations
              </Typography>
              {selectedOperations.length > 0 && (
                <Button size="small" color="error" startIcon={<Delete />} onClick={handleClearAll}>
                  Clear All
                </Button>
              )}
            </Stack>

            {selectedOperations.length > 0 ? (
              <>
                <Box sx={{ mb: 3 }}>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                      {selectedOperations.length} operation(s) selected
                    </Typography>
                    {/* {totalPrice > 0 && (
                      <Typography variant="h6" color="primary" fontWeight="bold">
                        Total: Birr{totalPrice.toFixed(2)}
                      </Typography>
                    )} */}
                  </Stack>

                  <Box sx={{ maxHeight: 400, overflowY: 'auto', pr: 1 }}>
                    {selectedOperations.map(operation => (
                      <Card
                        key={operation.id}
                        variant="outlined"
                        sx={{
                          mb: 2,
                          borderColor: 'primary.main',
                        }}
                      >
                        <CardContent sx={{ py: 2, px: 2 }}>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="flex-start"
                          >
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="subtitle2" fontWeight="bold">
                                {operation.name}
                              </Typography>
                              {/* {operation.price && (
                                <Typography variant="body2" color="primary" sx={{ mt: 0.5 }}>
                                  Birr
                                  {typeof operation.price === 'string'
                                    ? parseFloat(operation.price)
                                    : operation.price}
                                </Typography>
                              )} */}
                            </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <IconButton
                                  size="small"
                                  color={operation.note ? 'success' : 'secondary'}
                                  onClick={() => handleOpenNoteModal(operation)}
                                  sx={{ ml: 1 }}
                                >
                                  <MedicalInformation fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleRemoveOperation(operation.id)}
                                  sx={{ ml: 1 }}
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Box>
                          </Stack>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleSubmit}
                  disabled={submitting || selectedOperations.length === 0}
                  startIcon={submitting ? <CircularProgress size={20} /> : <CheckCircle />}
                  sx={{ py: 1.5 }}
                >
                  {submitting
                    ? 'Submitting...'
                    : `Submit ${selectedOperations.length} Operation(s)`}
                </Button>
              </>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Science sx={{ fontSize: 60, color: 'action.disabled', mb: 2 }} />
                <Typography variant="body1" color="textSecondary" gutterBottom>
                  No operations selected
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Select operations from the list
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>
      </Box>
    )}

    {tabValue === 1 && (
      <Paper elevation={2}>
        <ResultOperationPage patientId={patientId} patientName={patientName} />
      </Paper>
    )}

    {selectedOpForNote && (
        <OperationNoteModal
          open={noteModalOpen}
          onClose={() => setNoteModalOpen(false)}
          operationName={selectedOpForNote.name}
          patientName={patientName}
          onSubmit={handleNoteSubmit}
          initialData={selectedOpForNote.note}
        />
      )}
    </Container>
  );
};

export default OperPage;
