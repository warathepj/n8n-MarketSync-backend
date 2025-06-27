import data from './db.json' with { type: 'json' };

console.log('Data loaded from db.json:', data);

let todayData = data.filter(booking => {
  const bookingDate = new Date(booking.timestamp);
  const today = new Date();
  return bookingDate.getUTCFullYear() === today.getUTCFullYear() &&
         bookingDate.getUTCMonth() === today.getUTCMonth() &&
         bookingDate.getUTCDate() === today.getUTCDate();
});

console.log('Bookings for today:', todayData);