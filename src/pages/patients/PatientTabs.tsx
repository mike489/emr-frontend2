import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Tabs,
  Tab,
  Box,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import Patients from "./Patients";
import MedicalCertificatesIndex from "../medical_certificate";
import FollowUpListTable from "../../features/follow_up/FollowUpListTable";
import ExaminationsHistory from "../../features/examination/ExaminationsHistory";
import { PatientService } from "../../shared/api/services/patient.service";
import { toast } from "react-toastify";
import Fallbacks from "../../features/shared/components/Fallbacks";

export default function PatientTabs() {
  const location = useLocation();
  const patient = location.state?.patient;

  const [currentTab, setCurrentTab] = useState<string>("examinations");
  const [examData, setExamData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchExaminationHistory = async () => {
    if (!patient?.constultation_id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await PatientService.getExaminationData(patient.constultation_id);
      setExamData(response.data?.data?.data?.examination_data || null);
    } catch (error: any) {
      toast.error("Failed to load examination history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patient) fetchExaminationHistory();
  }, [patient?.constultation_id]);

  if (!patient) {
    return (
      <Box sx={{ p: 6, textAlign: "center" }}>
        <Alert severity="warning">No patient selected</Alert>
      </Box>
    );
  }

  const isFollowUpVisit = patient.visit_type === "Follow Up";

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  };

  return (
    <Box display="flex" flexDirection="column" height="100vh" width="100%" sx={{px:2, pb:4, mt:-16}}>
      {/* Patient Header */}
      <Box sx={{ mb: 3 }}>
        <Patients patient={patient} />
      </Box>

      {/* Main Layout */}
      <Paper elevation={3} sx={{ flexGrow: 1, display: "flex", flexDirection: { xs: "column", md: "row" }, borderRadius: 3, overflow: "hidden" }}>
        
        {/* Vertical Tabs */}
        <Tabs
          orientation="vertical"
          value={currentTab}
          onChange={handleTabChange}
          sx={{
            borderRight: 1,
            borderColor: "divider",
            minWidth: { md: 260 },
            bgcolor: "grey.50",
            "& .MuiTab-root": {
              alignItems: "flex-start",
              textAlign: "left",
              py: 2,
              fontWeight: 500,
            },
          }}
        >
          <Tab label="Examinations" value="examinations" />
          {isFollowUpVisit && <Tab label="Follow Up" value="follow-up" />}
          <Tab label="Medical Certificate" value="certificate" />
          <Tab label="Prescriptions" value="prescriptions" />
        </Tabs>

        {/* Content Area - No Index Hell */}
        <Box flexGrow={1} p={3} bgcolor="background.paper">

          {/* Examinations */}
          {currentTab === "examinations" && (
            loading ? (
              <Box display="flex" justifyContent="center" p={5}>
                <CircularProgress />
              </Box>
            ) : examData ? (
              <ExaminationsHistory data={examData} />
            ) : (
              
              <Fallbacks title="No Data Found" description="No examination history available"/>
            
            )
          )}

          {/* Follow Up - Only renders when tab exists */}
          {currentTab === "follow-up" && isFollowUpVisit && (
            <FollowUpListTable
              patientId={patient.id}
              consultantId={patient.constultation_id}
            />
          )}

          {/* Medical Certificate */}
          {currentTab === "certificate" && (
            <MedicalCertificatesIndex patient={patient} />
          )}

          {/* Prescriptions */}
          {currentTab === "prescriptions" && (
            <Box textAlign="center" py={8}> 
              <Fallbacks title="No Data Found" description=" Prescriptions Module Coming Soon"/>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
}