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

// Upload and Analyze Route
app.post('/api/analyze', upload.single('dataset'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  console.log(`Received file: ${req.file.originalname}`);

  try {
    // 1. Read the file
    const fileContent = fs.readFileSync(req.file.path, 'utf-8');

    // 2. Prepare payload for Python Service
    // We send the raw CSV/JSON content or the path, depending on architecture. 
    // Sending content is simpler for stateless containerization.
    const payload = {
      filename: req.file.originalname,
      content: fileContent,
      analysis_type: req.body.analysis_type || 'general'
    };

    // 3. Forward to Python AI Service
    // Note: In a real prod env, we might use a message queue (RabbitMQ/Kafka) here.
    const response = await axios.post(`${PYTHON_SERVICE_URL}/analyze`, payload);

    // 4. Cleanup temp file
    fs.unlinkSync(req.file.path);

    // 5. Return result
    res.json(response.data);

  } catch (error) {
    console.error('Error forwarding to AI Service:', error.message);
    // Cleanup even on error
    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    
    if (error.code === 'ECONNREFUSED') {
         res.status(503).json({ error: 'AI Service Unavailable' });
    } else {
         res.status(500).json({ error: 'Analysis failed' });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Node.js Gateway running on port ${PORT}`);
});
