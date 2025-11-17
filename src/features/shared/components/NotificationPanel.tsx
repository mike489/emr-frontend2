import {
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  Typography,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useState, useEffect } from 'react';
import { NotificationService } from '../../../shared/api/services/notification.service';


export default function NotificationPanel() {
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState<'all' | 'read' | 'unread'>('all');

  const open = (e: React.MouseEvent<HTMLButtonElement>) => setAnchor(e.currentTarget);
  const close = () => setAnchor(null);

  const fetchNotifications = async () => {
    try {
      const res = await NotificationService.getNotifications();
      const data = res.data.data;
      setNotifications(data.data.data || []);
      setUnreadCount(data.unread_count || 0);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await NotificationService.markAllRead(); 
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark all read', err);
    }
  };

  const handleMarkOneRead = async (id: string) => {
    try {
      await NotificationService.markOneRead(id); 
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark notification read', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'read') return n.read_at !== null;
    if (filter === 'unread') return n.read_at === null;
    return true;
  });

  return (
    <>
      <IconButton color="inherit" onClick={open}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={close}
        PaperProps={{ sx: { width: 350, p: 0 } }}
      >
        {/* Header */}
        <Box sx={{ px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between' }}>
          <Typography fontWeight="bold">Notifications</Typography>
          {unreadCount > 0 && (
            <Button size="small" onClick={handleMarkAllRead}>
              Mark all read
            </Button>
          )}
        </Box>

        <Divider />

        {/* Filters */}
        <Box sx={{ display: 'flex', borderBottom: 1, borderColor: 'divider' }}>
          {['all', 'unread', 'read'].map((f) => (
            <Button
              key={f}
              onClick={() => setFilter(f as any)}
              sx={{
                flex: 1,
                borderRadius: 0,
                color: filter === f ? 'primary.main' : 'text.secondary',
                fontWeight: filter === f ? 'bold' : 'normal',
              }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </Box>

        {/* List */}
        <List dense sx={{ maxHeight: 330, overflowY: 'auto' }}>
          {filteredNotifications.length === 0 && (
            <ListItem>
              <ListItemText primary="No notifications" />
            </ListItem>
          )}
          {filteredNotifications.map((n) => (
            <ListItem
              key={n.id}
              disablePadding
              sx={{
                bgcolor: !n.read_at ? 'rgba(25,118,210,0.08)' : 'transparent',
                borderLeft: !n.read_at ? '3px solid #1976d2' : '3px solid transparent',
              }}
            >
              <ListItemButton
                onClick={() => {
                  handleMarkOneRead(n.id);
                  if (n.body?.url) window.open(n.body.url, '_blank');
                }}
              >
                <ListItemText
                  primary={
                    <Typography fontWeight={!n.read_at ? 'bold' : 'normal'}>
                      {n.title}
                    </Typography>
                  }
                  secondary={new Date(n.created_at).toLocaleString()}
                />
              </ListItemButton>
            </ListItem>
            ))}
        </List>
      </Menu>
    </>
  );
}
