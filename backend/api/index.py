import sys
import os
import json

# Add the backend directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.dirname(current_dir)
sys.path.insert(0, backend_dir)

# Set environment variables for Vercel deployment
os.environ["VERCEL"] = "1"

# Custom handler that bypasses Mangum issues
def handler(event, context):
    try:
        # Import FastAPI inside handler to avoid startup issues
        from main import app
        
        # Simple request/response mapping
        path = event.get('path', '')
        method = event.get('httpMethod', event.get('method', 'GET'))
        
        # Handle specific routes
        if path == '/health':
            return {
                "statusCode": 200,
                "headers": {"Content-Type": "application/json"},
                "body": json.dumps({"status": "ok", "message": "Backend is working!"})
            }
        
        # Import FastAPI test client
        from fastapi.testclient import TestClient
        client = TestClient(app)
        
        # Convert Vercel event to FastAPI request
        headers = event.get('headers', {})
        query_string = event.get('queryString', '')
        
        response = client.request(
            method=method,
            url=path,
            headers=headers,
            params=query_string.split('&') if query_string else [],
            data=event.get('body', '') if event.get('body') else None
        )
        
        return {
            "statusCode": response.status_code,
            "headers": {"Content-Type": "application/json"},
            "body": response.text
        }
        
    except Exception as e:
        print(f"Handler error: {str(e)}")
        import traceback
        traceback.print_exc()
        
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"error": str(e)})
        }