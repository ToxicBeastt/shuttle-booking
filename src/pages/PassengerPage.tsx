import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { Shuttle, useShuttleStore } from '../stores/shuttleStore';
import ShuttleSearchForm from '../components/ShuttleSearchForm';
import ShuttleList from '../components/ShuttleList';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Slide,
} from '@mui/material';

const PassengerPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data, error, isLoading } = useSWR('/data/shuttles.json', (url) => fetch(url).then(res => res.json()));
  const { filteredShuttles, searchCriteria, setShuttles, search, resetSearch } = useShuttleStore();
  const [selectedShuttle, setSelectedShuttle] = useState<Shuttle | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const formData = useShuttleStore(state => state.formData);
  const setFormData = useShuttleStore(state => state.setFormData);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState<boolean>(false);

  useEffect(() => {
    if (data?.schedules) {
      setShuttles(data.schedules);
    }
  }, [data, setShuttles]);

  const handleSearch = (formData: any) => {
    setFormData(formData);
    const criteria = {
      origin: formData.origin,
      destination: formData.destination,
      date: formData.departureDate,
    };
    search(criteria);
  };

  const handleSelect = (shuttle: Shuttle, time: string) => {
    setSelectedShuttle(shuttle);
    setSelectedTime(time);
  };

  const handleConfirmBooking = () => {
    if (selectedShuttle && selectedTime && formData) {
      const booking = {
        id: Date.now().toString(),
        shuttle: selectedShuttle,
        time: selectedTime,
        passenger: formData,
        confirmedAt: new Date().toISOString(),
      };
      const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      existingBookings.push(booking);
      localStorage.setItem('bookings', JSON.stringify(existingBookings));
      setShowSuccessDialog(true);
    }
    handleCloseDialog();
  };

  const handleCloseDialog = () => {
    setSelectedShuttle(null);
    setSelectedTime('');
  };

  if (error) return <div>{t('failedToLoadData') || 'Failed to load data'}</div>;

  return (
    <div className="py-8">
      <Container className="container mx-auto px-4 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">{t('passengerPageTitle')}</h1>
          <Button variant="outlined" onClick={() => navigate('/bookings')}>
            {t('viewBookings')}
          </Button>
        </div>
        <ShuttleSearchForm onSearch={handleSearch} onFormValidChange={setIsFormValid} />
        {searchCriteria && isFormValid && (
          <ShuttleList
            shuttles={filteredShuttles}
            onSelect={handleSelect}
            isLoading={isLoading}
            searchCriteria={searchCriteria}
            onReset={resetSearch}
          />
        )}
        <Dialog
          open={!!selectedShuttle && !!selectedTime}
          onClose={handleCloseDialog}
          TransitionComponent={(props) => <Slide {...props} direction="up" timeout={300} />}
        >
          <DialogTitle>{t('bookingSummary')}</DialogTitle>
          <DialogContent>
            <Box sx={{ mb: 2 }}>
              <Typography><strong>{t('passengerName')}</strong> {formData?.name || ''}</Typography>
              <Typography><strong>{t('routeSummary')}</strong> {selectedShuttle?.origin} → {selectedShuttle?.destination}</Typography>
              <Typography><strong>{t('departureDate')}</strong> {selectedShuttle?.date || ''}</Typography>
              <Typography><strong>{t('departureTime')}</strong> {selectedTime}</Typography>
              <Typography><strong>{t('ticketPrice')}</strong> Rp{selectedShuttle?.price.toLocaleString()}</Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>{t('cancel')}</Button>
            <Button onClick={handleConfirmBooking} variant="contained">
              {t('confirmBooking')}
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={showSuccessDialog} onClose={() => setShowSuccessDialog(false)}>
          <DialogTitle>{t('bookingSuccessful')}</DialogTitle>
          <DialogContent>
            <Typography>{t('bookingConfirmed')}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowSuccessDialog(false)}>{t('close')}</Button>
            <Button onClick={() => { setShowSuccessDialog(false); navigate('/bookings'); }} variant="contained">
              {t('viewBookingsAgain')}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
};

export default PassengerPage;
