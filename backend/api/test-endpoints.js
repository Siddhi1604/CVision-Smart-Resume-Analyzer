// Simple test script to verify the backend endpoints work
const axios = require('axios');

const BASE_URL = 'http://localhost:3000'; // Change this to your deployed URL for testing

async function testEndpoints() {
  console.log('Testing CVision Backend Endpoints...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health endpoint:', healthResponse.data);

    // Test job categories endpoint
    console.log('\n2. Testing job categories endpoint...');
    const categoriesResponse = await axios.get(`${BASE_URL}/job-categories`);
    console.log('✅ Job categories:', categoriesResponse.data);

    // Test job roles endpoint
    console.log('\n3. Testing job roles endpoint...');
    const rolesResponse = await axios.get(`${BASE_URL}/job-roles`);
    console.log('✅ Job roles:', Object.keys(rolesResponse.data.Technology));

    // Test user analyses endpoint
    console.log('\n4. Testing user analyses endpoint...');
    const analysesResponse = await axios.get(`${BASE_URL}/user-analyses/default_user`);
    console.log('✅ User analyses:', analysesResponse.data.analyses.length, 'analyses found');

    // Test resume analysis with text input
    console.log('\n5. Testing resume analysis endpoint...');
    const analysisResponse = await axios.post(`${BASE_URL}/analyze-resume`, {
      job_category: 'Technology',
      job_role: 'Software Engineer',
      user_id: 'test_user',
      text: 'John Doe\nSoftware Engineer\nEmail: john@example.com\nPhone: 555-1234\n\nExperience:\n- Developed web applications using JavaScript, React, and Node.js\n- Worked with databases including MySQL and MongoDB\n- Implemented REST APIs and microservices\n\nSkills:\n- JavaScript, Python, Java\n- React, Node.js, Express\n- Git, Docker, AWS\n- SQL, NoSQL databases'
    });
    console.log('✅ Resume analysis:', {
      ats_score: analysisResponse.data.ats_score,
      keyword_match: analysisResponse.data.keyword_match.score,
      suggestions_count: analysisResponse.data.suggestions.length
    });

    console.log('\n🎉 All tests passed! Backend is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testEndpoints();
}

module.exports = { testEndpoints };
