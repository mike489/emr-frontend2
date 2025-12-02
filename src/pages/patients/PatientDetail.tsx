// Updated PatientDetails.tsx
import {
  Box,
  Typography,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Tooltip,
  IconButton,
  Paper,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { PatientService } from '../../shared/api/services/patient.service';
import Patients from './Patients';
import { Eye, FileText, ClipboardList, Stethoscope } from 'lucide-react';
import ExaminationModal from '../../features/examination/ExaminationModal';
import type { ExaminationData } from '../../shared/api/types/examination.types';
import ExaminationDataModal from '../../features/examination/ExaminationDataModal';
import CreateFollowUpModal from '../../features/follow_up/FollowUpFormModal';
import type { Patient } from '../../shared/api/types/patient.types';

interface Visit {
  id: string;
  patient_id: string;
  consultation_id: string;
  datetime: string;
  patient_name: string;
  full_name: string;
  encounter_name: string;
  visit_type: string;
  visit_date: string;
  visit_status: string;
  flags: VisitFlags;
  address?: {
    kifle_ketema?: string;
    wereda?: string;
    city?: string;
  };
  patient?: {
    name: string;
    email: string;
    phone: string;
    allergies: string | string[] | null;
    // flags?: {
    //   is_locked: boolean;
    //   is_today: boolean;
    //   is_this_week: boolean;
    //   is_expired: boolean;
    //   locked_since: string | null;
    // };
  };
  created_at_formatted?: string;
}

interface VisitFlags {
  is_locked: boolean;
  is_today: boolean;
  is_this_week: boolean;
  age_in_days: number;
  is_expired: boolean;
  locked_since?: string | null;
}

const PatientDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const patient = location.state?.patient as Patient;
  const { consultation_id } = (location.state as { consultation_id?: string }) || {};

  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [examinationModalOpen, setExaminationModalOpen] = useState(false);
  const [examinationDataModalOpen, setExaminationDataModalOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [examinationData, setExaminationData] = useState<ExaminationData | null>(null);
  const [followUpModalOpen, setFollowUpModalOpen] = useState(false);

  useEffect(() => {
    const fetchPatientVisits = async () => {
      if (patient?.id) {
        try {
          setLoading(true);
          const response = await PatientService.getPatientVisits(patient.id);
          if (response.data.success) {
            setVisits(response.data.data.data);
          }
        } catch (error) {
          console.error('Error fetching patient visits:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPatientVisits();
  }, [patient?.id]);

  const handleOpenFollowUp = (visit: Visit) => {
    setSelectedVisit(visit);
    setFollowUpModalOpen(true);
  };

  const handleCloseFollowUp = () => {
    setFollowUpModalOpen(false);
    setSelectedVisit(null);
  };

  const handleFollowUpSuccess = () => {
    console.log('Follow-up created successfully!');
  };

  const handleOpenExamination = (visit: Visit) => {
    setSelectedVisit(visit);
    setExaminationModalOpen(true);
  };

  const handleOpenExaminationData = async (visit: Visit) => {
    setSelectedVisit(visit);
    try {
      const response = await PatientService.getExaminationData(consultation_id ?? '');
      if (response.data.success) {
        setExaminationData(response.data.data.examination_data);
        setExaminationDataModalOpen(true);
      } else {
        console.log('No examination data found for this visit');
      }
    } catch (error) {
      console.error('Error fetching examination data:', error);
    }
  };

  const handleCloseExamination = () => {
    setExaminationModalOpen(false);
    setSelectedVisit(null);
  };

  const handleCloseExaminationData = () => {
    setExaminationDataModalOpen(false);
    setSelectedVisit(null);
    setExaminationData(null);
  };

  return (
    <Box display="flex" flexDirection="column" width="100%" sx={{ px: 2, pb: 4, mt: -16 }}>
      <Box sx={{ mb: 3 }}>
        <Patients patient={patient} />
      </Box>

      {/* Visits Section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
          Patient Visits History
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : visits.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">No visits found for this patient.</Typography>
          </Box>
        ) : (
          <VisitsTable
            visits={visits}
            onOpenExamination={handleOpenExamination}
            onOpenExaminationData={handleOpenExaminationData}
            onOpenFollowUp={handleOpenFollowUp}
            navigate={navigate}
            consultationId={consultation_id ?? ''}
            patient={patient}
            flags={
              visits[0]?.flags ?? {
                is_locked: false,
                is_today: false,
                is_this_week: false,
                age_in_days: 0,
                is_expired: false,
                locked_since: null,
              }
            }
          />
        )}
      </Box>

      {/* Examination Modal */}
      <ExaminationModal
        open={examinationModalOpen}
        onClose={handleCloseExamination}
        consultationId={consultation_id ?? ''}
        visitData={
          selectedVisit
            ? {
                visitDate: selectedVisit.visit_date,
                visitType: selectedVisit.visit_type,
                patientName: selectedVisit.full_name,
              }
            : undefined
        }
      />

      {/* Examination Data Modal */}
      <ExaminationDataModal
        open={examinationDataModalOpen}
        onClose={handleCloseExaminationData}
        examinationData={examinationData}
        visitData={
          selectedVisit
            ? {
                visitDate: selectedVisit.visit_date,
                visitType: selectedVisit.visit_type,
                patientName: selectedVisit.full_name,
              }
            : undefined
        }
      />

      {/* Follow-up Modal */}
      <CreateFollowUpModal
        open={followUpModalOpen}
        onClose={handleCloseFollowUp}
        patientId={patient?.id || ''}
        visitId={selectedVisit?.id}
        patientName={patient?.full_name}
        onSuccess={handleFollowUpSuccess}
      />
    </Box>
  );
};

// Updated VisitsTable component with patient prop
interface VisitsTableProps {
  visits: Visit[];
  onOpenExamination: (visit: Visit) => void;
  onOpenExaminationData: (visit: Visit) => void;
  onOpenFollowUp: (visit: Visit) => void;
  navigate: (path: string, state?: any) => void;
  consultationId: string;
  patient: Patient;
  flags: VisitFlags;
}

const VisitsTable: React.FC<VisitsTableProps> = ({
  visits,
  onOpenExamination,
  onOpenExaminationData,
  onOpenFollowUp,
  navigate,
  consultationId,
  patient,
  flags,
}) => {
  const handleNavigateWithState = (path: string) => {
    navigate(path, {
      state: {
        patient: patient,
        consultation_id: consultationId,
      },
    });
  };

  const handleRowClick = (visit: Visit) => {
    // Check if visit_type is "New" AND can_be_send_to_triage is true
    if (visit.visit_type === 'New' && flags?.is_locked === false) {
      handleNavigateWithState('/triage/examinations');
    }
    // if (visit.visit_type === 'New' && flags?.is_locked === true) {
    //   handleNavigateWithState('/triage/examinations-data');
    // }
    if (visit.visit_type === 'Follow Up' && flags?.is_locked === false) {
      handleNavigateWithState('/triage/follow-up');
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow
            sx={{
              background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
              '& th': {
                borderBottom: '2px solid #e0e0e0',
              },
            }}
          >
            <TableCell sx={{ fontWeight: 'bold', color: 'white', py: 1.5 }}>Visit Date</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: 'white', py: 1.5 }}>Patient Name</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: 'white', py: 1.5 }}>EMR Number</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: 'white', py: 1.5 }}>Visit Type</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: 'white', py: 1.5 }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: 'white', py: 1.5 }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {visits.map(visit => (
            <TableRow
              key={visit.id}
              hover
              onClick={() => handleRowClick(visit)}
              sx={{
                cursor:
                  visit.visit_type === 'New' && flags?.is_locked === false ? 'pointer' : 'default',
                '&:hover': {
                  backgroundColor:
                    visit.visit_type === 'New' && flags?.is_locked === false
                      ? 'action.hover'
                      : 'inherit',
                },
              }}
            >
              <TableCell>
                <Typography variant="body2" fontWeight={500}>
                  {new Date(visit.datetime).toLocaleDateString()}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight={500}>
                  {visit.patient_name}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight={500}>
                  {visit.encounter_name || 'N/A'}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={visit.visit_type}
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: visit.visit_type === 'New' ? '#4caf50' : '#ff9800',
                    color: visit.visit_type === 'New' ? '#4caf50' : '#ff9800',
                  }}
                />
              </TableCell>
              <TableCell>
                <Chip
                  label={visit.visit_status}
                  size="small"
                  color={
                    visit.visit_status === 'Active'
                      ? 'success'
                      : visit.visit_status === 'Pending'
                        ? 'warning'
                        : 'default'
                  }
                />
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {visit.flags?.is_locked || (
                    <Tooltip title="Create modal Examination">
                      <IconButton
                        size="small"
                        onClick={() => onOpenExamination(visit)}
                        sx={{
                          bgcolor: 'primary.main',
                          color: '#fff',
                          '&:hover': { backgroundColor: 'primary.dark' },
                        }}
                      >
                        <FileText size={18} />
                      </IconButton>
                    </Tooltip>
                  )}

                  <Tooltip title="Create Examination">
                    <IconButton
                      size="small"
                      // onClick={() =>
                      //   navigate('/front-desk/examinations', {
                      //     state: { consultation_id: patient.constultation_id },
                      //   })
                      // }
                      onClick={() => handleNavigateWithState('/triage/examinations')}
                      sx={{
                        bgcolor: 'primary.main',
                        color: '#fff',
                        '&:hover': { backgroundColor: 'primary.dark' },
                      }}
                    >
                      <FileText size={18} />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Follow-up ">
                    <IconButton
                      size="small"
                      // onClick={() =>
                      //   navigate('/front-desk/follow-up', {
                      //     state: { patient: patient },
                      //   })
                      // }
                      onClick={() => handleNavigateWithState('/triage/follow-up')}
                      sx={{
                        bgcolor: 'primary.main',
                        color: '#fff',
                        '&:hover': { backgroundColor: 'primary.dark' },
                      }}
                    >
                      <Stethoscope size={18} />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Create Follow-up">
                    <IconButton
                      size="small"
                      onClick={() => onOpenFollowUp(visit)}
                      sx={{
                        bgcolor: 'info.main',
                        color: '#fff',
                        '&:hover': { backgroundColor: 'info.dark' },
                      }}
                    >
                      <Stethoscope size={18} />
                    </IconButton>
                  </Tooltip>

                  {/* {visit.flags?.is_locked && ( */}
                  <Tooltip title="View Examination">
                    <IconButton
                      size="small"
                      onClick={() => onOpenExaminationData(visit)}
                      sx={{
                        bgcolor: 'secondary.main',
                        color: '#fff',
                        '&:hover': { backgroundColor: 'secondary.dark' },
                      }}
                    >
                      <ClipboardList size={18} />
                    </IconButton>
                  </Tooltip>
                  {/* )} */}
                  <Tooltip title="Visit Details">
                    <IconButton
                      size="small"
                      sx={{
                        bgcolor: '#4caf50',
                        color: '#fff',
                        '&:hover': { backgroundColor: '#388e3c' },
                      }}
                    >
                      <Eye size={18} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PatientDetails;
