import { Card, CardContent, Typography, Box } from '@mui/material';
import type { ReactNode } from 'react';

interface SubModuleCardProps {
  title: string;
  icon: ReactNode;
  onClick?: () => void;
}

export const SubModuleCard: React.FC<SubModuleCardProps> = ({ title, icon, onClick }) => {
  return (
    <Card
      onClick={onClick}
      sx={{
        width: 200,
        height: 170,
        borderRadius: 2,
        boxShadow: 0,
        border: '1px solid #ddd',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: 4,
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          bgcolor: '#f9f9f9',
          p: 2,
        }}
      >
        {/* Render icon here */}
        <Box sx={{ mb: 1 }}>{icon}</Box>

        <CardContent sx={{ p: 0, textAlign: 'center' }}>
          <Typography variant="caption" fontWeight="bold">
            {title}
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
};
