import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Avatar,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Stack,
} from "@mui/material";

// Mock user data
const mockUser = {
  name: "John Doe",
  email: "john@example.com",
  avatar: "https://i.pravatar.cc/150?img=12",
  notifications: true,
  darkMode: false,
};

const Settings: React.FC = () => {
  const [user, setUser] = useState(mockUser);

  const handleChange = (field: string, value: any) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log("Saved user settings:", user);
    alert("Settings saved!");
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        // mt: 4,
        p: 3,
        bgcolor: "#f9f9f9",
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="h5" mb={3}>
        Settings
      </Typography>

      {/* Profile Section */}
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Avatar
          src={user.avatar}
          alt={user.name}
          sx={{ width: 64, height: 64 }}
        />
        <Button variant="outlined">Change Avatar</Button>
      </Box>

      <Stack spacing={2} mb={3}>
        <TextField
          label="Full Name"
          variant="outlined"
          fullWidth
          value={user.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          value={user.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />
        <TextField
          label="New Password"
          type="password"
          variant="outlined"
          fullWidth
          onChange={(e) => handleChange("password", e.target.value)}
        />
      </Stack>

      <Divider sx={{ my: 3 }} />

      {/* Preferences Section */}
      <Typography variant="subtitle1" mb={1}>
        Preferences
      </Typography>

      <FormControlLabel
        control={
          <Switch
            checked={user.notifications}
            onChange={(e) =>
              handleChange("notifications", e.target.checked)
            }
            color="primary"
          />
        }
        label="Enable Notifications"
      />

      <FormControlLabel
        control={
          <Switch
            checked={user.darkMode}
            onChange={(e) => handleChange("darkMode", e.target.checked)}
            color="primary"
          />
        }
        label="Dark Mode"
      />

      <Divider sx={{ my: 3 }} />

      <Button
        variant="contained"
        fullWidth
        onClick={handleSave}
        sx={{ py: 1.5 }}
      >
        Save Settings
      </Button>
    </Box>
  );
};

export default Settings;
