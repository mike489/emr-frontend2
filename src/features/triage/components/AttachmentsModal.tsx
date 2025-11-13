import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
} from '@mui/material';
import { Download } from '@mui/icons-material';

interface Attachment {
  name: string;
  mime_type: string;
  size: string;
  url: string; // Assuming your API gives you a URL for download
}

interface AttachmentsModalProps {
  open: boolean;
  onClose: () => void;
  attachments: Attachment[];
}

const AttachmentsModal: React.FC<AttachmentsModalProps> = ({ open, onClose, attachments }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Attachments</DialogTitle>
      <DialogContent>
        {attachments.length === 0 ? (
          <Typography>No attachments available</Typography>
        ) : (
          <List>
            {attachments.map((att, idx) => (
              <ListItem
                key={idx}
                secondaryAction={
                  <IconButton edge="end" href={att.url} target="_blank" rel="noopener noreferrer">
                    <Download />
                  </IconButton>
                }
              >
                <ListItemText primary={att.name} secondary={`${att.mime_type} • ${att.size}`} />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AttachmentsModal;
