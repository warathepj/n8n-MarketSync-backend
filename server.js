const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios'); // Added axios

const app = express();
const port = 3001; // Or any other port you prefer for the backend

app.use(cors());
app.use(bodyParser.json());

app.post('/submit-booking', async (req, res) => { // Made the function async
  const { boothId, name, contact, eventDetails } = req.body;
  console.log('Booking submitted for booth:', boothId);
  console.log('Name:', name);
  console.log('Contact:', contact);
  console.log('Event Details:', eventDetails); // Log event details

  const webhookUrl = 'http://localhost:5678/webhook-test/3a0b65c7-08e6-411c-8d73-7335fad620b2';

  try {
    const webhookResponse = await axios.post(webhookUrl, { boothId, name, contact, eventDetails }); // Include eventDetails in webhook payload
    console.log('Webhook response:', webhookResponse.data);
    res.status(200).send('Booking received successfully and forwarded to webhook!');
  } catch (error) {
    console.error('Error sending data to webhook:', error.message);
    res.status(500).send('Failed to forward booking to webhook.');
  }
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
