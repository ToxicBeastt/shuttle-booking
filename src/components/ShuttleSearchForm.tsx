import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useShuttleStore } from '../stores/shuttleStore';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Typography,
  Paper,
} from '@mui/material';

const cities = ['Jakarta', 'Bandung', 'Surabaya'];

const formSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi'),
  origin: z.string().min(1, 'Kota asal wajib dipilih'),
  destination: z.string().min(1, 'Kota tujuan wajib dipilih'),
  departureDate: z.string().min(1, 'Tanggal berangkat wajib dipilih'),
}).refine((data) => {
  if (data.origin && data.destination && data.origin === data.destination) {
    return false;
  }
  return true;
}, {
  message: 'Kota asal dan tujuan tidak boleh sama',
  path: ['destination'],
});

type FormData = z.infer<typeof formSchema>;

interface ShuttleSearchFormProps {
  onSearch: (data: FormData) => void;
  onFormValidChange?: (isValid: boolean) => void;
}

const ShuttleSearchForm: React.FC<ShuttleSearchFormProps> = ({ onSearch, onFormValidChange }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const setFormData = useShuttleStore(state => state.setFormData);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      origin: '',
      destination: '',
      departureDate: '',
    },
  });

  const originValue = watch('origin');

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('shuttleSearchForm');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setValue('name', parsed.name || '');
        setValue('origin', parsed.origin || '');
        setValue('destination', parsed.destination || '');
        setValue('departureDate', parsed.departureDate || '');
      } catch (e) {
        console.error('Error loading from localStorage', e);
      }
    }
  }, [setValue]);

  // Save to localStorage and store on change
  useEffect(() => {
    const subscription = watch((data) => {
      localStorage.setItem('shuttleSearchForm', JSON.stringify(data));
      setFormData(data);
    });
    return () => subscription.unsubscribe();
  }, [watch, setFormData]);

  // Clear localStorage on page unload
  useEffect(() => {
    const handleUnload = () => {
      localStorage.removeItem('shuttleSearchForm');
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  // Notify parent about form validity changes
  useEffect(() => {
    if (onFormValidChange) {
      onFormValidChange(isValid);
    }
  }, [isValid, onFormValidChange]);

  const submitForm = async (data: FormData) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    onSearch(data);
    setIsSubmitting(false);
  };


  return (
    <Paper sx={{ p: 3, mb: 3 }} role="search">
      <Typography variant="h5" component="h2" gutterBottom>
        Form Pencarian Shuttle
      </Typography>

      <Box component="form" onSubmit={handleSubmit(submitForm)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Nama Penumpang */}
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Nama Penumpang *"
              error={!!errors.name}
              helperText={errors.name?.message}
              fullWidth
            />
          )}
        />

        {/* Origin and Destination */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Controller
            name="origin"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth sx={{ minWidth: 120 }}>
                <InputLabel>Kota Asal *</InputLabel>
                <Select {...field} error={!!errors.origin}>
                  <MenuItem value="">
                    <em>Pilih kota asal</em>
                  </MenuItem>
                  {cities.map((city) => (
                    <MenuItem key={city} value={city}>
                      {city}
                    </MenuItem>
                  ))}
                </Select>
                {errors.origin && <Typography color="error" variant="caption">{errors.origin.message}</Typography>}
              </FormControl>
            )}
          />

          <Controller
            name="destination"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth sx={{ minWidth: 120 }}>
                <InputLabel>Kota Tujuan *</InputLabel>
                <Select {...field} error={!!errors.destination}>
                  <MenuItem value="">
                    <em>Pilih kota tujuan</em>
                  </MenuItem>
                  {cities
                    .filter((city) => city !== originValue)
                    .map((city) => (
                      <MenuItem key={city} value={city}>
                        {city}
                      </MenuItem>
                    ))}
                </Select>
                {errors.destination && <Typography color="error" variant="caption">{errors.destination.message}</Typography>}
              </FormControl>
            )}
          />
        </Box>

        {/* Departure Date */}
        <Controller
          name="departureDate"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Tanggal Berangkat *"
              type="date"
              InputLabelProps={{ shrink: true }}
              error={!!errors.departureDate}
              helperText={errors.departureDate?.message}
              fullWidth
            />
          )}
        />

        {/* Button */}
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={!isValid || isSubmitting}
            fullWidth
          >
            {isSubmitting ? 'Mencari...' : 'Cari Shuttle'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default ShuttleSearchForm;
