export const APP_NAME = 'BrainWave AI';
export const APP_TAGLINE = 'Powering Academic Excellence with AI';
export const APP_DESCRIPTION = 'AI-powered educational platform for students, teachers, lecturers, and researchers.';
export const COMPANY = 'TJ VITAL SOURCE TECH';

export const SUBSCRIPTION_PLANS = {
  free: { name: 'Free Trial', price: 0, credits: 100, duration: 7, features: ['100 free credits', '7-day trial', 'Basic AI chat', 'Study tools', 'Limited access'] },
  monthly: {
    name: 'Monthly Pro', price: 200, currency: 'GHS', paystackAmount: 20000,
    credits: 500, duration: 30,
    features: ['500 credits/month', 'Unlimited AI chat', 'All academic tools', 'Image generation', 'Research assistant', 'Quiz builder', 'Priority support'],
  },
  yearly: {
    name: 'Yearly Pro', price: 2000, currency: 'GHS', paystackAmount: 200000,
    credits: 7000, duration: 365, savings: 400,
    features: ['7,000 credits/year (500 bonus)', 'All Monthly features', 'Advanced analytics', 'Presentation builder', 'Institution dashboard', 'Dedicated support', 'Early access to features'],
  },
};

export const CREDIT_PACKS = [
  { id: 'credit_500', name: '500 Credits', credits: 500, price: 50, currency: 'GHS', paystackAmount: 5000 },
];

export const CREDIT_COSTS = {
  image_generation: 10,
  flyer_generation: 15,
  presentation: 20,
  premium_research: 20,
  logo_design: 25,
  background_remove: 5,
  ocr: 3,
  voice_output: 2,
  bulk_export: 5,
};

export const AI_MODELS = [
  { id: 'claude', name: 'Claude (Recommended)', provider: 'Anthropic', description: 'Best for academic writing and analysis' },
  { id: 'openai', name: 'GPT-4o', provider: 'OpenAI', description: 'Excellent for coding and problem solving' },
  { id: 'gemini', name: 'Gemini Pro', provider: 'Google', description: 'Great for research and multimodal tasks' },
];

export const ACADEMIC_LEVELS = [
  'Basic School', 'Secondary/High School', 'College', 'Undergraduate', 'Masters', 'PhD', 'Professional',
];

export const SUBJECTS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Literature', 'History', 'Geography',
  'Economics', 'Accounting', 'Business Studies', 'Computer Science', 'Engineering', 'Medicine',
  'Law', 'Sociology', 'Psychology', 'Philosophy', 'Political Science', 'Environmental Science',
  'Statistics', 'Further Mathematics', 'Technical Drawing', 'Agriculture', 'French', 'Twi/Akan',
];

export const CITATION_FORMATS = ['APA', 'MLA', 'Harvard', 'Chicago', 'IEEE', 'Vancouver'];

export const USER_ROLES = {
  student: { label: 'Student', icon: 'FaUserGraduate', color: 'blue' },
  teacher: { label: 'Teacher', icon: 'FaChalkboardTeacher', color: 'green' },
  lecturer: { label: 'Lecturer', icon: 'FaUniversity', color: 'purple' },
  institution_admin: { label: 'Institution Admin', icon: 'FaBuilding', color: 'orange' },
  admin: { label: 'Admin', icon: 'FaUserShield', color: 'red' },
  superadmin: { label: 'Super Admin', icon: 'FaCrown', color: 'yellow' },
};

export const FLYER_TYPES = [
  { id: 'event', label: 'Event Flyer' },
  { id: 'school', label: 'School Flyer' },
  { id: 'church', label: 'Church Flyer' },
  { id: 'business', label: 'Business Flyer' },
  { id: 'academic', label: 'Academic Flyer' },
  { id: 'social', label: 'Social Media Flyer' },
];

export const IMAGE_TYPES = [
  { id: 'realistic', label: 'Realistic Photo' },
  { id: 'diagram', label: 'Academic Diagram' },
  { id: 'chart', label: 'Educational Chart' },
  { id: 'infographic', label: 'Infographic' },
  { id: 'logo', label: 'Logo' },
  { id: 'poster', label: 'Poster' },
  { id: 'certificate', label: 'Certificate' },
  { id: 'banner', label: 'Banner' },
  { id: 'business_card', label: 'Business Card' },
  { id: 'book_cover', label: 'Book Cover' },
];

export const TOAST_CONFIG = {
  duration: 4000,
  style: { background: '#1E2140', color: '#fff', border: '1px solid rgba(79,70,229,0.3)' },
  success: { iconTheme: { primary: '#10B981', secondary: '#fff' } },
  error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
};

export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  dashboard: '/dashboard',
  studentDashboard: '/dashboard/student',
  teacherDashboard: '/dashboard/teacher',
  adminDashboard: '/dashboard/admin',
  superAdminDashboard: '/dashboard/superadmin',
  plans: '/subscription/plans',
  checkout: '/subscription/checkout',
  academicAssistant: '/features/academic-assistant',
  assignmentAssistant: '/features/assignment-assistant',
  researchAssistant: '/features/research-assistant',
  pastQuestions: '/features/past-questions',
  examPrep: '/features/exam-prep',
  studyTools: '/features/study-tools',
  writingAssistant: '/features/writing-assistant',
  imageGenerator: '/features/image-generator',
  flyerGenerator: '/features/flyer-generator',
  presentationGenerator: '/features/presentation-generator',
  quizBuilder: '/features/quiz-builder',
  examBuilder: '/features/exam-builder',
};
