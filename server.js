const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001; // Or any other port you prefer for the backend

app.use(cors());
app.use(bodyParser.json());

app.post('/submit-booking', (req, res) => {
  const { boothId, name, contact } = req.body;
  console.log('Booking submitted for booth:', boothId);
  console.log('Name:', name);
  console.log('Contact:', contact);
  res.status(200).send('Booking received successfully!');
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
