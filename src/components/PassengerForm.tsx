import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Grid,
} from '@mui/material';
import { Shuttle } from '../stores/shuttleStore';

const formSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi'),
  email: z.string().email('Email tidak valid'),
  phone: z.string().min(10, 'Nomor telepon minimal 10 digit'),
  passengers: z.string().min(1, 'Jumlah penumpang wajib diisi').refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Jumlah penumpang harus angka positif'),
});

type FormData = z.infer<typeof formSchema>;

interface PassengerFormProps {
  selectedShuttle: Shuttle | null;
  selectedTime: string | null;
}

const PassengerForm: React.FC<PassengerFormProps> = ({ selectedShuttle, selectedTime }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      passengers: '1',
    },
  });

  const [bookingStatus, setBookingStatus] = React.useState<'idle' | 'loading' | 'success'>('idle');

  const submitForm = async (data: FormData) => {
    setIsSubmitting(true);
    setBookingStatus('loading');

    // Simulate loading state 800-1200ms
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log('Booking data:', {
      shuttle: selectedShuttle,
      time: selectedTime,
      passenger: data,
    });

    setBookingStatus('success');
    setIsSubmitting(false);
  };

  if (bookingStatus === 'success') {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="h5" color="primary" gutterBottom>
          Terima kasih, booking Anda berhasil!
        </Typography>
        <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Kembali ke Beranda
        </Button>
      </Box>
    );
  }

  if (!selectedShuttle || !selectedTime) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="h6" color="text.secondary">
          Tidak ada shuttle yang dipilih
        </Typography>
        <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Kembali ke Pencarian
        </Button>
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Formulir Penumpang
      </Typography>

      <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
        <Typography variant="subtitle1" gutterBottom>
          Detail Shuttle Terpilih
        </Typography>
        <Typography>Operator: {selectedShuttle.operator}</Typography>
        <Typography>Rute: {selectedShuttle.origin} → {selectedShuttle.destination}</Typography>
        <Typography>Jam: {selectedTime}</Typography>
        <Typography>Harga: Rp{selectedShuttle.price.toLocaleString()}</Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit(submitForm)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Nama Lengkap *"
              error={!!errors.name}
              helperText={errors.name?.message}
              fullWidth
            />
          )}
        />

        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Email *"
              type="email"
              error={!!errors.email}
              helperText={errors.email?.message}
              fullWidth
            />
          )}
        />

        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Nomor Telepon *"
              error={!!errors.phone}
              helperText={errors.phone?.message}
              fullWidth
            />
          )}
        />

        <Controller
          name="passengers"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Jumlah Penumpang *"
              type="number"
              inputProps={{ min: 1 }}
              error={!!errors.passengers}
              helperText={errors.passengers?.message}
              fullWidth
            />
          )}
        />

        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            type="button"
            variant="outlined"
            onClick={() => navigate('/')}
            fullWidth
          >
            Kembali
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!isValid || isSubmitting}
            fullWidth
          >
            {isSubmitting ? 'Memproses...' : 'Konfirmasi Booking'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default PassengerForm;
