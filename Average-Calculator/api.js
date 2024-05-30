const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 8008;

// Middleware to parse JSON bodies
app.use(express.json());

app.get('/numbers', async (req, res) => {
  try {
    let { url } = req.query;

    if (!Array.isArray(url)) {
      url = [
        "http://20.244.56.144/numbers/primes",
        "http://20.244.56.144/numbers/fibo",
        "http://20.244.56.144/numbers/odd",
        "http://20.244.56.144/numbers/rand"
      ];
    }

    const requests = url.map(async (url) => {
      try {
        const response = await axios.get(url);
        return response.data.numbers;
      } catch (error) {
        console.error(`Error retrieving numbers from ${url}: ${error.message}`);
        return [];
      }
    });

    const results = await Promise.all(requests);
    const numbers = results.flat();

    const mergedNumbers = Array.from(new Set(numbers)).sort((a, b) => a - b);

    res.json({ numbers: mergedNumbers });
  } catch (error) {
    console.error(`Error processing request: ${error.message}`);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/numbers', (req, res) => {
  try {
    console.log('Received request body:', req.body);

    const { windowPrevState, windowCurrState, numbers, avg } = req.body;

    if (!Array.isArray(numbers)) {
      return res.status(400).json({ error: 'Invalid input format' });
    }

    const mergedNumbers = Array.from(new Set(numbers)).sort((a, b) => a - b);
    res.json({ numbers: mergedNumbers });
  } catch (error) {
    console.error(`Error processing request: ${error.message}`);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});