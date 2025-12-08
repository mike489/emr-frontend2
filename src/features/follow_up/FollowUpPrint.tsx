import { Box, Typography, Paper, Button, Grid } from '@mui/material';
import { PatientService } from '../../shared/api/services/patient.service';
import { useEffect, useState } from 'react';

interface FollowUpData {
  id: string;
  patient_id: string;
  od_s_correction: string;
  od_c_correction: string;
  od_iop: string;
  od_cct: string;
  os_s_correction: string;
  os_c_correction: string;
  os_iop: string;
  os_cct: string;
  examination_findings: string;
  plan: string;
  remark: string;
  diagnosis: string;
  created_at: string;
  updated_at: string;
}

const FollowUpPrint = ({ consultationId }: { consultationId: string; patientId: string }) => {
  const [followUpData, setFollowUpData] = useState<FollowUpData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowUpData = async () => {
      try {
        const response = await PatientService.getFollowUpNotesData(consultationId);
        if (
          response.data.success &&
          response.data.data.data &&
          response.data.data.data.length > 0
        ) {
          setFollowUpData(response.data.data.data[0]);
        }
      } catch (error) {
        console.error('Error fetching follow-up data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowUpData();
  }, [consultationId]);

  const handlePrint = () => {
    const printContent = document.getElementById('print-followup');
    // const originalContent = document.body.innerHTML;

    if (printContent) {
      // Get the print content HTML
      const printHTML = printContent.innerHTML;

      // Open print window
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Follow-up Examination Report</title>
              <style>
                body {
                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                  margin: 20px;
                  color: #333;
                  font-size: 14px;
                }
                .print-header {
                  text-align: center;
                  margin-bottom: 20px;
                  border-bottom: 2px solid #1976d2;
                  padding-bottom: 10px;
                }
                .print-header h2 {
                  color: #1976d2;
                  margin: 0 0 5px 0;
                }
                .section-title {
                  color: #1976d2;
                  font-weight: 600;
                  margin: 15px 0 8px 0;
                  font-size: 15px;
                  border-bottom: 1px solid #e0e0e0;
                  padding-bottom: 3px;
                }
                .eye-section {
                  margin-bottom: 15px;
                }
                .data-grid {
                  display: grid;
                  grid-template-columns: repeat(4, 1fr);
                  gap: 10px;
                  margin: 8px 0;
                }
                .data-item {
                  font-size: 13px;
                }
                .data-label {
                  font-weight: 600;
                  color: #555;
                }
                .text-content {
                  background: #f9f9f9;
                  border: 1px solid #ddd;
                  border-radius: 4px;
                  padding: 8px;
                  margin: 5px 0 15px 0;
                  font-size: 13px;
                  line-height: 1.4;
                  min-height: 40px;
                }
                .footer {
                  margin-top: 30px;
                  padding-top: 10px;
                  border-top: 1px dashed #ccc;
                  font-size: 12px;
                  color: #666;
                  text-align: center;
                }
                @media print {
                  body {
                    margin: 15mm;
                  }
                }
              </style>
            </head>
            <body>
              <div class="print-header">
                <h2>Follow-up Examination Report</h2>
                <div>Consultation ID: ${consultationId}</div>
              </div>
              ${printHTML}
              <div class="footer">
                Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </body>
          </html>
        `);

        printWindow.document.close();
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 250);
      }
    }
  };

  if (loading) {
    return <Typography fontSize="0.875rem">Loading...</Typography>;
  }

  if (!followUpData) {
    return <Typography fontSize="0.875rem">No follow-up data found.</Typography>;
  }

  const parseHTML = (html: string) => {
    return { __html: html };
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Visible UI - Not for printing */}
      <Paper sx={{ p: 2, mb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight="bold" fontSize="1rem">
            Follow-up Examination
          </Typography>
          <Button
            variant="contained"
            onClick={handlePrint}
            sx={{
              textTransform: 'none',
              fontSize: '0.75rem',
              py: 0.5,
              px: 1.5,
            }}
          >
            Print Report
          </Button>
        </Box>

        {/* Hidden print content - Only visible in print window */}
        <div id="print-followup" style={{ display: 'none' }}>
          {/* OD Examination */}
          <div className="eye-section">
            <div className="section-title">OD (Right Eye) Examination</div>
            <div className="data-grid">
              <div className="data-item">
                <span className="data-label">S-Correction:</span>{' '}
                {followUpData.od_s_correction || '-'}
              </div>
              <div className="data-item">
                <span className="data-label">C-Correction:</span>{' '}
                {followUpData.od_c_correction || '-'}
              </div>
              <div className="data-item">
                <span className="data-label">IOP:</span> {followUpData.od_iop || '-'}
              </div>
              <div className="data-item">
                <span className="data-label">CCT:</span> {followUpData.od_cct || '-'}
              </div>
            </div>
          </div>

          {/* OS Examination */}
          <div className="eye-section">
            <div className="section-title">OS (Left Eye) Examination</div>
            <div className="data-grid">
              <div className="data-item">
                <span className="data-label">S-Correction:</span>{' '}
                {followUpData.os_s_correction || '-'}
              </div>
              <div className="data-item">
                <span className="data-label">C-Correction:</span>{' '}
                {followUpData.os_c_correction || '-'}
              </div>
              <div className="data-item">
                <span className="data-label">IOP:</span> {followUpData.os_iop || '-'}
              </div>
              <div className="data-item">
                <span className="data-label">CCT:</span> {followUpData.os_cct || '-'}
              </div>
            </div>
          </div>

          {/* Examination Findings */}
          <div>
            <div className="section-title">Examination Findings</div>
            <div className="text-content">
              <div
                dangerouslySetInnerHTML={parseHTML(followUpData.examination_findings || 'None')}
              />
            </div>
          </div>

          {/* Diagnosis */}
          <div>
            <div className="section-title">Diagnosis</div>
            <div className="text-content">
              <div dangerouslySetInnerHTML={parseHTML(followUpData.diagnosis || 'None')} />
            </div>
          </div>

          {/* Plan */}
          <div>
            <div className="section-title">Treatment Plan</div>
            <div className="text-content">
              <div dangerouslySetInnerHTML={parseHTML(followUpData.plan || 'None')} />
            </div>
          </div>

          {/* Remarks */}
          <div>
            <div className="section-title">Remarks</div>
            <div className="text-content">
              <div dangerouslySetInnerHTML={parseHTML(followUpData.remark || 'None')} />
            </div>
          </div>
        </div>

        {/* Preview content (visible on screen) */}
        <Box sx={{ mt: 2 }}>
          {/* OD Examination Preview */}
          <Box sx={{ mb: 2 }}>
            <Typography fontSize="0.875rem" fontWeight="600" sx={{ mb: 1, color: 'primary.main' }}>
              OD (Right Eye)
            </Typography>
            <Grid container spacing={1}>
              <Grid size={{ xs: 6, md: 3 }}>
                <Typography fontSize="0.75rem">
                  <strong>S:</strong> {followUpData.od_s_correction || '-'}
                </Typography>
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <Typography fontSize="0.75rem">
                  <strong>C:</strong> {followUpData.od_c_correction || '-'}
                </Typography>
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <Typography fontSize="0.75rem">
                  <strong>IOP:</strong> {followUpData.od_iop || '-'}
                </Typography>
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <Typography fontSize="0.75rem">
                  <strong>CCT:</strong> {followUpData.od_cct || '-'}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* OS Examination Preview */}
          <Box sx={{ mb: 2 }}>
            <Typography fontSize="0.875rem" fontWeight="600" sx={{ mb: 1, color: 'primary.main' }}>
              OS (Left Eye)
            </Typography>
            <Grid container spacing={1}>
              <Grid size={{ xs: 6, md: 3 }}>
                <Typography fontSize="0.75rem">
                  <strong>S:</strong> {followUpData.os_s_correction || '-'}
                </Typography>
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <Typography fontSize="0.75rem">
                  <strong>C:</strong> {followUpData.os_c_correction || '-'}
                </Typography>
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <Typography fontSize="0.75rem">
                  <strong>IOP:</strong> {followUpData.os_iop || '-'}
                </Typography>
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <Typography fontSize="0.75rem">
                  <strong>CCT:</strong> {followUpData.os_cct || '-'}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Preview for other sections */}
          <Box sx={{ mb: 2 }}>
            <Typography fontSize="0.875rem" fontWeight="600" sx={{ mb: 0.5 }}>
              Examination Findings
            </Typography>
            <Box
              sx={{
                p: 1,
                bgcolor: 'grey.50',
                borderRadius: 0.5,
                border: '1px solid',
                borderColor: 'grey.200',
                fontSize: '0.75rem',
                lineHeight: 1.3,
              }}
            >
              <div
                dangerouslySetInnerHTML={parseHTML(followUpData.examination_findings || 'None')}
              />
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default FollowUpPrint;
