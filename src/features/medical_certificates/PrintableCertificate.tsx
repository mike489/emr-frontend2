import React from "react";
import { Box, Typography, Divider, Grid, Avatar } from "@mui/material";
import { LocalHospitalOutlined } from "@mui/icons-material";

// Types
interface Patient {
  full_name?: string;
  emr_number?: string;
  date_of_birth?: string;
  gender?: string;
  phone?: string;
  email?: string;
}

interface MedicalCertificate {
  patient?: Patient;
  diagnosis?: string;
  injury_description?: string;
  recommendations?: string;
  date_of_examination?: string;
  rest_days?: number;
  status?: "issued" | "draft";
  remarks?: string;
  certificate_number?: string;
}

interface PrintableCertificateProps {
  certificate: MedicalCertificate;
}

// Print-ready forwardRef
const PrintableCertificate = React.forwardRef<HTMLDivElement, PrintableCertificateProps>(
  (props, ref) => {
    const { certificate } = props;
    if (!certificate) return null;

    const {
      patient,
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
        {/* ==== GLOBAL PRINT STYLES (inject once) ==== */}
        <style>{`
          @media print {
            @page {
              size: A4;
              margin: 0;
            }
            body, html {
              margin: 0 !important;
              padding: 0 !important;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            /* Reset all MUI shadows/borders */
            * {
              box-shadow: none !important;
              border: none !important;
            }
            /* HTML content inside dangerouslySetInnerHTML */
            .print-html p {
              margin: 6px 0 !important;
              line-height: 1.5 !important;
            }
            .print-html ul, .print-html ol {
              margin: 6px 0 6px 20px !important;
              padding-left: 0 !important;
            }
            .print-html li {
              margin-bottom: 4px !important;
            }
          }
        `}</style>

        <Box
          ref={ref}
          sx={{
            width: "210mm",
            minHeight: "297mm",
            p: "20mm",
            fontFamily: '"Georgia", "Times New Roman", serif',
            backgroundColor: "#fff",
            color: "#000",
            position: "relative",
            overflow: "hidden",
            "@media print": {
              p: "15mm",
              width: "210mm",
              minHeight: "297mm",
              background: "#fff !important",
            },
          }}
        >
          {/* Header */}
          <Box textAlign="center" mb={4} position="relative" zIndex={1}>
            <Avatar
              sx={{
                width: 70,
                height: 70,
                mx: "auto",
                mb: 2,
                bgcolor: "primary.main",
              }}
            >
              <LocalHospitalOutlined sx={{ fontSize: 36 }}/>
            </Avatar>
            <Typography
              variant="h3"
              fontWeight="bold"
              letterSpacing="1.5px"
              color="primary.main"
              gutterBottom
            >
              MEDICAL CERTIFICATE
            </Typography>
            <Typography variant="body2" color="text.secondary" fontStyle="italic">
              Issued by Authorized Medical Practitioner
            </Typography>
            <Divider
              sx={{
                mt: 2,
                borderBottomWidth: 3,
                borderColor: "primary.main",
                width: "100px",
                mx: "auto",
              }}
            />
          </Box>

          {/* Cert No & Status */}
          <Grid container spacing={3} mb={3}>
            <Grid size={6}>
              <Typography fontWeight="bold" color="primary" variant="subtitle2">
                Certificate No.
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {certificate_number}
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
                textTransform="uppercase"
              >
                {status}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ mb: 3 }} />

          {/* Patient Info */}
          <Box mb={3}>
            <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
              Patient Information
            </Typography>
            <Grid container spacing={2}>
              {[
                { label: "Full Name", value: patient?.full_name },
                { label: "EMR Number", value: patient?.emr_number },
                { label: "Date of Birth", value: patient?.date_of_birth?.split("T")[0] },
                { label: "Gender", value: patient?.gender },
                { label: "Phone", value: patient?.phone },
                { label: "Email", value: patient?.email },
              ].map((item, i) => (
                <Grid size={{xs:12, sm:6}} key={i}>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Typography fontWeight="bold" color="text.secondary" minWidth="110px">
                      {item.label}:
                    </Typography>
                    <Typography>{item.value || "N/A"}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Medical Details */}
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
                    <Box
                      className="print-html"
                      sx={{ pl: 2 }}
                      dangerouslySetInnerHTML={renderHTML(section.content)}
                    />
                  ) : (
                    <Typography sx={{ pl: 2 }} fontStyle="italic" color="text.secondary">
                      Not specified
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Signature */}
          <Grid container alignItems="flex-end" spacing={4}>
            <Grid size={6}>
              <Typography fontWeight="bold" color="text.secondary">
                Date of Examination
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {date_of_examination}
              </Typography>
            </Grid>
            <Grid size={6} textAlign="right">
              <Typography fontWeight="bold" color="text.secondary" gutterBottom>
                Doctor's Signature
              </Typography>
              <Box
                sx={{
                  borderTop: "2px solid #000",
                  width: "200px",
                  ml: "auto",
                  height: "55px",
                  mb: 1,
                }}
              />
              <Typography fontStyle="italic" color="text.secondary" fontSize="0.9rem">
                Authorized Medical Practitioner
              </Typography>
              <Typography fontSize="0.8rem" color="gray">
                License No: MP-XXXXXX
              </Typography>
            </Grid>
          </Grid>

          {/* Footer */}
          <Box textAlign="center" mt={5} pt={2} borderTop="1px dashed #aaa">
            <Typography fontSize="0.7rem" color="gray" fontStyle="italic">
              System-generated certificate • No signature required
            </Typography>
          </Box>
        </Box>
      </>
    );
  }
);

PrintableCertificate.displayName = "PrintableCertificate";

export default PrintableCertificate;