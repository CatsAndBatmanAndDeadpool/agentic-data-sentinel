# Agentic Data Sentinel API Gateway (Node.js)

The central ingress and security layer for the Agentic Data Sentinel platform.

## 🚀 Technologies
- **Node.js + Express**: Scalable backend hub.
- **Multer**: Robust middleware for handling multipart/form-data (file uploads).
- **Helmet**: Essential security header management.
- **Axios**: Promised-based HTTP client for service-to-service communication.

## 🛠️ Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the service:
   ```bash
   node src/index.js
   ```

## 🔐 Security Features
- **CORS Configuration**: Restricts access to authorized origins.
- **Content Security Policy**: Implemented via Helmet.
- **File Validation**: Basic checks on uploaded file types before proxying.

## 📡 Gateway Routes
- `POST /api/analyze`: Receives file from frontend, proxies to Python AI Core.
- `GET /api/status/:job_id`: Retrieves analysis status from Python AI Core.
