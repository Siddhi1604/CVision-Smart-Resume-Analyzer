// Test script to verify feedback functionality
const axios = require('axios');

const BASE_URL = 'http://localhost:3000'; // Change this to your deployed URL for testing

async function testFeedbackFunctionality() {
  console.log('Testing Feedback Functionality...\n');

  try {
    // Test 1: Valid feedback submission
    console.log('1. Testing valid feedback submission...');
    const validFeedback = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      subject: 'Feedback - general',
      message: 'This is a test feedback message. The CVision application is working great!',
      rating: 5
    };

    const response = await axios.post(`${BASE_URL}/send-feedback`, validFeedback);
    console.log('✅ Valid feedback response:', response.data);

    // Test 2: Missing required fields
    console.log('\n2. Testing missing required fields...');
    try {
      const invalidFeedback = {
        name: 'John Doe',
        // Missing email, subject, message
        rating: 5
      };
      await axios.post(`${BASE_URL}/send-feedback`, invalidFeedback);
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Missing fields validation working:', error.response.data);
      } else {
        console.log('❌ Unexpected error:', error.response?.data);
      }
    }

    // Test 3: Invalid email format
    console.log('\n3. Testing invalid email format...');
    try {
      const invalidEmailFeedback = {
        name: 'John Doe',
        email: 'invalid-email',
        subject: 'Feedback - general',
        message: 'Test message',
        rating: 5
      };
      await axios.post(`${BASE_URL}/send-feedback`, invalidEmailFeedback);
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Email validation working:', error.response.data);
      } else {
        console.log('❌ Unexpected error:', error.response?.data);
      }
    }

    // Test 4: Invalid rating
    console.log('\n4. Testing invalid rating...');
    try {
      const invalidRatingFeedback = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        subject: 'Feedback - general',
        message: 'Test message',
        rating: 10 // Invalid rating
      };
      await axios.post(`${BASE_URL}/send-feedback`, invalidRatingFeedback);
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Rating validation working:', error.response.data);
      } else {
        console.log('❌ Unexpected error:', error.response?.data);
      }
    }

    // Test 5: Feedback without rating (should work)
    console.log('\n5. Testing feedback without rating...');
    const feedbackWithoutRating = {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      subject: 'Feedback - bug report',
      message: 'I found a bug in the resume analyzer. Please fix it.'
    };

    const responseNoRating = await axios.post(`${BASE_URL}/send-feedback`, feedbackWithoutRating);
    console.log('✅ Feedback without rating response:', responseNoRating.data);

    console.log('\n🎉 Feedback functionality test completed!');
    console.log('\n📧 Email Configuration:');
    console.log('- Set EMAIL_USER environment variable for sender email');
    console.log('- Set EMAIL_PASSWORD environment variable for Gmail app password');
    console.log('- Recipients: 22it084@charusat.edu.in, 22it157@charusat.edu.in');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testFeedbackFunctionality();
}

module.exports = { testFeedbackFunctionality };
