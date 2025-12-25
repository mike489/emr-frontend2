import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Checkbox,
  OutlinedInput,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import { LaboratoryService } from '../../shared/api/services/laboratory.service';

interface GlassMaterial {
  id: string;
  name: string;
  price: string;
  description?: string;
  category: string;
  stock_quantity: number;
}

// interface GlassOrderMaterial {
//   id: string;
//   quantity: number;
// }

interface Props {
  open: boolean;
  onClose: () => void;
  materials: GlassMaterial[];
  prescriptionId: string;
  onOrderCreated: () => void;
}

const CreateGlassOrderModal: React.FC<Props> = ({
  open,
  onClose,
  materials,
  prescriptionId,
  onOrderCreated,
}) => {
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  const handleMaterialChange = (event: any) => {
    const selected = event.target.value;
    setSelectedMaterials(selected);

    // initialize quantity to 1 for each new material
    const q = { ...quantities };
    selected.forEach((id: string) => {
      if (!q[id]) q[id] = 1;
    });
    setQuantities(q);
  };

  const handleQuantityChange = (id: string, value: number) => {
    if (value < 1) return;
    setQuantities(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async () => {
    if (selectedMaterials.length === 0) return;

    setLoading(true);

    const orderPayload = {
      glass_prescription_id: prescriptionId,
      materials: selectedMaterials.map(id => ({
        id,
        quantity: quantities[id] || 1,
      })),
    };

    try {
      await LaboratoryService.createGlassOrders(orderPayload);
      onOrderCreated();
      onClose();
      setSelectedMaterials([]);
      setQuantities({});
    } catch (error) {
      console.error('Create order error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Glass Order</DialogTitle>

      <DialogContent dividers>
        {/* Material selector */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Select Materials</InputLabel>
          <Select
            multiple
            value={selectedMaterials}
            onChange={handleMaterialChange}
            input={<OutlinedInput label="Select Materials" />}
            renderValue={selected =>
              selected.map(id => materials.find(m => m.id === id)?.name).join(', ')
            }
          >
            {materials.map(m => (
              <MenuItem key={m.id} value={m.id}>
                <Checkbox checked={selectedMaterials.includes(m.id)} />
                <Typography>{m.name}</Typography>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Quantities */}
        {selectedMaterials.map(id => {
          const material = materials.find(m => m.id === id);
          return (
            <Box key={id} sx={{ mt: 2 }}>
              <Typography>{material?.name}</Typography>
              <TextField
                type="number"
                label="Quantity"
                size="small"
                sx={{ mt: 1 }}
                value={quantities[id] || 1}
                onChange={e => handleQuantityChange(id, Number(e.target.value))}
              />
            </Box>
          );
        })}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          disabled={loading || selectedMaterials.length === 0}
          onClick={handleSubmit}
        >
          {loading ? <CircularProgress size={22} /> : 'Create Order'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateGlassOrderModal;
