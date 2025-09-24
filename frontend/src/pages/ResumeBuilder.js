import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Code, 
  Award, 
  Download,
  Plus,
  Trash2
} from 'lucide-react';
import axios from 'axios';

const ResumeBuilder = () => {
  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      portfolio: ''
    },
    summary: '',
    experience: [],
    education: [],
    projects: [],
    skills: {
      technical: [],
      soft: [],
      languages: [],
      tools: []
    },
    template: 'Modern'
  });

  const [loading, setLoading] = useState(false);

  const templates = [
    { id: 'Modern', name: 'Modern', description: 'Clean and professional design' },
    { id: 'Professional', name: 'Professional', description: 'Traditional business style' },
    { id: 'Minimal', name: 'Minimal', description: 'Simple and elegant' },
    { id: 'Creative', name: 'Creative', description: 'Stand out with unique design' }
  ];

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        description: '',
        responsibilities: [],
        achievements: []
      }]
    }));
  };

  const updateExperience = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (index) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, {
        school: '',
        degree: '',
        field: '',
        graduationDate: '',
        gpa: '',
        achievements: []
      }]
    }));
  };

  const updateEducation = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (index) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const addProject = () => {
    setFormData(prev => ({
      ...prev,
      projects: [...prev.projects, {
        name: '',
        technologies: '',
        description: '',
        responsibilities: [],
        achievements: [],
        link: ''
      }]
    }));
  };

  const updateProject = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map((proj, i) => 
        i === index ? { ...proj, [field]: value } : proj
      )
    }));
  };

  const removeProject = (index) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  const updateSkills = (category, skills) => {
    setFormData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: skills.split('\n').filter(skill => skill.trim())
      }
    }));
  };

  const handleGenerateResume = async () => {
    if (!formData.personalInfo.fullName || !formData.personalInfo.email) {
      toast.error('Please fill in your name and email.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/build-resume', formData, {
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${formData.personalInfo.fullName.replace(/\s+/g, '_')}_resume.docx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Resume generated successfully!');
    } catch (error) {
      console.error('Error generating resume:', error);
      toast.error('Error generating resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Preview style variants per template
  const tpl = formData.template;
  const nameClass = tpl === 'Modern'
    ? 'text-2xl font-extrabold tracking-wide text-emerald-400'
    : tpl === 'Professional'
    ? 'text-xl font-bold tracking-tight text-gray-100'
    : tpl === 'Minimal'
    ? 'text-2xl font-semibold tracking-normal text-gray-200'
    : 'text-3xl font-extrabold tracking-wider text-violet-300';
  const contactClass = tpl === 'Modern'
    ? 'text-xs text-gray-300'
    : tpl === 'Professional'
    ? 'text-sm text-gray-300'
    : tpl === 'Minimal'
    ? 'text-xs text-gray-400'
    : 'text-sm text-purple-200';
  const sectionTitleClass = tpl === 'Modern'
    ? 'uppercase text-emerald-400 text-xs tracking-widest'
    : tpl === 'Professional'
    ? 'uppercase text-blue-200 text-xs tracking-widest'
    : tpl === 'Minimal'
    ? 'text-gray-300 text-sm font-medium'
    : 'text-violet-300 text-sm font-semibold italic';
  const previewShellClass = tpl === 'Modern'
    ? 'bg-black/40 border-emerald-500/40'
    : tpl === 'Professional'
    ? 'bg-black/30 border-blue-400/30'
    : tpl === 'Minimal'
    ? 'bg-transparent border-gray-600'
    : 'bg-gradient-to-br from-violet-800/20 to-fuchsia-700/10 border-violet-400/30';

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Resume Builder</h1>
          <p className="text-xl text-gray-300">
            Create your professional resume with AI-powered suggestions
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Template Selection */}
            <div className="card">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Award size={20} />
                Choose Template
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => setFormData(prev => ({ ...prev, template: template.id }))}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.template === template.id
                        ? 'border-green-400 bg-green-500/10'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <h4 className="font-semibold mb-2">{template.name}</h4>
                    <p className="text-sm text-gray-400">{template.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Personal Information */}
            <div className="card">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <User size={20} />
                Personal Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData.personalInfo.fullName}
                    onChange={(e) => handleInputChange('personalInfo', 'fullName', e.target.value)}
                    className="w-full p-3 bg-black/20 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.personalInfo.email}
                    onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                    className="w-full p-3 bg-black/20 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.personalInfo.phone}
                    onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                    className="w-full p-3 bg-black/20 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.personalInfo.location}
                    onChange={(e) => handleInputChange('personalInfo', 'location', e.target.value)}
                    className="w-full p-3 bg-black/20 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none"
                    placeholder="New York, NY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">LinkedIn</label>
                  <input
                    type="url"
                    value={formData.personalInfo.linkedin}
                    onChange={(e) => handleInputChange('personalInfo', 'linkedin', e.target.value)}
                    className="w-full p-3 bg-black/20 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none"
                    placeholder="https://linkedin.com/in/johndoe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Portfolio</label>
                  <input
                    type="url"
                    value={formData.personalInfo.portfolio}
                    onChange={(e) => handleInputChange('personalInfo', 'portfolio', e.target.value)}
                    className="w-full p-3 bg-black/20 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none"
                    placeholder="https://johndoe.dev"
                  />
                </div>
              </div>
            </div>

            {/* Professional Summary */}
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Professional Summary</h3>
              <textarea
                value={formData.summary}
                onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                className="w-full p-3 bg-black/20 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none resize-none"
                rows={4}
                placeholder="Write a brief summary highlighting your key skills and experience..."
              />
            </div>

            {/* Work Experience */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Briefcase size={20} />
                  Work Experience
                </h3>
                <button
                  onClick={addExperience}
                  className="btn btn-secondary flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add Experience
                </button>
              </div>
              
              <div className="space-y-4">
                {formData.experience.map((exp, index) => (
                  <div key={index} className="p-4 bg-black/20 rounded-lg border border-gray-600">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Experience {index + 1}</h4>
                      <button
                        onClick={() => removeExperience(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <input
                        type="text"
                        placeholder="Company Name"
                        value={exp.company}
                        onChange={(e) => updateExperience(index, 'company', e.target.value)}
                        className="w-full p-3 bg-black/20 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Position"
                        value={exp.position}
                        onChange={(e) => updateExperience(index, 'position', e.target.value)}
                        className="w-full p-3 bg-black/20 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Start Date"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                        className="w-full p-3 bg-black/20 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="End Date"
                        value={exp.endDate}
                        onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                        className="w-full p-3 bg-black/20 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none"
                      />
                    </div>
                    
                    <textarea
                      placeholder="Role description"
                      value={exp.description}
                      onChange={(e) => updateExperience(index, 'description', e.target.value)}
                      className="w-full p-3 bg-black/20 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none resize-none"
                      rows={3}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <GraduationCap size={20} />
                  Education
                </h3>
                <button
                  onClick={addEducation}
                  className="btn btn-secondary flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add Education
                </button>
              </div>
              
              <div className="space-y-4">
                {formData.education.map((edu, index) => (
                  <div key={index} className="p-4 bg-black/20 rounded-lg border border-gray-600">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Education {index + 1}</h4>
                      <button
                        onClick={() => removeEducation(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="School/University"
                        value={edu.school}
                        onChange={(e) => updateEducation(index, 'school', e.target.value)}
                        className="w-full p-3 bg-black/20 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Degree"
                        value={edu.degree}
                        onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                        className="w-full p-3 bg-black/20 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Field of Study"
                        value={edu.field}
                        onChange={(e) => updateEducation(index, 'field', e.target.value)}
                        className="w-full p-3 bg-black/20 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Graduation Date"
                        value={edu.graduationDate}
                        onChange={(e) => updateEducation(index, 'graduationDate', e.target.value)}
                        className="w-full p-3 bg-black/20 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Code size={20} />
                  Projects
                </h3>
                <button
                  onClick={addProject}
                  className="btn btn-secondary flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add Project
                </button>
              </div>
              
              <div className="space-y-4">
                {formData.projects.map((proj, index) => (
                  <div key={index} className="p-4 bg-black/20 rounded-lg border border-gray-600">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Project {index + 1}</h4>
                      <button
                        onClick={() => removeProject(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Project Name"
                        value={proj.name}
                        onChange={(e) => updateProject(index, 'name', e.target.value)}
                        className="w-full p-3 bg-black/20 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Technologies Used"
                        value={proj.technologies}
                        onChange={(e) => updateProject(index, 'technologies', e.target.value)}
                        className="w-full p-3 bg-black/20 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none"
                      />
                      <textarea
                        placeholder="Project description"
                        value={proj.description}
                        onChange={(e) => updateProject(index, 'description', e.target.value)}
                        className="w-full p-3 bg-black/20 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none resize-none"
                        rows={3}
                      />
                      <input
                        type="url"
                        placeholder="Project Link (optional)"
                        value={proj.link}
                        onChange={(e) => updateProject(index, 'link', e.target.value)}
                        className="w-full p-3 bg-black/20 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Skills</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Technical Skills</label>
                  <textarea
                    value={formData.skills.technical.join('\n')}
                    onChange={(e) => updateSkills('technical', e.target.value)}
                    className="w-full p-3 bg-black/20 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none resize-none"
                    rows={4}
                    placeholder="JavaScript&#10;Python&#10;React&#10;Node.js"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Soft Skills</label>
                  <textarea
                    value={formData.skills.soft.join('\n')}
                    onChange={(e) => updateSkills('soft', e.target.value)}
                    className="w-full p-3 bg-black/20 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none resize-none"
                    rows={4}
                    placeholder="Leadership&#10;Communication&#10;Problem Solving&#10;Teamwork"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Languages</label>
                  <textarea
                    value={formData.skills.languages.join('\n')}
                    onChange={(e) => updateSkills('languages', e.target.value)}
                    className="w-full p-3 bg-black/20 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none resize-none"
                    rows={4}
                    placeholder="English (Native)&#10;Spanish (Fluent)&#10;French (Intermediate)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tools & Technologies</label>
                  <textarea
                    value={formData.skills.tools.join('\n')}
                    onChange={(e) => updateSkills('tools', e.target.value)}
                    className="w-full p-3 bg-black/20 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none resize-none"
                    rows={4}
                    placeholder="Git&#10;Docker&#10;AWS&#10;Figma"
                  />
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateResume}
              disabled={loading}
              className="w-full btn btn-primary text-lg py-4 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full loading"></div>
                  Generating Resume...
                </>
              ) : (
                <>
                  <Download size={20} />
                  Generate Resume
                </>
              )}
            </button>
          </div>

          {/* Right Column - Preview */}
          <div className="space-y-6">
            <div className={`sticky top-24 p-5 rounded-xl border ${previewShellClass}`}>
              <h3 className="text-xl font-semibold mb-4">Resume Preview</h3>
              <div className="space-y-4">
                <div>
                  <h4 className={nameClass}>{formData.personalInfo.fullName || 'Your Name'}</h4>
                  <p className={contactClass}>{formData.personalInfo.email || 'email@example.com'}</p>
                  <p className={contactClass}>{formData.personalInfo.phone || 'Phone'}</p>
                  <p className={contactClass}>{formData.personalInfo.location || 'Location'}</p>
                </div>
                {tpl === 'Modern' && (
                  <div className="h-px bg-emerald-500/40" />
                )}
                {tpl === 'Professional' && (
                  <div className="h-px bg-blue-400/30" />
                )}
                {tpl === 'Creative' && (
                  <div className="h-0.5 bg-gradient-to-r from-violet-400/50 via-fuchsia-400/50 to-emerald-400/50 rounded-full" />
                )}

                {formData.summary && (
                  <div>
                    <h5 className={`${sectionTitleClass} mb-1`}>Summary</h5>
                    <p className="text-sm text-gray-300">{formData.summary}</p>
                  </div>
                )}

                {formData.experience.length > 0 && (
                  <div>
                    <h5 className={`${sectionTitleClass} mb-1`}>Experience</h5>
                    <p className="text-sm text-gray-300">{formData.experience.length} position(s)</p>
                  </div>
                )}

                {formData.education.length > 0 && (
                  <div>
                    <h5 className={`${sectionTitleClass} mb-1`}>Education</h5>
                    <p className="text-sm text-gray-300">{formData.education.length} degree(s)</p>
                  </div>
                )}

                {formData.projects.length > 0 && (
                  <div>
                    <h5 className={`${sectionTitleClass} mb-1`}>Projects</h5>
                    <p className="text-sm text-gray-300">{formData.projects.length} project(s)</p>
                  </div>
                )}

                <div>
                  <h5 className={`${sectionTitleClass} mb-1`}>Template</h5>
                  <p className="text-sm text-gray-300">{formData.template}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResumeBuilder; 