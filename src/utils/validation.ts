import { z } from 'zod';

const isDateInFutureOrToday = (dateString: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const inputDate = new Date(dateString);
  inputDate.setHours(0, 0, 0, 0);
  return inputDate >= today;
};

export const shuttleSearchSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi'),
  origin: z.string().min(1, 'Kota asal wajib dipilih'),
  destination: z.string().min(1, 'Kota tujuan wajib dipilih'),
  departureDate: z.string().min(1, 'Tanggal berangkat wajib dipilih').refine(isDateInFutureOrToday, {
    message: 'Tanggal berangkat harus hari ini atau di masa depan',
  }),
}).refine((data) => {
  if (data.origin && data.destination && data.origin === data.destination) {
    return false;
  }
  return true;
}, {
  message: 'Kota asal dan tujuan tidak boleh sama',
  path: ['destination'],
});

export type ShuttleSearchFormData = z.infer<typeof shuttleSearchSchema>;
