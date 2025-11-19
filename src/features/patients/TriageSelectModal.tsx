import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Box,
} from "@mui/material";
import { useState, useEffect } from "react";
import { TriageService } from "../../shared/api/services/triage.service";


interface TriageSelectModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (data: { name: string; count: number }) => void;
}

interface TriageRoom {
  id: string;
  name: string;
  count: number;
}

const TriageSelectModal: React.FC<TriageSelectModalProps> = ({
  open,
  onClose,
  onSelect,
}) => {
  const [rooms, setRooms] = useState<TriageRoom[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
  if (!open) return;

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await TriageService.getTriageWithCount();
      setRooms(response.data.data); // <-- note the extra .data
    } catch (err) {
      console.error("Failed to fetch triage rooms", err);
    } finally {
      setLoading(false);
    }
  };

  fetchRooms();
}, [open]);


  
const handleSend = (room: TriageRoom) => {
    // send only the room name (cast to avoid TS errors if onSelect signature wasn't updated)
    (onSelect as unknown as (name: string) => void)(room.name);
    onClose();
};
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { backgroundColor: "white", color: "black" } }}
    >
      <DialogTitle sx={{ textAlign: "center", fontWeight: 600 }}>
        Send Patient to Triage Room
      </DialogTitle>

      <DialogContent>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={24} />
          </Box>
        ) : rooms.length === 0 ? (
          <Typography textAlign="center">No triage rooms found.</Typography>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="center">Count</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rooms.map((room) => (
                <TableRow key={room.id} hover>
                  <TableCell>{room.name}</TableCell>
                  <TableCell align="center">{room.count}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleSend(room)}
                    >
                      Send
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: "flex-end", px: 3, pb: 2 }}>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TriageSelectModal;
