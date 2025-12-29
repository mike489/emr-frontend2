import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import { LaboratoryService } from '../../shared/api/services/laboratory.service';

interface ResultPageProps {
  patientId: string;
  patientName?: string;
}

const ResultPage: React.FC<ResultPageProps> = ({ patientId, patientName }) => {
  const [labTests, setLabTests] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    const fetchLabTests = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await LaboratoryService.getLabRequest(patientId);
        setLabTests(response.data?.data || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch laboratory tests');
      } finally {
        setLoading(false);
      }
    };
    fetchLabTests();
  }, [patientId]);

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Lab Results {patientName ? `for ${patientName}` : ''}
      </Typography>

      {labTests.map(group => (
        <Box key={group.group_name} sx={{ mb: 4 }}>
          {/* Group Heading */}
          <Typography variant="h6" sx={{ backgroundColor: '#f5f5f5', p: 1, borderRadius: 1 }}>
            {group.group_name}
          </Typography>

          <TableContainer component={Paper} sx={{ mt: 1 }}>
            <Table aria-label="lab results table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Test Name</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Result</strong>
                  </TableCell>

                  <TableCell align="center">
                    <strong>Date</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Files</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Technician</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {group.tests.map((test: any) => (
                  <TableRow key={test.id} hover>
                    <TableCell>{test.test}</TableCell>

                    <TableCell align="center" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      {test.result || 'Pending'}
                    </TableCell>

                    <TableCell align="center">{test.created_at}</TableCell>

                    {/* FILES COLUMN */}
                    <TableCell align="center">
                      {test.files && test.files.length > 0 ? (
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          {test.files.map((file: any) =>
                            file.mime_type.startsWith('image/') ? (
                              <a
                                key={file.uuid}
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Box
                                  component="img"
                                  src={file.url}
                                  alt="Lab file"
                                  sx={{
                                    width: 40,
                                    height: 40,
                                    objectFit: 'cover',
                                    borderRadius: 1,
                                    border: '1px solid #ddd',
                                    cursor: 'pointer',
                                  }}
                                />
                              </a>
                            ) : (
                              <a
                                key={file.uuid}
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ textDecoration: 'none' }}
                              >
                                <Typography variant="body2" color="primary">
                                  View File
                                </Typography>
                              </a>
                            )
                          )}
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          —
                        </Typography>
                      )}
                    </TableCell>

                    <TableCell align="right">{test.technician}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ))}

      {labTests.length === 0 && (
        <Typography variant="body1">No laboratory results found.</Typography>
      )}
    </Box>
  );
};

export default ResultPage;
