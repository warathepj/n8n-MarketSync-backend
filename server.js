const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios'); // Added axios
const fs = require('fs'); // Import fs module
const cron = require('node-cron'); // Import node-cron

const app = express();
const port = 3001; // Or any other port you prefer for the backend

app.use(cors());
app.use(bodyParser.json());

console.log('Current UTC Date:', new Date().toISOString()); // Log current UTC date

// Function to fetch today's data
async function getTodayBookings() {
  const dbPath = './db.json';
  const webhookUrl = 'http://localhost:5678/webhook-test/3a0b65c7-08e6-411c-8d73-7335fad620b2'; // Define webhookUrl here
  try {
    let dbData = [];
    if (fs.existsSync(dbPath)) {
      const fileContent = fs.readFileSync(dbPath, 'utf8');
      if (fileContent) {
        dbData = JSON.parse(fileContent);
      }
    }

    let todayData = dbData.filter(booking => {
      const bookingDate = new Date(booking.timestamp);
      const today = new Date();
      return bookingDate.getUTCFullYear() === today.getUTCFullYear() &&
             bookingDate.getUTCMonth() === today.getUTCMonth() &&
             bookingDate.getUTCDate() === today.getUTCDate();
    });

    console.log('Bookings for today (scheduled fetch):', todayData);

    // Send today's bookings to the webhook with a source indicator
    if (todayData.length > 0) {
      const payload = {
        source: 'cron_job',
        bookings: todayData
      };
      const webhookResponse = await axios.post(webhookUrl, payload);
      console.log('Webhook response for scheduled bookings:', webhookResponse.data);
    } else {
      console.log('No bookings for today to send to webhook.');
    }

    return todayData;
  } catch (error) {
    console.error('Error fetching or sending today\'s bookings:', error.message);
    return [];
  }
}

// Schedule the task to run every day at 10:40 AM
cron.schedule('40 15 * * *', () => {
  console.log('Running scheduled task to fetch today\'s bookings...');
  getTodayBookings();
}, {
  timezone: "Asia/Bangkok" // Set timezone to Asia/Bangkok
});

// Initial fetch when the server starts
getTodayBookings();


app.post('/submit-booking', async (req, res) => { // Made the function async
  const { boothId, name, contact, boothType, eventDetails } = req.body;
  console.log('Booking submitted for booth:', boothId);
  console.log('Name:', name);
  console.log('Contact:', contact);
  console.log('Booth Type:', boothType); // Log booth type
  console.log('Event Details:', eventDetails); // Log event details

  const webhookUrl = 'http://localhost:5678/webhook-test/3a0b65c7-08e6-411c-8d73-7335fad620b2';
  const dbPath = './db.json';

  try {
    // Read existing data from db.json
    let dbData = [];
    if (fs.existsSync(dbPath)) {
      const fileContent = fs.readFileSync(dbPath, 'utf8');
      if (fileContent) {
        dbData = JSON.parse(fileContent);
      }
    }

    // Append new booking data
    dbData.push({ boothId, name, contact, boothType, eventDetails, timestamp: new Date().toISOString() });

    // Write updated data back to db.json
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), 'utf8');
    console.log('Booking data saved to db.json');

    const webhookResponse = await axios.post(webhookUrl, { boothId, name, contact, boothType, eventDetails }); // Include boothType and eventDetails in webhook payload
    console.log('Webhook response:', webhookResponse.data);
    res.status(200).send('Booking received successfully and forwarded to webhook!');
  } catch (error) {
    console.error('Error processing booking:', error.message);
    res.status(500).send('Failed to process booking.');
  }
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});

// TODO add 1 day from server code
