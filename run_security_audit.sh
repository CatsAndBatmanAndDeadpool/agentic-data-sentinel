#!/bin/bash
echo "Running Local Security Audit..."

# 1. Python SAST
echo "--- Running Bandit (SAST) ---"
venv/bin/pip install bandit &> /dev/null
venv/bin/bandit -r backend-python/app

# 2. Python SCA
echo "--- Running Safety (SCA) ---"
venv/bin/pip install safety &> /dev/null
venv/bin/safety check -r backend-python/requirements.txt

# 3. Node Audit
echo "--- Running npm audit ---"
cd backend-node && npm audit
cd ..

echo "Audit Complete."
