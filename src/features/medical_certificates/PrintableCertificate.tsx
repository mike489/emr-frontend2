import React from "react";
import { Box, Typography, Divider, Grid, Avatar } from "@mui/material";
import { LocalHospitalOutlined } from "@mui/icons-material";
import type { Patient } from "../patients/PatientTable";



interface MedicalCertificate {
  diagnosis?: string;
  injury_description?: string;
  recommendations?: string;
  date_of_examination?: string;
  rest_days?: number;
  doctor:{
    name:string;

  }
  status?: "issued" | "draft";
  remarks?: string;
  certificate_number?: string;
}

interface PrintableCertificateProps {
  certificate: MedicalCertificate;
  patient: Patient;  // ← Full patient object from parent
}

const PrintableCertificate = React.forwardRef<HTMLDivElement, PrintableCertificateProps>(
  ({ certificate, patient }, ref) => {
    // ← NOW WE USE patient from props!
    if (!certificate || !patient) return null;

    const {
      diagnosis = "",
      injury_description = "",
      recommendations = "",
      date_of_examination,
      rest_days,
      status = "issued",
      remarks = "",
      certificate_number,
    } = certificate;

    const renderHTML = (html: string) => ({ __html: html });

    return (
      <>
        <style>{` /* your print styles stay exactly the same */ `}</style>

        <Box ref={ref} sx={{ width: "210mm", minHeight: "297mm", p: "20mm", fontFamily: '"Georgia", serif' }}>
          {/* Header */}
          <Box textAlign="center" mb={4}>
            <Avatar sx={{ width: 70, height: 70, mx: "auto", mb: 2, bgcolor: "primary.main" }}>
              <LocalHospitalOutlined sx={{ fontSize: 36 }} />
            </Avatar>
            <Typography variant="h3" fontWeight="bold" color="primary.main">
              MEDICAL CERTIFICATE
            </Typography>
            <Typography variant="body2" color="text.secondary" fontStyle="italic">
              Issued by Authorized Medical Practitioner
            </Typography>
            <Divider sx={{ mt: 2, borderBottomWidth: 3, borderColor: "primary.main", width: "100px", mx: "auto" }} />
          </Box>

          {/* Cert No & Status */}
          <Grid container spacing={3} mb={3}>
            <Grid size={6}>
              <Typography fontWeight="bold" color="primary" variant="subtitle2">
                Certificate No.
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {certificate_number || "TEMP-" + Date.now().toString().slice(-6)}
              </Typography>
            </Grid>
            <Grid size={6} textAlign="right">
              <Typography fontWeight="bold" color="primary" variant="subtitle2">
                Status
              </Typography>
              <Typography
                variant="h6"
                fontWeight="bold"
                color={status === "issued" ? "success.main" : "warning.main"}
              >
                {status.toLocaleUpperCase()}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ mb: 3 }} />

          {/* Patient Info — NOW SHOWS REAL DATA */}
          <Box mb={3}>
            <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
              Patient Information
            </Typography>
            <Grid container spacing={2}>
              {[
                { label: "Full Name", value: patient.full_name },
                { label: "EMR Number", value: patient.emr_number },
                { label: "Date of Birth", value: patient.date_of_birth?.split("T")[0] },
                { label: "Gender", value: patient.gender },
                { label: "Phone", value: patient.phone },
                { label: "Email", value: patient.email },
              ].map((item, i) => (
                <Grid size={{ xs: 12, sm: 6 }} key={i}>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Typography fontWeight="bold" color="text.secondary" minWidth="110px">
                      {item.label}:
                    </Typography>
                    <Typography>{item.value || "—"}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Rest of your beautiful layout stays 100% unchanged */}
          <Divider sx={{ my: 3 }} />

          <Box mb={4}>
            <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
              Medical Details
            </Typography>
            <Box sx={{ pl: 1 }}>
              {[
                { title: "Diagnosis", content: diagnosis },
                { title: "Injury / Symptoms", content: injury_description },
                { title: "Recommendations", content: recommendations },
                { title: "Rest Days Advised", content: rest_days ? `${rest_days} day(s)` : "" },
                { title: "Remarks", content: remarks || "None" },
              ].map((section, i) => (
                <Box key={i} mb={3}>
                  <Typography fontWeight="bold" color="text.secondary" gutterBottom>
                    {section.title}:
                  </Typography>
                  {section.content ? (
                    <Box className="print-html" sx={{ pl: 2 }} dangerouslySetInnerHTML={renderHTML(section.content)} />
                  ) : (
                    <Typography sx={{ pl: 2 }} fontStyle="italic" color="text.secondary">
                      Not specified
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          </Box>

          {/* Signature & Footer */}
          <Divider sx={{ my: 4 }} />
          <Grid container alignItems="flex-end" spacing={4}>
            <Grid size={6}>
              <Typography fontWeight="bold" color="text.secondary">
                Date of Examination
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {date_of_examination || new Date().toLocaleDateString()}
              </Typography>
            </Grid>
            <Grid size={6} textAlign="right">
              <Typography fontWeight="bold" color="text.secondary" gutterBottom>
                Doctor's Signature
              </Typography>
              <Box sx={{ borderTop: "2px solid #000", width: "200px", ml: "auto", height: "55px", mb: 1 }} />
              <Typography fontStyle="italic" color="text.secondary" fontSize="0.9rem">
                Dr. {certificate.doctor.name}
              </Typography>
            </Grid>
          </Grid>

          <Box textAlign="center" mt={5} pt={2} borderTop="1px dashed #aaa">
            <Typography fontSize="0.7rem" color="gray" fontStyle="italic">
              This is a system-generated certificate • Valid without signature
            </Typography>
          </Box>
        </Box>
      </>
    );
  }
);

PrintableCertificate.displayName = "PrintableCertificate";

export default PrintableCertificate;