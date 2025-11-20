import { useEffect, useState } from "react";
import { Box, CircularProgress, Button, Container, Stack, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import MedicalCertificateForm from "../../features/medical_certificates/MedicalCertificateForm";
import MedicalCertificatesTable from "../../features/medical_certificates/MedicalCertificatesTable";
import MedicalCertificateView from "../../features/medical_certificates/MedicalCertificateView";
import { PatientService } from "../../shared/api/services/patient.service";
import { MedicalCertificateService } from "../../shared/api/services/sickLeave.service";




// Types
interface Patient {
  id: string;
  full_name: string;
  emr_number?: string;
  date_of_birth?: string;
  gender?: string;
  phone?: string;
  email?: string;
}

interface MedicalCertificate {
  id: string;
  patient_id: string;
  patient?: Patient;
  diagnosis: string;
  injury_description: string;
  recommendations: string;
  remarks: string;
  date_of_examination: string;
  rest_days: number;
  status: 'issued' | 'draft';
  certificate_number?: string;
  created_at?: string;
  updated_at?: string;
}

interface FormData {
  patient_id: string;
  diagnosis: string;
  injury_description: string;
  recommendations: string;
  date_of_examination: string;
  rest_days: number;
  remarks: string;
  status: 'issued' | 'draft';
}

export default function MedicalCertificatesIndex() {
  const [certificates, setCertificates] = useState<MedicalCertificate[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);

  const [openForm, setOpenForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<MedicalCertificate | null>(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    patient_id: "",
    diagnosis: "",
    injury_description: "",
    recommendations: "",
    date_of_examination: "",
    rest_days: 0,
    remarks: "",
    status: "issued",
  });

  // Fetch all certificates
  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const response = await MedicalCertificateService.getAll();
      if (response.data.success) {
        setCertificates(response.data.data?.data || []);
      } else {
        toast.warning(response.data.message || "Failed to fetch certificates");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error fetching certificates");
    } finally {
      setLoading(false);
    }
  };

  // Fetch patients
  const fetchPatients = async () => {
    try {
      const response = await PatientService.getAll();
      if (response.data.success) {
        setPatients(response.data.data?.data || []);
      } else {
        toast.warning(response.data.message || "Failed to fetch patients");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error fetching patients");
    }
  };

  useEffect(() => {
    fetchCertificates();
    fetchPatients();
  }, []);

  // Open add/edit form
  const handleOpenForm = (cert: MedicalCertificate | null = null) => {
    if (cert) {
      setEditMode(true);
      setSelectedCertificate(cert);
      setFormData({
        patient_id: cert.patient_id || "",
        diagnosis: cert.diagnosis || "",
        injury_description: cert.injury_description || "",
        recommendations: cert.recommendations || "",
        date_of_examination: cert.date_of_examination || "",
        rest_days: cert.rest_days || 0,
        remarks: cert.remarks || "",
        status: cert.status || "issued",
      });
    } else {
      setEditMode(false);
      setSelectedCertificate(null);
      setFormData({
        patient_id: "",
        diagnosis: "",
        injury_description: "",
        recommendations: "",
        date_of_examination: "",
        rest_days: 0,
        remarks: "",
        status: "issued",
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

  const handleCloseView = () => {
    setOpenViewDialog(false);
    setSelectedCertificate(null);
  };

  // Handle delete (you might want to implement this properly)
  const handleDelete = async (id: string) => {
    try {
      await MedicalCertificateService.delete(id);
      toast.success("Certificate deleted successfully");
      fetchCertificates();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error deleting certificate");
    }
  };

  return (
    <Container
    
      maxWidth="lg"
      sx={{ mt: 4, mb: 4 }}
     
    >
        <Stack sx={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <Box>
                <Typography>Medical Certificates</Typography>
            </Box>
            <Box>
 <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenForm()}
          >
            Add Certificate
          </Button>
            </Box>
        </Stack>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
          <CircularProgress />
        </Box>
      ) : (
        <MedicalCertificatesTable
          certificates={certificates}
          onEdit={handleOpenForm}
          onDelete={handleDelete}
          onView={handleOpenView}
        />
      )}

      <MedicalCertificateForm
        open={openForm}
        onClose={handleCloseForm}
        editMode={editMode}
        formData={formData}
        setFormData={setFormData}
        patients={patients}
        refreshList={fetchCertificates}
        // selectedCertificate={selectedCertificate}
      />

      <MedicalCertificateView
        open={openViewDialog}
        onClose={handleCloseView}
        certificate={selectedCertificate}
      />

      <ToastContainer />
    </Container>
  );
}