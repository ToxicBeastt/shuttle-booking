import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface Booking {
  id: string;
  shuttle: {
    id: string;
    operator: string;
    origin: string;
    destination: string;
    price: number;
    departures: string[];
    date: string;
  };
  time: string;
  passenger: {
    name?: string;
    origin?: string;
    destination?: string;
    departureDate?: string;
  };
  confirmedAt: string;
}

const BookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    setBookings(storedBookings);
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Daftar Booking
      </Typography>
      {bookings.length === 0 ? (
        <Typography variant="body1">Belum ada booking yang dikonfirmasi.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="bookings table">
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Operator</TableCell>
                <TableCell>Nama Penumpang</TableCell>
                <TableCell>Rute</TableCell>
                <TableCell>Tanggal</TableCell>
                <TableCell>Jam</TableCell>
                <TableCell>Harga</TableCell>
                <TableCell>Dikonfirmasi Pada</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking, index) => (
                <TableRow key={booking.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{booking.shuttle.operator}</TableCell>
                  <TableCell>{booking.passenger.name || 'N/A'}</TableCell>
                  <TableCell>{booking.shuttle.origin} → {booking.shuttle.destination}</TableCell>
                  <TableCell>{booking.shuttle.date}</TableCell>
                  <TableCell>{booking.time}</TableCell>
                  <TableCell>Rp{booking.shuttle.price.toLocaleString()}</TableCell>
                  <TableCell>{new Date(booking.confirmedAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Box sx={{ mt: 4 }}>
        <Button variant="contained" onClick={() => navigate('/')}>
          Kembali ke Pencarian
        </Button>
      </Box>
    </Container>
  );
};

export default BookingsPage;
