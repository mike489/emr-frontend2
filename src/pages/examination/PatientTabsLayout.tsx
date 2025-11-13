import React, { useState, useEffect, Suspense } from 'react';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { AntTabs, AntTab, useTabsConfig } from '../../features/examination/TabsConfig';
import ComplaintTab from '../../features/examination/components/complaints/ComplaintTab';
import MedicalHistoryTab from '../../features/examination/components/histories/MedicalHistory';
import HistoryTab from '../../features/examination/components/histories/HistoryTab';
import { PatientService } from '../../shared/api/services/patient.service';
import { toast } from 'react-toastify';
import VisualAcuityTab from '../../features/examination/components/visual-activity/VisualAcuityTab';
import OcularMotilityTab from '../../features/examination/components/ocular-motility/OcularMotilityTab';
import IntraocularPressureTab from '../../features/examination/components/Intraocular-pressure/IntraocularPressureTab';
import AdnexaExaminationTab from '../../features/examination/components/adnexa-examination/AdnexaExaminationTab';
import InitialImpressionsTab from '../../features/examination/components/Initial-Impressions/InitialImpressionsTab';
// import SlitLampExaminationTab from '../../features/examination/components/sit-lamp-examination/SlitLampExaminationTab';
// import FundusExaminationsTab from '../../features/examination/components/fundus-examinations/FundusExaminationsTab';

// -----------------------------
// Type Definitions
// -----------------------------
interface Visit {
  id: string;
  visit_id: string;
  patient_name: string;
  visit_date: string;
}

// This maps tab names to components

const PatientTabsLayout: React.FC = () => {
  const { tabData = [] } = useTabsConfig();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [selectedVisitId, setSelectedVisitId] = useState<string>('');
  const [loadingVisits, setLoadingVisits] = useState<boolean>(false);

  // -----------------------------
  // Handlers
  // -----------------------------
  const handleChangeTab = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const fetchVisits = async () => {
    setLoadingVisits(true);
    try {
      const res = await PatientService.getVisits();
      const visitsData: Visit[] = res?.data?.data?.data ?? [];
      setVisits(visitsData);

      // Automatically select first visit if available
      setSelectedVisitId(visitsData[0]?.visit_id ?? '');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to fetch visits');
    } finally {
      setLoadingVisits(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  const componentMap: Record<string, React.ComponentType<{ visitId: string }>> = {
    ComplaintTab,
    MedicalHistoryTab,
    HistoryTab,
    VisualAcuityTab,
    OcularMotilityTab,
    IntraocularPressureTab,
    AdnexaExaminationTab,
    InitialImpressionsTab,
  };

  const ActiveComponentName = tabData[activeTab]?.component;
  const ActiveComponent = ActiveComponentName ? componentMap[ActiveComponentName] : null;

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default' }}>
      {/* Sidebar Tabs */}
      <Paper
        elevation={0}
        sx={{
          px: 4,
          width: 250,
          borderRight: '1px solid #ddd',
          display: 'flex',
          textAlign: 'left',
          justifyContent: 'flex-start',
          flexDirection: 'column',
          bgcolor: 'background.paper',
        }}
      >
        <Typography
          variant="h6"
          sx={{ p: 2, borderBottom: '1px solid #eee', color: 'primary.main' }}
        >
          Examinations
        </Typography>

        <AntTabs
          orientation="vertical"
          value={activeTab}
          onChange={handleChangeTab}
          sx={{
            '& .MuiTabs-flexContainer': {
              flexDirection: 'column',
              alignItems: 'flex-start',
            },
            '& .MuiTab-root': {
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              textAlign: 'left',
              width: '100%',
            },
            overflowY: 'auto',
          }}
        >
          {tabData.map((tab, index) => (
            <AntTab
              key={index}
              label={tab?.label}
              sx={{
                px: 2,
                textTransform: 'none',
              }}
            />
          ))}
        </AntTabs>
      </Paper>

      {/* Main Content */}
      <Box sx={{ flex: 1, p: 3, overflowY: 'auto', bgcolor: 'background.default' }}>
        {/* Visit Selector */}
        <FormControl sx={{ mb: 2, minWidth: 240 }}>
          <InputLabel id="visit-select-label">Select Visit</InputLabel>
          <Select
            labelId="visit-select-label"
            value={selectedVisitId}
            label="Select Visit"
            onChange={e => setSelectedVisitId(e.target.value)}
          >
            {visits.map(visit => (
              <MenuItem key={visit.visit_id} value={visit.visit_id}>
                {visit.patient_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Loading State */}
        {loadingVisits ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : !selectedVisitId ? (
          <Typography color="text.secondary" sx={{ mt: 2 }}>
            Please select a visit to view examination details.
          </Typography>
        ) : (
          <Suspense
            fallback={
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
              </Box>
            }
          >
            {ActiveComponent ? <ActiveComponent visitId={selectedVisitId} /> : null}
          </Suspense>
        )}
      </Box>
    </Box>
  );
};

export default PatientTabsLayout;
