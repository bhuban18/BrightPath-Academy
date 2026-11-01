/**
 * BrightPath Academy — Central Institute Configuration File
 * 
 * Instructions for Freelance Developers & Institute Owners:
 * You can customize ALL text, contact numbers, address, courses,
 * faculty credentials, and demonstration stats in this single file.
 */

export interface CourseDetail {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  stream: 'Foundation' | 'Science' | 'Engineering' | 'Medical';
  duration: string;
  batchTiming: string;
  targetAudience: string;
  shortDescription: string;
  detailedDescription: string;
  syllabusHighlights: string[];
  keyFeatures: string[];
  batchSize: string;
  testFrequency: string;
  recommendedFor: string;
}

export interface AchievementItem {
  id: string;
  studentName: string;
  exam: string;
  scoreOrRank: string;
  year: string;
  boardOrCategory: string;
  quote: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  program: string;
  content: string;
  highlight: string;
  rating: number;
}

export const ACADEMY_CONFIG = {
  // Brand details
  name: "BrightPath Academy",
  shortName: "BrightPath",
  tagline: "Your Goals. Our Guidance. Your Success.",
  subTagline: "Build strong concepts, develop confidence, and prepare for your academic goals with structured learning and personalised guidance.",
  
  // Contact details
  phoneDisplay: "Contact us for enquiries",
  phoneNumberRaw: "",
  // International format for WhatsApp without '+' or spaces (e.g. your verified business number)
  // Left blank until verified number is configured by website owner
  whatsAppNumber: "",
  isDemoNumber: true, // Prompts user that contact number is awaiting verification by owner
  email: "admissions@brightpathacademy.edu.in",
  address: "Plot 42, Academic Enclave, Near Metro Pillar 140, Model Town, New Delhi, 110009",
  workingHours: "Monday – Saturday: 8:00 AM – 8:00 PM | Sunday: 9:00 AM – 2:00 PM (Doubt Sessions)",

  // Demonstration Statistics (Clearly noted as sample data)
  statistics: {
    teachingExperienceYears: "14+",
    coursesOfferedCount: "8+",
    studentsMentoredCount: "3,500+",
    successRate: "94.8%",
    disclaimer: "Figures displayed are sample demonstration metrics for freelance presentation."
  },

  // Trust Highlights for Hero strip
  trustBadges: [
    { label: "Concept-First Curriculum", subtext: "Zero Rote Learning" },
    { label: "Small Batches (Max 25)", subtext: "Personal Mentorship" },
    { label: "Daily Doubt Clinics", subtext: "1-on-1 Faculty Access" },
    { label: "Curated DPPs & Mock Tests", subtext: "Real Exam Simulation" }
  ],

  // 4 Required Core Courses
  courses: [
    {
      id: "class-9-10-foundation",
      title: "Class 9–10 Foundation",
      subtitle: "Pre-Engineering & Pre-Medical Olympiad Base",
      tag: "Foundational Excellence",
      stream: "Foundation",
      duration: "1 to 2 Years (Comprehensive)",
      batchTiming: "Weekdays (4:30 PM – 7:00 PM) or Weekend Batches",
      targetAudience: "Students moving to Class 9 or 10 (CBSE / ICSE / State Boards)",
      shortDescription: "Build strong scientific temper, logical reasoning, and deep conceptual clarity in Mathematics, Physics, Chemistry, and Biology from the ground up.",
      detailedDescription: "Designed to cultivate advanced analytical thinking well ahead of competitive pressures. We bridge board curriculum with Olympiad, NTSE, and early JEE/NEET fundamentals through hands-on mental math, visualization drills, and structured science modules.",
      syllabusHighlights: [
        "Mastery of NCERT Mathematics & Science with multi-level problem sets",
        "Introduction to Higher-Order Thinking Skills (HOTS) and Olympiad syllabi",
        "Foundational Algebra, Coordinate Geometry, Kinematics, and Chemical Bonding",
        "Speed calculation, reasoning aptitude, and scientific diagram techniques"
      ],
      keyFeatures: [
        "Bi-weekly subjective & objective assessments with detailed feedback",
        "Personalized formula sheets and concept mind-maps",
        "Regular parent-teacher academic reviews every 4 weeks",
        "Dedicated school exam preparation support before term finals"
      ],
      batchSize: "Max 25 Students per Batch",
      testFrequency: "Fortnightly Unit Tests + Term End Mock Exams",
      recommendedFor: "Ambitious 9th & 10th graders seeking top board percentiles and early competitive edge."
    },
    {
      id: "class-11-12-science",
      title: "Class 11–12 Science",
      subtitle: "Board Mastery + Competitive Alignment (PCM / PCB)",
      tag: "Board & Entrance Dual Edge",
      stream: "Science",
      duration: "2 Years Integrated / 1 Year Fast-Track",
      batchTiming: "Morning (7:00 AM – 9:30 AM) & Evening (4:00 PM – 7:30 PM)",
      targetAudience: "Class 11 & 12 Science stream students (CBSE, ISC, and State Boards)",
      shortDescription: "Balanced, high-rigour coaching that guarantees top board percentages (95%+) while developing problem-solving skills for university entrance examinations.",
      detailedDescription: "Class 11 and 12 require dual mastery: rigorous descriptive answers for 95%+ board scoring, alongside swift MCQ problem-solving for entrance benchmarks. Our modular system synchronizes school syllabus milestones with deep entrance-level conceptual clarity.",
      syllabusHighlights: [
        "Complete NCERT exhaustive coverage with step-wise board marking techniques",
        "Mechanics, Electromagnetism, Physical & Organic Chemistry, and Calculus",
        "In-depth lab diagram analysis and numerical speed practice",
        "Previous 10 Years' board papers solved under timed exam conditions"
      ],
      keyFeatures: [
        "Topic-wise Daily Practice Problems (DPP) with video explanations",
        "Weekly subjective tests graded per official Board evaluation rubrics",
        "Dedicated revision crash modules during pre-board window (Dec–Feb)",
        "Stress management and systematic time-table tracking"
      ],
      batchSize: "Max 25 Students per Batch",
      testFrequency: "Weekly Chapter Tests + 12 Full-Length Board Simulations",
      recommendedFor: "Students aspiring for 95%+ in Board Finals alongside a solid foundation for competitive tests."
    },
    {
      id: "jee-preparation",
      title: "JEE Preparation (Main + Advanced)",
      subtitle: "Analytical Rigour & High-Percentile Problem Solving",
      tag: "IIT-JEE Specialised",
      stream: "Engineering",
      duration: "1 Year Dropper / 2 Years Comprehensive",
      batchTiming: "Morning / Evening / Intensive Dropper Batches Available",
      targetAudience: "Engineering aspirants aiming for IITs, NITs, IIITs, and top tech institutes",
      shortDescription: "Rigorous problem-solving drills, speed-accuracy techniques, and multi-concept questions designed specifically for JEE Main and JEE Advanced.",
      detailedDescription: "Cracking JEE Advanced requires conceptual depth that links topics across chapters. Our JEE faculty breaks down complex physics scenarios, organic mechanisms, and advanced calculus into repeatable intuition, backed by computer-based mock tests mirroring NTA interfaces.",
      syllabusHighlights: [
        "High-yield physics: Rotational Dynamics, Electrodynamics, Modern Physics",
        "Mathematics: Coordinate Geometry, Integral Calculus, Vectors & 3D, Probability",
        "Chemistry: Reaction mechanisms, Inorganic trends, Thermodynamics & Equilibrium",
        "Speed-elimination methods and negative marking management tactics"
      ],
      keyFeatures: [
        "Computer-Based Test (CBT) series with All-India percentile simulation",
        "Daily 1-on-1 doubt clearing clinic with senior JEE mentors",
        "Comprehensive archive of 45+ years of JEE Advanced archive problems",
        "Personalized error analysis diary to eliminate recurring slip-ups"
      ],
      batchSize: "Strictly 20–25 Students per Batch",
      testFrequency: "Every Sunday CBT Exam + Granular Topic Quizzes",
      recommendedFor: "Serious engineering aspirants dedicated to qualifying JEE Main & Advanced with top percentiles."
    },
    {
      id: "neet-preparation",
      title: "NEET Preparation (Medical UG)",
      subtitle: "Biology Line-by-Line NCERT + High-Accuracy Physics/Chemistry",
      tag: "Medical UG Specialised",
      stream: "Medical",
      duration: "1 Year Dropper / 2 Years Comprehensive",
      batchTiming: "Morning & Evening Intensive Cohorts",
      targetAudience: "Medical aspirants targeting Government Medical Colleges (AIIMS, JIPMER, State GMCs)",
      shortDescription: "Exhaustive NCERT Biology decoding paired with numerical mastery in Physics and Chemistry to score 650+ in NEET UG.",
      detailedDescription: "NEET demands near-perfect accuracy under tight time constraints (200 questions in 200 minutes). We train students with line-by-line NCERT diagram drills, high-yield physics numerical formulas, and memory mnemonics for inorganic chemistry.",
      syllabusHighlights: [
        "Complete NCERT Biology mastery: Genetics, Ecology, Human Physiology, Plant Kingdom",
        "Physics numerical mastery without fear: Optics, Thermodynamics, Modern Physics",
        "Physical, Organic & Inorganic Chemistry with 100% NCERT line coverage",
        "OMR sheet bubbling speed drills and negative mark prevention"
      ],
      keyFeatures: [
        "Over 10,000+ curated NEET standard MCQs with instant answer keys",
        "Weekly full-syllabus 720-mark mock tests matching exact NTA pattern",
        "Anatomy and botanical diagram flashcards for rapid revision",
        "Mentorship by qualified medical educators and top percentile achievers"
      ],
      batchSize: "Strictly 25 Students per Batch",
      testFrequency: "Weekly 720-Mark Mock Test with Ranking & Detailed Analysis",
      recommendedFor: "Aspiring doctors striving for a high-percentile seat in prestigious government medical colleges."
    }
  ] as CourseDetail[],

  // Why Choose Us Pillars
  whyChooseUs: [
    {
      title: "Concept-Based Teaching",
      shortDesc: "Deep conceptual clarity over rote memorisation.",
      fullDesc: "We decode fundamental principles using real-life examples and intuitive derivations so students can solve unseen problems with confidence.",
      icon: "Lightbulb",
      stat: "100% Logic-Driven"
    },
    {
      title: "Doubt-Clearing Support",
      shortDesc: "Dedicated daily 1-on-1 doubt resolution sessions.",
      fullDesc: "No question is too small. Faculty members remain accessible after lectures to resolve individual queries until every concept is crystal clear.",
      icon: "HelpCircle",
      stat: "Daily 1-on-1 Clinics"
    },
    {
      title: "Structured Study Plans",
      shortDesc: "Weekly schedules, curated DPPs, and timely revisions.",
      fullDesc: "A disciplined, step-by-step academic calendar ensures complete syllabus coverage 2 months prior to exams, leaving ample time for full mock revisions.",
      icon: "CalendarCheck",
      stat: "Zero Syllabus Rush"
    },
    {
      title: "Personalised Attention",
      shortDesc: "Small batch size of 20–25 students per classroom.",
      fullDesc: "Unlike mass coaching factories, every child is known by name. We monitor individual strengths and weaknesses to provide timely course corrections.",
      icon: "UsersCheck",
      stat: "Strict 25:1 Ratio"
    }
  ],

  // Faculty Profile
  director: {
    name: "Dr. Rajesh K. Varma",
    role: "Founder & Academic Director",
    qualifications: "M.Sc. Physics (Gold Medalist), Ph.D., Ex-Senior Faculty",
    experience: "16+ Years in Competitive Coaching",
    specialization: "Mechanics, Electrodynamics & Advanced Problem Solving",
    quote: "True coaching does not mean burdening a child with heavy books; it means igniting the quiet curiosity that makes difficult equations look simple.",
    aboutBio: "Having mentored thousands of students who went on to enter prestigious institutions like IIT Bombay, IIT Delhi, and AIIMS, Dr. Varma founded BrightPath Academy with a clear vision: to bring personalized, ethical, and concept-driven education back to coaching. He personally conducts weekly physics masterclasses and supervises the academic progress of every batch."
  },

  // About Institute Core Philosophy
  philosophy: [
    {
      heading: "Concept Clarity Over Shortcut Tricks",
      detail: "Tricks fail when competitive exam patterns evolve. Fundamentals stay true forever."
    },
    {
      heading: "Low-Pressure, High-Rigor Environment",
      detail: "We cultivate discipline through encouragement, structured milestones, and consistent encouragement."
    },
    {
      heading: "Transparent Parent Partnership",
      detail: "Regular attendance and test progress reporting keeps parents fully informed every step of the journey."
    }
  ],

  // Demonstration Results & Achievements (Clean, honest, labelled as sample)
  sampleResults: [
    {
      rank: "AIR 142",
      exam: "JEE Advanced",
      name: "Priyanshu Verma",
      program: "2-Year Classroom Program",
      scoreDetail: "99.88 Percentile",
      boardScore: "97.4% Class 12 CBSE"
    },
    {
      rank: "AIR 388",
      exam: "NEET-UG",
      name: "Ananya Deshmukh",
      program: "2-Year Medical Batch",
      scoreDetail: "Score: 686 / 720",
      boardScore: "96.8% Class 12 CBSE"
    },
    {
      rank: "98.8%",
      exam: "CBSE Class 10",
      name: "Rohan Malhotra",
      program: "Foundation Batch",
      scoreDetail: "100/100 Math & Science",
      boardScore: "School Topper"
    },
    {
      rank: "AIR 894",
      exam: "JEE Main",
      name: "Siddharth Sen",
      program: "1-Year Repeater Batch",
      scoreDetail: "99.42 Percentile",
      boardScore: "Physics: 99/100"
    }
  ],

  // Testimonials (Sample demonstration testimonials)
  testimonials: [
    {
      id: "t1",
      name: "Aditya Narayan",
      role: "Student (Now at IIT Kharagpur)",
      program: "JEE Advanced Batch",
      content: "The biggest difference at BrightPath was the faculty accessibility. In large coaching centers, getting a doubt cleared takes days. Here, Dr. Varma sat with me after class until I thoroughly understood rotational kinematics.",
      highlight: "Personalized faculty attention made all the difference.",
      rating: 5
    },
    {
      id: "t2",
      name: "Dr. Sangeeta Deshmukh",
      role: "Parent of Ananya Deshmukh (NEET 686/720)",
      program: "Medical UG Cohort",
      content: "As a doctor myself, I was very particular about NCERT accuracy and student mental health. BrightPath provided the right balance of rigorous testing without toxic peer pressure. The monthly parent calls were honest and constructive.",
      highlight: "Rigorous testing without toxic peer pressure.",
      rating: 5
    },
    {
      id: "t3",
      name: "Kavya Menon",
      role: "Student (Class 10 Board - 98.2%)",
      program: "Class 9-10 Foundation",
      content: "The Foundation course completely removed my fear of Mathematics. The teachers explained concepts visually, which made geometry and algebra feel intuitive rather than stressful. It laid the perfect ground for Class 11.",
      highlight: "Completely removed my fear of Mathematics.",
      rating: 5
    }
  ] as TestimonialItem[],

  // Frequently Asked Questions
  faqs: [
    {
      q: "Can I attend a free demo class before enrolling?",
      a: "Yes! We encourage prospective students to attend up to 2 free trial classes in their relevant batch to experience our teaching methodology firsthand before making an admission decision."
    },
    {
      q: "What is the maximum batch size at BrightPath Academy?",
      a: "We strictly limit our batches to a maximum of 20 to 25 students. This ensures that every student gets direct teacher interaction and regular doubt resolution."
    },
    {
      q: "Is study material and test series included in the fee?",
      a: "Yes, our comprehensive study material (Theory booklets, Topic-wise DPPs, Question Banks) and access to our weekly offline & online test series are fully included."
    },
    {
      q: "Do you offer merit-based scholarships or fee concessions?",
      a: "Yes. Students scoring 85%+ in their previous school final or board examinations can qualify for up to 50% academic fee concession based on our scholarship assessment test."
    }
  ]
};
