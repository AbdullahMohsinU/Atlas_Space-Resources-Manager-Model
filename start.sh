#!/bin/bash
# ╔═══════════════════════════════════════════════╗
# ║     ATLAS Space Monitoring Platform           ║
# ║     Startup Script                            ║
# ╚═══════════════════════════════════════════════╝

echo "╔═══════════════════════════════════════════════╗"
echo "║     🚀 ATLAS Space Monitoring Platform        ║"
echo "║     Starting all services...                  ║"
echo "╚═══════════════════════════════════════════════╝"
echo ""

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Start Backend
echo "[ATLAS] Starting Backend Server (port 8002)..."
cd "$SCRIPT_DIR/backend"
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8002 --reload &
BACKEND_PID=$!
echo "[ATLAS] Backend PID: $BACKEND_PID"

# Wait for backend
sleep 3

# Start Frontend
echo "[ATLAS] Starting Frontend Dev Server (port 5173)..."
cd "$SCRIPT_DIR/frontend"
npm run dev &
FRONTEND_PID=$!
echo "[ATLAS] Frontend PID: $FRONTEND_PID"

echo ""
echo "╔═══════════════════════════════════════════════╗"
echo "║  Backend:  http://localhost:8002              ║"
echo "║  Frontend: http://localhost:5173              ║"
echo "║  Press Ctrl+C to stop all services            ║"
echo "╚═══════════════════════════════════════════════╝"

trap "echo ''; echo '[ATLAS] Shutting down...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" SIGINT SIGTERM

wait
