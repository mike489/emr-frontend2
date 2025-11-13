import { styled } from '@mui/material/styles';
import { Tabs, Tab } from '@mui/material';
import { useAuthStore } from '../../store/useAuthStore';

interface TabConfig {
  label: string;
  component: string;
}
// ✅ Styled Tabs
export const AntTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: '1px solid #e8e8e8',
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.primary.main,
  },
}));

// ✅ Styled Tab
export const AntTab = styled((props: any) => <Tab disableRipple {...props} />)(({ theme }) => ({
  textTransform: 'none',
  minWidth: 0,
  [theme.breakpoints.up('sm')]: {
    minWidth: 0,
  },
  fontWeight: theme.typography.fontWeightRegular,
  marginRight: theme.spacing(1),
  color: 'rgba(0, 0, 0, 0.85)',
  fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(','),
  '&:hover': {
    color: theme.palette.text.primary,
    opacity: 1,
  },
  '&.Mui-selected': {
    color: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightMedium,
  },
  '&.Mui-focusVisible': {
    backgroundColor: '#d1eaff',
  },
}));

// Update useTabsConfig
export const useTabsConfig = () => {
  const { hasPermission } = useAuthStore();

  const tabs: TabConfig[] = [
    hasPermission('read_complaint') ? { label: 'Complaint', component: 'ComplaintTab' } : null,
    hasPermission('read_medical_history')
      ? { label: 'Ocular History', component: 'HistoryTab' }
      : null,
    hasPermission('read_medical_history')
      ? { label: 'Medical History', component: 'MedicalHistoryTab' }
      : null,
    hasPermission('read_visual_acuity')
      ? { label: 'Visual Acuity', component: 'VisualAcuityTab' }
      : null,
    hasPermission('read_ocular_motility')
      ? { label: 'Ocular Motility', component: 'OcularMotilityTab' }
      : null,
    hasPermission('read_intraocular_pressure')
      ? { label: 'Intraocular Pressure', component: 'IntraocularPressureTab' }
      : null,
    hasPermission('read_adnexa_examination')
      ? { label: 'Adnexa Examination', component: 'AdnexaExaminationTab' }
      : null,
    hasPermission('read_slit_lamp_examination')
      ? { label: 'Slit Lamp Examination', component: 'SlitLampExaminationTab' }
      : null,
    hasPermission('read_fundus_examination')
      ? { label: 'Fundus Examination', component: 'FundusExaminationTab' }
      : null,
    hasPermission('read_initial_impression')
      ? { label: 'Initial Impression', component: 'InitialImpressionsTab' }
      : null,
  ].filter((tab): tab is TabConfig => tab !== null); // Type guard

  return { tabData: tabs };
};
