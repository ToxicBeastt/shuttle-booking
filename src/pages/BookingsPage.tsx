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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  useEffect(() => {
    const storedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    setBookings(storedBookings);
  }, []);

  return (
    <div className="py-8">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('bookingList')}
        </Typography>
        {bookings.length === 0 ? (
          <Typography variant="body1">{t('noBookingsConfirmed')}</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label={t('bookingsTable')}>
              <TableHead>
                <TableRow>
                  <TableCell>{t('no')}</TableCell>
                  <TableCell>{t('operator')}</TableCell>
                  <TableCell>{t('passengerName')}</TableCell>
                  <TableCell>{t('routeLabel')}</TableCell>
                  <TableCell>{t('date')}</TableCell>
                  <TableCell>{t('time')}</TableCell>
                  <TableCell>{t('price')}</TableCell>
                  <TableCell>{t('confirmedAt')}</TableCell>
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
      </Container>
    </div>
  );
};

export default BookingsPage;
