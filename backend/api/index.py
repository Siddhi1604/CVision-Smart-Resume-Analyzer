import sys
import os

# Add the backend directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file)) 
backend_dir = os.path.dirname(current_dir)
sys.path.insert(0, backend_dir)

# Set environment variables for Vercel deployment
os.environ["VERCEL"] = "1"

try:
    # Import the FastAPI app
    from main import app
    from mangum import Mangum
    
    # Vercel serverless function handler
    handler = Mangum(app, lifespan="off")
    
    print("Backend handler initialized successfully")
    
except Exception as e:
    print(f"Error initializing backend: {e}")
    import traceback
    traceback.print_exc()
    
    # Fallback handler
    def handler(event, context):
        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": f'{{"error": "Backend initialization failed: {str(e)}"}}'
        }