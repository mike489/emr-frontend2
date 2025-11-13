import { Box, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ModuleCard } from '../features/shared/components/ModuleCard';
import PageHeader from '../features/shared/components/PageHeader';


import {
  Shield,
  UserCog,
  Users,
  Banknote,
} from 'lucide-react';

const adminModules = [
  { title: 'ADMINISTRATION', icon: <Shield size={60} color="#9c27b0" /> },        
  { title: 'CHIEF ADMIN', icon: <UserCog size={60} color="#9c27b0" /> },
  { title: 'ADMINISTRATOR', icon: <Users size={60} color="#9c27b0" /> },
  { title: 'FINANCE', icon: <Banknote size={60} color="#9c27b0" /> },
];

const Administration = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <PageHeader
        title="Welcome to the Login Panel"
        subtitle="Please select your account"
        onBack={() => navigate('/')}
      />
      <Grid container spacing={2} justifyContent={{md:'flex-start', xs:'center'}} pt={4}>
        {adminModules.map((mod) => (
          <Grid key={mod.title}>
            <ModuleCard
              title={mod.title}
              icon={mod.icon}
              onClick={() => navigate('/login')}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Administration;
