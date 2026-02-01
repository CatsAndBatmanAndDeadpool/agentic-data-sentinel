#!/bin/bash

# Agentic Data Sentinel - Quick Start Demo Script
# Focus: Mock AI Mode

echo "🚀 Starting Agentic Data Sentinel Demo (Mock Mode)..."

# 1. Start Python AI Core in Background
echo "📡 Starting Python AI Core (Port 8000)..."
cd backend-python
source venv/bin/activate
export MOCK_AI=true
python3 -m app.main > ../ai_core.log 2>&1 &
cd ..

# 2. Start Node Gateway in Background
echo "🌐 Starting Node Gateway (Port 3000)..."
cd backend-node
npm start > ../node_gateway.log 2>&1 &
cd ..

# 3. Start Frontend
echo "✨ Starting Frontend (Port 5173)..."
echo "Open your browser at: http://localhost:5173"
cd frontend
npm run dev
