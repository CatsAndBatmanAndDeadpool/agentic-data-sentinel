const express = require('express');
const multer = require('multer');
const axios = require('axios');
const cors = require('cors');
const helmet = require('helmet');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';

// Security & Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// File Upload Configuration
const upload = multer({ dest: 'uploads/' });

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'gateway' });
});

const FormData = require('form-data');

// Upload and Analyze Route
app.post('/api/analyze', upload.single('dataset'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  console.log(`Received file: ${req.file.originalname}`);

  try {
    // 1. Prepare FormData for Python Service
    const form = new FormData();
    form.append('file', fs.createReadStream(req.file.path), {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });
    // Append analysis_type if it's part of the request body
    if (req.body.analysis_type) {
      form.append('analysis_type', req.body.analysis_type);
    }

    // 2. Forward to Python AI Service
    const response = await axios.post(`${PYTHON_SERVICE_URL}/analyze`, form, {
      headers: {
        ...form.getHeaders()
      }
    });

    // 3. Cleanup temp file
    fs.unlinkSync(req.file.path);

    // 4. Return job_id
    res.json(response.data);

  } catch (error) {
    console.error('Error forwarding to AI Service:', error.response?.data || error.message);
    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ error: 'Failed to initiate analysis' });
  }
});

// Proxy for status
app.get('/api/status/:job_id', async (req, res) => {
  try {
    const response = await axios.get(`${PYTHON_SERVICE_URL}/status/${req.params.job_id}`);
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching status for job ${req.params.job_id}:`, error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch status' });
  }
});

app.listen(PORT, () => {
  console.log(`Node.js Gateway running on port ${PORT}`);
});
