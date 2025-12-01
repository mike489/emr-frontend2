import { Box, Card, CardContent, Typography } from '@mui/material';
import React from 'react';

interface ModuleCardProps {
  title?: string;
  image?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  sx?: object;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({ title, image, onClick, sx }) => {
  return (
    <Card
      onClick={onClick}
      sx={{
        ...sx,
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
            width: 80,
            height: 80,
            mb: 1.5,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            // borderRadius: '50%',
            overflow: 'hidden',
            // backgroundColor: '#ffffff',
            // boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          }}
        >
          <img
            src={image}
            alt={title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
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
