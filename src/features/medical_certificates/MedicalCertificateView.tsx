import React, { useRef } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, IconButton} from "@mui/material";
import { Close, Download } from "@mui/icons-material";
import PrintableCertificate from "./PrintableCertificate";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import type { Patient } from "../patients/PatientTable";

// Types

interface MedicalCertificate {
  id: string;
  patient_id: string;
  patient?: Patient;
  diagnosis: string;
  doctor:{
    name:string;

  }
  injury_description: string;
  recommendations: string;
  remarks: string;
  date_of_examination: string;
  rest_days: number;
  status: 'issued' | 'draft';
  certificate_number?: string;
  created_at?: string;
}


interface MedicalCertificateViewProps {
  open: boolean;
  onClose: () => void;
  certificate: MedicalCertificate | null;
  patient : Patient
}

const MedicalCertificateView: React.FC<MedicalCertificateViewProps> = ({ 
  open, 
  onClose, 
  certificate,
  patient


}) => {
  const printRef = useRef<HTMLDivElement>(null);

  // PDF Download
  const handleDownloadPDF = async () => {
    if (!printRef.current || !certificate) return;

    const element = printRef.current;
    
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        width: element.offsetWidth,
        height: element.offsetHeight,
        backgroundColor: "#ffffff"
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const filename = `Medical_Certificate_${certificate.certificate_number || certificate.id}.pdf`;
      pdf.save(filename);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  if (!certificate) return null;

  return (
    <>
      {/* Hidden for PDF & Print */}
      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        <div ref={printRef}>
          <PrintableCertificate certificate={certificate} patient={patient} />
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle sx={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center" 
        }}>
          Medical Certificate Details
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <PrintableCertificate certificate={certificate}  patient={patient}/>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Close</Button>
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={handleDownloadPDF}
            color="secondary"
          >
            Download PDF
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MedicalCertificateView;