// Vercel serverless function for job search
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Mock job data
    const mockJobs = [
      {
        id: 1,
        title: "Senior Software Engineer",
        company: "Tech Corp",
        location: "San Francisco, CA",
        salary: "$120,000 - $180,000",
        type: "Full-time",
        description: "We are looking for a senior software engineer to join our team...",
        requirements: ["Python", "React", "AWS", "5+ years experience"],
        posted_date: "2024-01-15",
        landing_page: "https://techcorp.com/careers",
        tags: ["Python", "React", "AWS", "Senior"]
      },
      {
        id: 2,
        title: "Frontend Developer",
        company: "StartupXYZ",
        location: "Remote",
        salary: "$80,000 - $120,000",
        type: "Full-time",
        description: "Join our growing startup as a frontend developer...",
        requirements: ["JavaScript", "React", "CSS", "2+ years experience"],
        posted_date: "2024-01-14",
        landing_page: "https://startupxyz.com/jobs",
        tags: ["JavaScript", "React", "Frontend"]
      },
      {
        id: 3,
        title: "DevOps Engineer",
        company: "CloudTech",
        location: "Austin, TX",
        salary: "$100,000 - $150,000",
        type: "Full-time",
        description: "We need a DevOps engineer to help scale our infrastructure...",
        requirements: ["Docker", "Kubernetes", "AWS", "CI/CD"],
        posted_date: "2024-01-13",
        landing_page: "https://cloudtech.com/careers",
        tags: ["DevOps", "Kubernetes", "Docker", "CI/CD"]
      }
    ];

    // Extract query parameters
    const { page = 0, keyword = '', location = '', job_type = 'full_time' } = req.query;

    // Filter jobs based on keyword if provided
    let filteredJobs = mockJobs;
    if (keyword) {
      const keywordLower = keyword.toLowerCase();
      filteredJobs = mockJobs.filter(job => 
        job.title.toLowerCase().includes(keywordLower) ||
        job.company.toLowerCase().includes(keywordLower) ||
        job.tags.some(tag => tag.toLowerCase().includes(keywordLower))
      );
    }

    // Pagination
    const jobsPerPage = 10;
    const startIdx = parseInt(page) * jobsPerPage;
    const endIdx = startIdx + jobsPerPage;
    const pageJobs = filteredJobs.slice(startIdx, endIdx);
    const pageCount = Math.ceil(filteredJobs.length / jobsPerPage);

    // Return the response in the same format as expected
    const response = {
      page_count: pageCount,
      page: parseInt(page),
      jobs: pageJobs,
      total_jobs: filteredJobs.length,
      source: "Mock Data (Node.js API)"
    };

    res.status(200).json(response);

  } catch (error) {
    console.error('Error in jobs API:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
