import { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  Button,
  Container,
  Stack,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import MedicalCertificateForm from '../../features/medical_certificates/MedicalCertificateForm';
import MedicalCertificatesTable from '../../features/medical_certificates/MedicalCertificatesTable';
import MedicalCertificateView from '../../features/medical_certificates/MedicalCertificateView';
import { MedicalCertificateService } from '../../shared/api/services/sickLeave.service';

import Fallbacks from '../../features/shared/components/Fallbacks';
import type { Patient } from '../../shared/api/types/patient.types';


interface MedicalCertificate {
  id: string;
  patient_id: string;
  patient?: Patient;
  diagnosis: string;
  injury_description: string;
  recommendations: string;
  remarks: string;
  doctor:{
    name:string;

  }
  date_of_examination: string;
  rest_days: number;
  status: 'issued' | 'draft';
  certificate_number?: string;
  created_at?: string;
}

interface FormData {
  diagnosis: string;
  injury_description: string;
  recommendations: string;
  date_of_examination: string;
  rest_days: number;
  remarks: string;
  status: 'issued' | 'draft';
}

interface MedicalCertificatesIndexProps {
  patient: Patient;
}

export default function MedicalCertificatesIndex({ patient }: MedicalCertificatesIndexProps) {
  const [certificates, setCertificates] = useState<MedicalCertificate[]>([]);
  const [loading, setLoading] = useState(false);

  const [openForm, setOpenForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<MedicalCertificate | null>(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);

  // Delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [certificateToDelete, setCertificateToDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    diagnosis: '',
    injury_description: '',
    recommendations: '',
    date_of_examination: new Date().toISOString().split('T')[0],
    rest_days: 7,
    remarks: '',
    status: 'draft',
  });

  // Fetch only this patient's certificates
   const fetchCertificates = async () => {
    setLoading(true);
    try {
      const response = await MedicalCertificateService.getMedicalCertificateMy(patient.id);
      if (response.data.success) {
        setCertificates(response.data.data?.data || []);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.data.message || 'Error loading certificates');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (patient.id) fetchCertificates();
  }, [patient.id]);

  const handleOpenForm = (cert: MedicalCertificate | null = null) => {
    if (cert) {
      setEditMode(true);
      setSelectedCertificate(cert);
      setFormData({
        diagnosis: cert.diagnosis || '',
        injury_description: cert.injury_description || '',
        recommendations: cert.recommendations || '',
        date_of_examination: cert.date_of_examination?.split('T')[0] || '',
        rest_days: cert.rest_days || 0,
        remarks: cert.remarks || '',
        status: cert.status || 'draft',
      });
    } else {
      setEditMode(false);
      setSelectedCertificate(null);
      setFormData({
        diagnosis: '',
        injury_description: '',
        recommendations: '',
        date_of_examination: new Date().toISOString().split('T')[0],
        rest_days: 7,
        remarks: '',
        status: 'draft',
      });
    }
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditMode(false);
    setSelectedCertificate(null);
  };

  const handleOpenView = (cert: MedicalCertificate) => {
    setSelectedCertificate(cert);
    setOpenViewDialog(true);
  };

  // Delete with confirmation
  const handleDeleteClick = (id: string) => {
    setCertificateToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!certificateToDelete) return;

    try {
      await MedicalCertificateService.delete(certificateToDelete);
      toast.success('Certificate deleted successfully');
      fetchCertificates();
    } catch (err: any) {
      toast.error(err.response?.data?.data.message || 'Failed to delete certificate');
    } finally {
      setDeleteDialogOpen(false);
      setCertificateToDelete(null);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        <Box>
          <Typography variant="h6" fontWeight={600}>
            Medical Certificates
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Patient: <strong>{patient.full_name}</strong> {patient.emr_number && `(EMR: ${patient.emr_number})`}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenForm()}
        >
          Issue Certificate
        </Button>
      </Stack>

      {/* Loading / Empty / Table */}
      {loading ? (
        <Box display="flex" justifyContent="center" my={10}>
          <CircularProgress />
        </Box>
      ) : certificates.length === 0 ? (
       
          <Fallbacks title='No data Found' description='   No medical certificates issued yet for this patient.'/>
      
      ) : (
        <MedicalCertificatesTable
          patient={patient}
          certificates={certificates}
          onEdit={(cert) => handleOpenForm(cert)}
          onView={handleOpenView}
          onDelete={handleDeleteClick}
        />
      )}

      {/* Form Dialog */}
      <MedicalCertificateForm
        open={openForm}
        onClose={handleCloseForm}
        editMode={editMode}
        formData={formData}
        patientId={patient.id}
        patientName={patient.full_name}
        selectedCertificate={selectedCertificate || undefined}
        refreshList={fetchCertificates}
      />

      {/* View Dialog */}
      <MedicalCertificateView
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        patient={patient}
        certificate={selectedCertificate}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Certificate?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this medical certificate? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer position="top-right" autoClose={3000} />
    </Container>
  );
}