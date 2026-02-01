#!/bin/bash

# Agentic Data Sentinel - Stop Demo Script

echo "🛑 Stopping all Agentic Data Sentinel servers..."

# Find and kill processes on the demo ports
# 5173: Frontend (Vite)
# 3000: Node Gateway
# 8000: Python AI Core

PIDS=$(lsof -t -i :5173 -i :3000 -i :8000)

if [ -z "$PIDS" ]; then
    echo "⚠️ No running servers found on ports 5173, 3000, or 8000."
else
    echo "Stopping processes: $PIDS"
    echo "$PIDS" | xargs kill -9
    echo "✅ All servers stopped successfully."
fi
