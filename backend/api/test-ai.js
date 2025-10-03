// Test script to verify AI functionality
const axios = require('axios');

const BASE_URL = 'http://localhost:3000'; // Change this to your deployed URL for testing

async function testAIFunctionality() {
  console.log('Testing AI Resume Analyzer...\n');

  try {
    // Test health endpoint to check AI status
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health endpoint:', healthResponse.data);
    
    if (healthResponse.data.ai_enabled) {
      console.log('🤖 AI is enabled and ready!');
    } else {
      console.log('⚠️  AI is not enabled - check OPENROUTER_API_KEY environment variable');
      return;
    }

    // Test AI resume analysis with text input
    console.log('\n2. Testing AI resume analysis...');
    const aiAnalysisResponse = await axios.post(`${BASE_URL}/ai-analyze-resume`, {
      job_category: 'Technology',
      job_role: 'Software Engineer',
      user_id: 'test_user_ai',
      text: `John Doe
Software Engineer
Email: john@example.com
Phone: 555-1234

SUMMARY:
Experienced software engineer with 5+ years of experience in full-stack development. Passionate about building scalable applications and leading technical teams.

EXPERIENCE:
Senior Software Engineer | TechCorp Inc. | 2020-2024
- Led development of microservices architecture serving 1M+ users
- Implemented CI/CD pipelines reducing deployment time by 60%
- Mentored 3 junior developers and conducted code reviews
- Technologies: Python, JavaScript, React, Node.js, AWS, Docker

Software Engineer | StartupXYZ | 2018-2020
- Developed REST APIs and database schemas
- Built responsive web applications using React and Redux
- Collaborated with product team to define technical requirements
- Technologies: JavaScript, Python, PostgreSQL, Git

SKILLS:
- Programming Languages: Python, JavaScript, Java, SQL
- Frameworks: React, Node.js, Express, Django
- Cloud & DevOps: AWS, Docker, Kubernetes, Jenkins
- Databases: PostgreSQL, MongoDB, Redis
- Tools: Git, Linux, VS Code, JIRA

EDUCATION:
Bachelor of Science in Computer Science
University of Technology | 2014-2018

CERTIFICATIONS:
- AWS Certified Solutions Architect
- Google Cloud Professional Developer`
    });
    
    console.log('✅ AI Analysis completed:', {
      ats_score: aiAnalysisResponse.data.ats_score,
      keyword_match: aiAnalysisResponse.data.keyword_match.score,
      suggestions_count: aiAnalysisResponse.data.suggestions.length,
      analysis_type: 'AI-powered'
    });

    // Test user analyses endpoint to see AI analysis
    console.log('\n3. Testing user analyses retrieval...');
    const analysesResponse = await axios.get(`${BASE_URL}/user-analyses/test_user_ai`);
    console.log('✅ User analyses:', analysesResponse.data.analyses.length, 'analyses found');
    
    const aiAnalyses = analysesResponse.data.analyses.filter(a => a.analysis_type === 'ai');
    console.log('🤖 AI analyses:', aiAnalyses.length, 'found');

    console.log('\n🎉 AI functionality test completed successfully!');
    console.log('\nKey differences between Standard and AI analysis:');
    console.log('- Standard: Rule-based scoring algorithms');
    console.log('- AI: GPT-4o-mini powered intelligent analysis');
    console.log('- AI: More contextual and nuanced suggestions');
    console.log('- AI: Better understanding of resume content');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    
    if (error.response?.status === 503) {
      console.log('\n💡 To enable AI analysis:');
      console.log('1. Get an API key from https://openrouter.ai/');
      console.log('2. Set OPENROUTER_API_KEY environment variable');
      console.log('3. Redeploy your application');
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testAIFunctionality();
}

module.exports = { testAIFunctionality };
