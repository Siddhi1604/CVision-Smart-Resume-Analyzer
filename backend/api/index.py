import sys
import os

# Add the backend directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.dirname(current_dir)
sys.path.insert(0, backend_dir)

# Set environment variables for Vercel deployment
os.environ["VERCEL"] = "1"

# Import the FastAPI app
from main import app
from mangum import Mangum

# Vercel serverless function handler
handler = Mangum(app)