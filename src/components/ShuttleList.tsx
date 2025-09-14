import React, { useState } from 'react';
import { formatCurrency } from '../utils/formatters';
import { Shuttle, SearchCriteria } from '../stores/shuttleStore';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Button,
  Skeleton,
} from '@mui/material';

interface ShuttleCardProps {
  shuttle: Shuttle;
  onSelect: (shuttle: Shuttle, time: string) => void;
}

interface ShuttleListProps {
  shuttles: Shuttle[];
  onSelect: (shuttle: Shuttle, time: string) => void;
  isLoading: boolean;
  searchCriteria?: SearchCriteria;
  onReset?: () => void;
}

const LoadingSkeleton: React.FC = () => (
  <TableContainer component={Paper}>
    <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Operator</TableCell>
                  <TableCell>Rute</TableCell>
                  <TableCell>Tanggal</TableCell>
                  <TableCell>Harga</TableCell>
                  <TableCell>Jadwal Keberangkatan</TableCell>
                </TableRow>
              </TableHead>
      <TableBody>
        {[1, 2, 3].map((i) => (
          <TableRow key={i}>
            <TableCell><Skeleton width={80} /></TableCell>
            <TableCell><Skeleton width={100} /></TableCell>
            <TableCell><Skeleton width={80} /></TableCell>
            <TableCell><Skeleton width={60} /></TableCell>
            <TableCell>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Skeleton width={40} height={30} />
                <Skeleton width={40} height={30} />
              </Box>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

const EmptyState: React.FC = () => (
  <Box sx={{ textAlign: 'center', py: 6 }}>
    <Typography variant="h1" sx={{ mb: 2 }}>🚌</Typography>
    <Typography variant="h6" color="text.secondary" gutterBottom>
      Tidak ada shuttle tersedia
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
      Maaf, tidak ada shuttle yang tersedia untuk rute dan tanggal yang dipilih.
      Silakan coba dengan kriteria pencarian yang berbeda.
    </Typography>
  </Box>
);

const ShuttleRow: React.FC<ShuttleCardProps> = ({ shuttle, onSelect }) => {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    // Small delay for visual feedback
    setTimeout(() => {
      onSelect(shuttle, time);
      setSelectedTime(null);
    }, 150);
  };

  return (
    <TableRow hover>
      <TableCell sx={{ fontWeight: 'medium' }}>
        {shuttle.operator}
      </TableCell>
      <TableCell>
        {shuttle.origin} → {shuttle.destination}
      </TableCell>
      <TableCell>
        {shuttle.date}
      </TableCell>
      <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        {formatCurrency(shuttle.price)}
      </TableCell>
      <TableCell>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {shuttle.departures.map((time) => (
            <Button
              key={`${shuttle.id}-${time}`}
              onClick={() => handleTimeSelect(time)}
              disabled={selectedTime === time}
              variant={selectedTime === time ? 'contained' : 'outlined'}
              size="small"
              aria-label={`Pilih shuttle ${shuttle.operator} jam ${time}`}
            >
              {time}
              {selectedTime === time && '...'}
            </Button>
          ))}
        </Box>
      </TableCell>
    </TableRow>
  );
};



const ShuttleList: React.FC<ShuttleListProps> = ({
  shuttles,
  onSelect,
  isLoading,
  searchCriteria,
  onReset,
}) => {
  if (isLoading) {
    return (
      <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f9f9f9' }} aria-live="polite">
        <Typography variant="h5" component="h3" gutterBottom>
          Mencari Shuttle...
        </Typography>
        <LoadingSkeleton />
      </Paper>
    );
  }

  return (
    <Paper
      sx={{ p: 3, mb: 3, backgroundColor: '#f9f9f9' }}
      role="region"
      aria-label="Daftar shuttle tersedia"
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h3">
          {searchCriteria ? 'Daftar Shuttle Tersedia' : 'Shuttle Tersedia'}
        </Typography>
        {searchCriteria && (
          <Typography variant="body2" color="text.secondary">
            {searchCriteria.origin} → {searchCriteria.destination}
          </Typography>
        )}
      </Box>

      {shuttles.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }} role="status">
            Ditemukan {shuttles.length} shuttle untuk rute yang dipilih
          </Typography>
          <TableContainer component={Paper} elevation={1}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Operator</TableCell>
                  <TableCell>Rute</TableCell>
                  <TableCell>Tanggal</TableCell>
                  <TableCell>Harga</TableCell>
                  <TableCell>Jadwal Keberangkatan</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {shuttles.map((shuttle) => (
                  <ShuttleRow
                    key={shuttle.id}
                    shuttle={shuttle}
                    onSelect={onSelect}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Paper>
  );
};

export default ShuttleList;
