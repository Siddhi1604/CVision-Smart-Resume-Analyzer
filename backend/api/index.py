import sys
import os

# Add the backend directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.dirname(current_dir)
sys.path.insert(0, backend_dir)

# Set environment variables for Vercel deployment
os.environ["VERCEL"] = "1"

# Simple working handler first
def handler(event, context):
    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": '{"status": "ok", "message": "Backend is working!"}'
    }

# Try to import the full app with Vercel-compatible configuration
try:
    print("Attempting to import FastAPI app...")
    from main import app
    print("FastAPI app imported successfully")
    
    from mangum import Mangum
    print("Mangum imported successfully")
    
    # Create handler with Vercel-compatible settings
    handler = Mangum(app, lifespan=None)
    print("Mangum handler created successfully with lifespan=None")
    
except Exception as e:
    print(f"Error during import: {str(e)}")
    import traceback
    traceback.print_exc()
    
    # Keep the simple handler if import<｜tool▁call▁begin｜>
    pass