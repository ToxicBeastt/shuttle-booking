import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { Shuttle, useShuttleStore } from '../stores/shuttleStore';
import ShuttleSearchForm from '../components/ShuttleSearchForm';
import ShuttleList from '../components/ShuttleList';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';

const PassengerPage: React.FC = () => {
  const navigate = useNavigate();
  const { data, error, isLoading } = useSWR('/data/shuttles.json', (url) => fetch(url).then(res => res.json()));
  const { filteredShuttles, searchCriteria, setShuttles, search, resetSearch } = useShuttleStore();
  const [selectedShuttle, setSelectedShuttle] = useState<Shuttle | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const formData = useShuttleStore(state => state.formData);
  const setFormData = useShuttleStore(state => state.setFormData);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

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
    // Save form data + shuttle ID to localStorage
    const formData = localStorage.getItem('passengerFormData');
    if (formData) {
      const data = JSON.parse(formData);
      localStorage.setItem('passengerData', JSON.stringify({ ...data, shuttleId: shuttle.id, time }));
    }
  };

  const handleConfirmBooking = async () => {
    setBookingStatus('loading');
    // Simulate loading state 800-1200ms
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setBookingStatus('success');
    // Reset form and selections after booking
    resetSearch();
    setSelectedShuttle(null);
    setSelectedTime('');
  };

  const handleCloseDialog = () => {
    setSelectedShuttle(null);
    setSelectedTime('');
    setBookingStatus('idle');
  };

  if (error) return <div>Failed to load data</div>;

  return (
    <div className="App min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Passenger Page</h1>
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
        <Dialog open={!!selectedShuttle && !!selectedTime && bookingStatus !== 'success'} onClose={handleCloseDialog}>
          <DialogTitle>Ringkasan Pemesanan</DialogTitle>
          <DialogContent>
            <Box sx={{ mb: 2 }}>
              <Typography><strong>Nama Penumpang:</strong> {formData?.name || ''}</Typography>
              <Typography><strong>Kota Asal → Kota Tujuan:</strong> {selectedShuttle?.origin} → {selectedShuttle?.destination}</Typography>
              <Typography><strong>Tanggal Berangkat:</strong> {selectedShuttle?.date || ''}</Typography>
              <Typography><strong>Jam Keberangkatan:</strong> {selectedTime}</Typography>
              <Typography><strong>Harga Tiket:</strong> Rp{selectedShuttle?.price.toLocaleString()}</Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Batal</Button>
            <Button onClick={handleConfirmBooking} variant="contained" disabled={bookingStatus === 'loading'}>
              {bookingStatus === 'loading' ? 'Memproses...' : 'Konfirmasi Booking'}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={bookingStatus === 'success'} onClose={() => navigate('/')}>
          <DialogContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="primary">
              Terima kasih, booking Anda berhasil!
            </Typography>
            <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 2 }}>
              Kembali ke Beranda
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default PassengerPage;
