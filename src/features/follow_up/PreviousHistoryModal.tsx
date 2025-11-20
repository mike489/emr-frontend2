import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Paper
} from "@mui/material";
import {
  History,
  RecordVoiceOver,
  RemoveRedEye,
  Speed,
  AccessTime,
  MedicalServices,
  Assignment,
  Close,
  Visibility
} from "@mui/icons-material";
import type { ExaminationData } from "../../shared/api/types/examination.types";

interface PreviousHistoryModalProps {
  open: boolean;
  onClose: () => void;
  data: ExaminationData | null;
  // consultantId: string;
}

// Helper Components
interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: any;
  isCritical?: boolean;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value, isCritical }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
      {icon}
      <Typography variant="body2" color="text.secondary">
        {label}:
      </Typography>
    </Box>
    <Typography 
      variant="body2" 
      fontWeight="medium"
      color={isCritical ? 'error.main' : 'text.primary'}
      sx={{ flex: 1, textAlign: 'right' }}
    >
      {value || 'N/A'}
    </Typography>
  </Box>
);

interface SectionCardProps {
  icon: React.ReactNode;
  title: string;
  content?: string | null;
  simple?: boolean;
  children?: React.ReactNode;
}

const SectionCard: React.FC<SectionCardProps> = ({ icon, title, content, simple, children }) => (
  <Paper variant={simple ? "outlined" : "elevation"} elevation={simple ? 0 : 1} sx={{ p: 3, borderRadius: 2 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: content ? 2 : 0 }}>
      {icon}
      <Typography variant="h6" fontWeight="bold">
        {title}
      </Typography>
    </Box>
    {content ? (
      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
        {content || 'N/A'}
      </Typography>
    ) : (
      children
    )}
  </Paper>
);

const PreviousHistoryModal: React.FC<PreviousHistoryModalProps> = ({
  open,
  onClose,
  data,
  // consultantId,
}) => {
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{
      sx: { borderRadius: 2 }
    }}>
      <DialogTitle sx={{ 
        borderBottom: 1, 
        borderColor: 'divider',
        bgcolor: 'background.paper',
        py: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <History color="primary" />
          <Typography variant="h6" fontWeight="bold">
            Previous Examination History
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        {!data ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <Typography color="text.secondary">No examination data found.</Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {/* Primary Complaint */}
            <Grid size={12}>
              <SectionCard 
                icon={<RecordVoiceOver />}
                title="Primary Complaint"
                content={data.primary_complaint}
                simple
              />
            </Grid>

            {/* Visual Acuity */}
            <Grid size={12}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <RemoveRedEye />
                Visual Acuity
              </Typography>
              <Grid container spacing={3}>
                <Grid  size={{xs:12, md:6}}>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Box sx={{ 
                        width: 20, 
                        height: 20, 
                        borderRadius: '50%', 
                        bgcolor: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        color: 'white'
                      }}>
                        OD
                      </Box>
                      Right Eye
                    </Typography>
                    <InfoRow icon={<Visibility />} label="UCVA" value={data.distance_od_ucva} />
                    <InfoRow icon={<Visibility />} label="SCVA" value={data.distance_od_scva} />
                    <InfoRow icon={<Visibility />} label="BCVA" value={data.distance_od_bcva} />
                  </Paper>
                </Grid>

                <Grid  size={{xs:12, md:6}}>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Box sx={{ 
                        width: 20, 
                        height: 20, 
                        borderRadius: '50%', 
                        bgcolor: 'secondary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        color: 'white'
                      }}>
                        OS
                      </Box>
                      Left Eye
                    </Typography>
                    <InfoRow icon={<Visibility />} label="UCVA" value={data.distance_os_ucva} />
                    <InfoRow icon={<Visibility />} label="SCVA" value={data.distance_os_scva} />
                    <InfoRow icon={<Visibility />} label="BCVA" value={data.distance_os_bcva} />
                  </Paper>
                </Grid>
              </Grid>
            </Grid>

            {/* Intraocular Pressure */}
            <Grid size={12}>
              <SectionCard 
                icon={<Speed />}
                title="Intraocular Pressure"
                simple
              >
                <Grid container spacing={2}>
                  <Grid  size={{xs:12, md:4}}>
                    <InfoRow 
                      icon={<Speed sx={{ fontSize: 20 }} />} 
                      label="Method" 
                      value={data.methods?.value} 
                    />
                  </Grid>
                  <Grid  size={{xs:12, md:4}}>
                    <InfoRow 
                      icon={<Box sx={{ color: 'primary.main', fontWeight: 'bold' }}>OD</Box>} 
                      label="Right Eye" 
                      value={data.right_eye} 
                    />
                  </Grid>
                  <Grid  size={{xs:12, md:4}}>
                    <InfoRow 
                      icon={<Box sx={{ color: 'secondary.main', fontWeight: 'bold' }}>OS</Box>} 
                      label="Left Eye" 
                      value={data.left_eye} 
                    />
                  </Grid>
                  <Grid size={12}>
                    <InfoRow 
                      icon={<AccessTime />} 
                      label="Measured at" 
                      value={data.time_of_measurement} 
                    />
                  </Grid>
                </Grid>
              </SectionCard>
            </Grid>

            {/* Diagnosis & Plan */}
            <Grid  size={{xs:12, md:6}}>
              <SectionCard 
                icon={<MedicalServices />}
                title="Primary Diagnosis"
                content={data.primary_diagnosis}
                simple
              />
            </Grid>

            <Grid  size={{xs:12, md:6}}>
              <SectionCard 
                icon={<Assignment />}
                title="Plan"
                content={data.plan}
                simple
              />
            </Grid>
          </Grid>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
        <Button 
          onClick={onClose} 
          variant="contained"
          startIcon={<Close />}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PreviousHistoryModal;