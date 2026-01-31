#!/bin/bash
echo "Setting up AIDA Lite environment..."
echo "IMPORTANT: Ensure you have an OPENAI_API_KEY ready for the AI Core."

# 1. Check Node
if ! command -v npm &> /dev/null
then
    echo "npm not found. Please install Node.js (https://nodejs.org/)"
else
    echo "npm found at $(which npm)"
    cd backend-node
    npm install
    cd ..
fi

# 2. Check Python
if ! command -v python3 &> /dev/null
then
    echo "python3 not found."
else
    echo "python3 found at $(which python3)"
    # Attempt venv
    python3 -m venv venv
    source venv/bin/activate
    
    # Check SSL
    python3 -c "import ssl; print('SSL Module Available')" || echo "SSL Module Missing! Reinstall Python."
    
    pip install -r backend-python/requirements.txt
fi
