export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

export const getTodayISO = (): string => {
  const now = new Date();
  // Adjust for Asia/Jakarta timezone (UTC+7)
  const jakartaTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  return jakartaTime.toISOString().split("T")[0];
};
