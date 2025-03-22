const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = 3000;

app.get('/get-availability-status', async (req, res) => {
    try {
        const response = await fetch('YOUR_ICAL_URL'); // Replace with your public iCloud calendar URL
        const text = await response.text();
        const status = determineAvailability(text);
        res.json({ status });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching availability status' });
    }
});

function determineAvailability(icalData) {
    // Implement your logic to parse the iCal data and determine the current availability status
    return 'available'; // Replace with actual status determination
}

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

