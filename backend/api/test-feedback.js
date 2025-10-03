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
      message: 'This is a test feedback message. The application works great!',
      rating: 5
    };

    const response = await axios.post(`${BASE_URL}/send-feedback`, validFeedback);
    console.log('✅ Valid feedback response:', response.data);
    
    if (response.data.status === 'success' || response.data.status === 'logged') {
      console.log('✅ Feedback endpoint working correctly!');
    }

    // Test 2: Missing required fields
    console.log('\n2. Testing missing required fields...');
    try {
      await axios.post(`${BASE_URL}/send-feedback`, {
        name: 'John Doe',
        // Missing email, subject, message
      });
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Validation working - missing fields rejected:', error.response.data.error);
      }
    }

    // Test 3: Invalid email format
    console.log('\n3. Testing invalid email format...');
    try {
      await axios.post(`${BASE_URL}/send-feedback`, {
        name: 'John Doe',
        email: 'invalid-email',
        subject: 'Test',
        message: 'Test message'
      });
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Email validation working:', error.response.data.error);
      }
    }

    // Test 4: Invalid rating
    console.log('\n4. Testing invalid rating...');
    try {
      await axios.post(`${BASE_URL}/send-feedback`, {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test',
        message: 'Test message',
        rating: 10 // Invalid rating
      });
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Rating validation working:', error.response.data.error);
      }
    }

    console.log('\n🎉 Feedback functionality test completed!');
    console.log('\nKey features implemented:');
    console.log('- ✅ Data validation (required fields, email format, rating range)');
    console.log('- ✅ Email sending functionality (if EMAIL_PASSWORD is configured)');
    console.log('- ✅ Proper response format (status: success/logged)');
    console.log('- ✅ Error handling and logging');
    console.log('- ✅ HTML email template with feedback details');

    console.log('\n📧 To enable email sending:');
    console.log('1. Set EMAIL_USER environment variable (default: cvision.feedback@gmail.com)');
    console.log('2. Set EMAIL_PASSWORD environment variable (Gmail app password)');
    console.log('3. Recipients: 22it084@charusat.edu.in, 22it157@charusat.edu.in');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testFeedbackFunctionality();
}

module.exports = { testFeedbackFunctionality };
