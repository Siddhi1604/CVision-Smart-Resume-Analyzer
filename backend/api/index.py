import json
import os

# Set environment variables for Vercel deployment
os.environ["VERCEL"] = "1"

# Start with just this simple handler
def handler(event, context):
    try:
        # Handle /health endpoint directly
        path = event.get('path', '')
        
        if path == '/health':
            return {
                "statusCode": 200,
                "headers": {"Content-Type": "application/json"},
                "body": json.dumps({"status": "ok", "message": "Backend is working!"})
            }
        
        if path == '/job-categories':
            # Hardcoded job categories response
            categories = [
                "Engineering", "Data Science", "Product", "Design", 
                "Marketing", "Sales", "Operations", "Finance",
                "Human Resources", "Customer Success", "Quality Assurance"
            ]
            return {
                "statusCode": 200,
                "headers": {"Content-Type": "application/json"},
                "body": json.dumps({"categories": categories})
            }
        
        if path == '/job-roles':
            # Hardcoded job roles response
            roles = {
                "Engineering": ["Software Engineer", "Backend Developer", "Frontend Developer", "Full Stack Developer"],
                "Data Science": ["Data Scientist", "Data Analyst", "ML Engineer", "Data Engineer"],
                "Product": ["Product Manager", "Product Owner", "Product Designer"]
            }
            return {
                "statusCode": 200,
                "headers": {"Content-Type": "application/json"},
                "body": json.dumps({"roles_by_category": roles})
            }
        
        # Default response for other endpoints
        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"message": f"Endpoint {path} is working", "info": "Using basic handler"})
        }
        
    except Exception as e:
        print(f"Handler error: {str(e)}")
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"error": str(e)})
        }