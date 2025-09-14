import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useShuttleStore } from '../stores/shuttleStore';
import { useTranslation } from 'react-i18next';
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

import { shuttleSearchSchema } from '../utils/validation';

const formSchema = shuttleSearchSchema;

type FormData = z.infer<typeof formSchema>;

interface ShuttleSearchFormProps {
  onSearch: (data: FormData) => void;
  onFormValidChange?: (isValid: boolean) => void;
}

const ShuttleSearchForm: React.FC<ShuttleSearchFormProps> = ({ onSearch, onFormValidChange }) => {
  const { t } = useTranslation();
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

  const originValue = watch('origin')

  // Save to localStorage and store on change
  useEffect(() => {
    const subscription = watch((data) => {
      setFormData(data);
    });
    return () => subscription.unsubscribe();
  }, [watch, setFormData]);


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
        {t('searchFormTitle')}
      </Typography>

      <Box component="form" onSubmit={handleSubmit(submitForm)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Nama Penumpang */}
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label={t('passengerNameLabel')}
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
                <InputLabel>{t('originLabel')}</InputLabel>
                <Select {...field} error={!!errors.origin}>
                  <MenuItem value="">
                    <em>{t('selectOrigin')}</em>
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
                <InputLabel>{t('destinationLabel')}</InputLabel>
                <Select {...field} error={!!errors.destination}>
                  <MenuItem value="">
                    <em>{t('selectDestination')}</em>
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
              label={t('departureDateLabel')}
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
            {isSubmitting ? t('searching') : t('searchShuttle')}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default ShuttleSearchForm;
