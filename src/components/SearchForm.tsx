import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
} from "@mui/material";

const cities = ["Jakarta", "Bandung", "Surabaya"];
const operators = ["Blue Shuttle", "TravelX", "CityTrans"];
const departureTimes = ["08:00", "13:00", "19:00"];

const formSchema = z.object({
  origin: z.string().optional(),
  destination: z.string().optional(),
  operator: z.string().optional(),
  departureTime: z.string().optional(),
  minPrice: z.string().optional().refine((val) => !val || !isNaN(Number(val)) && Number(val) >= 0, "Harga minimal harus angka positif"),
  maxPrice: z.string().optional().refine((val) => !val || !isNaN(Number(val)) && Number(val) >= 0, "Harga maksimal harus angka positif"),
  departureDate: z.string().optional(),
}).refine((data) => {
  if (data.minPrice && data.maxPrice) {
    const min = Number(data.minPrice);
    const max = Number(data.maxPrice);
    return min <= max;
  }
  return true;
}, {
  message: "Harga minimal tidak boleh lebih besar dari harga maksimal",
  path: ["maxPrice"],
}).refine((data) => {
  // If both origin and destination are provided, they should be different
  if (data.origin && data.destination && data.origin === data.destination) {
    return false;
  }
  return true;
}, {
  message: "Kota asal dan tujuan tidak boleh sama",
  path: ["destination"],
});

type FormData = z.infer<typeof formSchema>;

interface SearchFormProps {
  onSearch: (data: FormData) => void;
  onReset?: () => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, onReset }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange", // validate while typing
    defaultValues: {
      origin: "",
      destination: "",
      operator: "",
      departureTime: "",
      minPrice: undefined,
      maxPrice: undefined,
      departureDate: "",
    },
  });

  const originValue = watch("origin");

  const submitForm = async (data: FormData) => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    onSearch(data);
    setIsSubmitting(false);
  };

  const handleReset = () => {
    reset();
    if (onReset) {
      onReset();
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }} role="search">
      <Typography variant="h5" component="h2" gutterBottom>
        Pencarian Shuttle
      </Typography>

      <Box component="form" onSubmit={handleSubmit(submitForm)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Origin and Destination */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Controller
            name="origin"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth sx={{ minWidth: 120 }}>
                <InputLabel>Kota Asal</InputLabel>
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
                <InputLabel>Kota Tujuan</InputLabel>
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

        {/* Operator */}
        <Controller
          name="operator"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel>Operator</InputLabel>
              <Select {...field}>
                <MenuItem value="">
                  <em>Semua operator</em>
                </MenuItem>
                {operators.map((op) => (
                  <MenuItem key={op} value={op}>
                    {op}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />

        {/* Departure Time */}
        <Controller
          name="departureTime"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel>Jam Keberangkatan</InputLabel>
              <Select {...field}>
                <MenuItem value="">
                  <em>Semua jam</em>
                </MenuItem>
                {departureTimes.map((time) => (
                  <MenuItem key={time} value={time}>
                    {time}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />

        {/* Price Range */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Controller
            name="minPrice"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Harga Minimal"
                type="number"
                placeholder="Rp100.000"
                error={!!errors.minPrice}
                helperText={errors.minPrice?.message}
                fullWidth
              />
            )}
          />

          <Controller
            name="maxPrice"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Harga Maksimal"
                type="number"
                placeholder="Rp200.000"
                error={!!errors.maxPrice}
                helperText={errors.maxPrice?.message}
                fullWidth
              />
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
              label="Tanggal Berangkat"
              type="date"
              InputLabelProps={{ shrink: true }}
              error={!!errors.departureDate}
              helperText={errors.departureDate?.message}
              fullWidth
            />
          )}
        />

        {/* Buttons */}
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            type="button"
            variant="outlined"
            onClick={handleReset}
            fullWidth
          >
            Reset Filter
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!isValid || isSubmitting}
            fullWidth
          >
            {isSubmitting ? "Mencari..." : "Cari Shuttle"}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default SearchForm;
