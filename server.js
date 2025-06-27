const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios'); // Added axios
const fs = require('fs'); // Import fs module

const app = express();
const port = 3001; // Or any other port you prefer for the backend

app.use(cors());
app.use(bodyParser.json());

console.log('Current UTC Date:', new Date().toISOString()); // Log current UTC date


app.post('/submit-booking', async (req, res) => { // Made the function async
  const { boothId, name, contact, eventDetails } = req.body;
  console.log('Booking submitted for booth:', boothId);
  console.log('Name:', name);
  console.log('Contact:', contact);
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
    dbData.push({ boothId, name, contact, eventDetails, timestamp: new Date().toISOString() });

    // Write updated data back to db.json
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), 'utf8');
    console.log('Booking data saved to db.json');

    const webhookResponse = await axios.post(webhookUrl, { boothId, name, contact, eventDetails }); // Include eventDetails in webhook payload
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
