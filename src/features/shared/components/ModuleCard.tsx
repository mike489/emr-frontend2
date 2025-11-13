import { Box, Card, CardContent, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface ModuleCardProps {
  title: string;
  icon: ReactNode;
  onClick?: () => void;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({ title, icon, onClick }) => {
  return (
    <Card
      onClick={onClick}
      sx={{
        width: 200,
        height: 200,
        m: 1,
        borderRadius: 3,
        border: '1px solid #e0e0e0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        bgcolor: '#f5f5f5',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
          bgcolor: '#f8fbff',
          borderColor: 'primary.light',
        },
        '&:active': {
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          p: 1,
        }}
      >
        <Box
          sx={{
            fontSize: 56,
            mb: 1.5,
            color: 'primary.main',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {icon}
        </Box>
        <Typography
          variant="subtitle2"
          fontWeight="bold"
          color="text.primary"
          sx={{
            mt: 1,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            textAlign: 'center',
          }}
        >
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
};
