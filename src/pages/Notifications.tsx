import React, { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Divider,
  Badge,
  Button,
} from "@mui/material";
import { Done, Notifications as NotificationsIcon } from "@mui/icons-material";

// Mock data
const mockNotifications = [
  {
    id: 1,
    title: "New Assignment",
    description: "Math Homework is due tomorrow.",
    date: "2025-11-15 08:30",
    read: false,
  },
  {
    id: 2,
    title: "Exam Reminder",
    description: "Science Exam starts at 10:00 AM.",
    date: "2025-11-14 17:00",
    read: true,
  },
  {
    id: 3,
    title: "Parent Meeting",
    description: "Meeting scheduled with teacher.",
    date: "2025-11-13 09:00",
    read: false,
  },
];

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <Box
      sx={{
        maxWidth: 500,
        bgcolor: "#f9f9f9",
        p: 2,
        borderRadius: 2,
        boxShadow: 3,
        mx: "auto",
        mt: 4,
      }}
    >
      <Box display="flex" alignItems="center" mb={2}>
        <NotificationsIcon fontSize="large" />
        <Typography variant="h6" ml={1}>
          Notifications
        </Typography>
        <Badge
          badgeContent={notifications.filter((n) => !n.read).length}
          color="error"
          sx={{ ml: "auto" }}
        />
      </Box>

      <List>
        {notifications.map((notification) => (
          <React.Fragment key={notification.id}>
            <ListItem
              sx={{
                bgcolor: notification.read ? "white" : "rgba(25,118,210,0.1)",
                borderRadius: 1,
                mb: 1,
                transition: "0.2s",
                "&:hover": { bgcolor: "rgba(25,118,210,0.15)" },
              }}
            >
              <ListItemText
                primary={
                  <Typography
                    fontWeight={notification.read ? "400" : "600"}
                    color={notification.read ? "text.primary" : "primary.main"}
                  >
                    {notification.title}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography variant="body2" color="text.secondary">
                      {notification.description}
                    </Typography>
                    <Typography variant="caption" color="text.disabled">
                      {notification.date}
                    </Typography>
                  </>
                }
              />
              {!notification.read && (
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    color="primary"
                    onClick={() => markAsRead(notification.id)}
                  >
                    <Done />
                  </IconButton>
                </ListItemSecondaryAction>
              )}
            </ListItem>
          </React.Fragment>
        ))}
      </List>

      <Divider sx={{ my: 2 }} />

      <Button
        variant="contained"
        fullWidth
        onClick={() =>
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
        }
      >
        Mark All as Read
      </Button>
    </Box>
  );
};

export default Notifications;
