import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { ArrowDropDown } from '@mui/icons-material';
import { doctorsService } from '../../../shared/api/services/Doctor.service';
import { DepartmentsService } from '../../../shared/api/services/departments.service';
import { toast } from 'react-toastify';

interface SendModalProps {
  open: boolean;
  onClose: () => void;
  onSend: (department: string, doctorId: string) => void;
}

const SendModal: React.FC<SendModalProps> = ({ open, onClose, onSend }) => {
  const [doctors, setDoctors] = React.useState<any[]>([]);
  const [departments, setDepartments] = React.useState<string[]>([]);
  const [selectedDepartment, setSelectedDepartment] = React.useState('');
  const [selectedDoctor, setSelectedDoctor] = React.useState('');
  const [loading, setLoading] = React.useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [doctorsRes, departmentsRes] = await Promise.all([
        doctorsService.getAll(),
        DepartmentsService.getAll(),
      ]);

      setDoctors(doctorsRes.data?.data || []);
      setDepartments(departmentsRes.data?.data || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  const handleSend = () => {
    if (!selectedDepartment || !selectedDoctor) {
      toast.error('Please select both department and doctor');
      return;
    }
    onSend(selectedDepartment, selectedDoctor);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Send Patient</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <TextField
              select
              label="Department"
              value={selectedDepartment}
              onChange={e => setSelectedDepartment(e.target.value)}
              SelectProps={{ IconComponent: ArrowDropDown }}
              sx={{
                mt: 1,
              }}
              fullWidth
            >
              {departments.map((dept, idx) => (
                <MenuItem key={idx} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Doctor"
              value={selectedDoctor}
              onChange={e => setSelectedDoctor(e.target.value)}
              SelectProps={{ IconComponent: ArrowDropDown }}
              fullWidth
            >
              {doctors.map(doctor => (
                <MenuItem key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </MenuItem>
              ))}
            </TextField>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSend} variant="contained" color="primary">
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SendModal;
