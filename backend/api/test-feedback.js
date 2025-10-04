const axios = require('axios');

// Test the feedback functionality
async function testFeedback() {
  try {
    console.log('🧪 Testing CVision Feedback System...');
    console.log('=====================================');
    
    const testFeedback = {
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Feedback',
      message: 'This is a test feedback message to verify the email functionality is working correctly. The system should send this to the configured recipients.',
      rating: 5
    };

    console.log('📧 Sending test feedback:');
    console.log('   Name:', testFeedback.name);
    console.log('   Email:', testFeedback.email);
    console.log('   Subject:', testFeedback.subject);
    console.log('   Rating:', testFeedback.rating);
    console.log('   Message:', testFeedback.message.substring(0, 50) + '...');
    console.log('');
    
    const response = await axios.post('http://localhost:3000/send-feedback', testFeedback, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Response received:');
    console.log('   Status:', response.status);
    console.log('   Message:', response.data.message);
    console.log('   Status Code:', response.data.status);
    
    if (response.data.status === 'success') {
      console.log('');
      console.log('🎉 Feedback functionality is working correctly!');
      console.log('📬 Check the email inboxes:');
      console.log('   - 22it084@charusat.edu.in');
      console.log('   - 22it157@charusat.edu.in');
      console.log('');
      console.log('📧 Email sent from: vescart11@gmail.com');
    } else {
      console.log('❌ Feedback functionality test failed');
    }

  } catch (error) {
    console.error('❌ Test failed:');
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Error:', error.response.data?.error || error.response.data);
    } else {
      console.error('   Error:', error.message);
    }
  }
}

// Test validation errors
async function testValidation() {
  console.log('');
  console.log('🧪 Testing Validation...');
  console.log('========================');
  
  const invalidTests = [
    {
      name: 'Missing Name',
      data: { email: 'test@example.com', message: 'Test message' },
      expectedError: 'Name, email, and message are required fields'
    },
    {
      name: 'Invalid Email',
      data: { name: 'Test User', email: 'invalid-email', message: 'Test message' },
      expectedError: 'Please provide a valid email address'
    },
    {
      name: 'Short Message',
      data: { name: 'Test User', email: 'test@example.com', message: 'Hi' },
      expectedError: 'Message must be at least 10 characters long'
    },
    {
      name: 'Invalid Rating',
      data: { name: 'Test User', email: 'test@example.com', message: 'Test message', rating: 6 },
      expectedError: 'Rating must be between 1 and 5'
    }
  ];

  for (const test of invalidTests) {
    try {
      console.log(`Testing: ${test.name}`);
      await axios.post('http://localhost:3000/send-feedback', test.data);
      console.log('❌ Expected validation error but got success');
    } catch (error) {
      if (error.response && error.response.data.error === test.expectedError) {
        console.log('✅ Validation working correctly');
      } else {
        console.log('❌ Unexpected error:', error.response?.data?.error);
      }
    }
  }
}

// Run the tests
async function runTests() {
  await testFeedback();
  await testValidation();
  
  console.log('');
  console.log('🏁 Testing completed!');
  console.log('Make sure your backend server is running on http://localhost:3000');
}

runTests();
