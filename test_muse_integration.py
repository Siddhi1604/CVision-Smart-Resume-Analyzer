#!/usr/bin/env python3
"""
Test script for The Muse API integration
Run this script to verify the backend API endpoints are working correctly
"""

import asyncio
import httpx
import json

async def test_muse_integration():
    """Test the Muse API integration endpoints"""
    base_url = "http://localhost:8000"
    
    print("🧪 Testing The Muse API Integration")
    print("=" * 50)
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            # Test 1: Search jobs endpoint
            print("\n1. Testing /api/jobs endpoint...")
            response = await client.get(f"{base_url}/api/jobs?page=0")
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Jobs endpoint working! Found {len(data.get('jobs', []))} jobs")
                print(f"   Page: {data.get('page', 0) + 1} of {data.get('page_count', 0)}")
                
                # Show first job if available
                if data.get('jobs'):
                    first_job = data['jobs'][0]
                    print(f"   Sample job: {first_job.get('title', 'N/A')} at {first_job.get('company', 'N/A')}")
            else:
                print(f"❌ Jobs endpoint failed: {response.status_code}")
                print(f"   Error: {response.text}")
                
        except httpx.ConnectError:
            print("❌ Could not connect to backend server")
            print("   Make sure the backend is running on http://localhost:8000")
            return
        except Exception as e:
            print(f"❌ Error testing jobs endpoint: {e}")
            
        try:
            # Test 2: Search jobs with filters
            print("\n2. Testing /api/jobs with filters...")
            response = await client.get(f"{base_url}/api/jobs?page=0&location=Remote")
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Filtered search working! Found {len(data.get('jobs', []))} remote jobs")
            else:
                print(f"❌ Filtered search failed: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Error testing filtered search: {e}")
            
        try:
            # Test 3: Companies endpoint
            print("\n3. Testing /api/companies endpoint...")
            response = await client.get(f"{base_url}/api/companies?page=0")
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Companies endpoint working! Found {len(data.get('companies', []))} companies")
                
                # Show first company if available
                if data.get('companies'):
                    first_company = data['companies'][0]
                    print(f"   Sample company: {first_company.get('name', 'N/A')}")
            else:
                print(f"❌ Companies endpoint failed: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Error testing companies endpoint: {e}")
            
        try:
            # Test 4: Health check
            print("\n4. Testing health endpoint...")
            response = await client.get(f"{base_url}/health")
            
            if response.status_code == 200:
                print("✅ Backend server is healthy!")
            else:
                print(f"❌ Health check failed: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Error testing health endpoint: {e}")
    
    print("\n" + "=" * 50)
    print("🎉 Integration test completed!")
    print("\nNext steps:")
    print("1. Start the frontend: cd frontend && npm start")
    print("2. Visit http://localhost:3000/job-search")
    print("3. Test the job search functionality")

if __name__ == "__main__":
    asyncio.run(test_muse_integration())
