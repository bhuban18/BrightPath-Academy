/**
 * BrightPath Academy — Comprehensive Course Curriculum & Learning Resources
 * 
 * Supports JEE Preparation, NEET Preparation, Class 11-12 Science, and Class 9-10 Foundation.
 * Each course has dedicated subjects, structured video lectures, chapter notes,
 * formula sheets, revision checklists, and interactive multiple-choice practice tests.
 */

export interface VideoLecture {
  id: string;
  subject: string;
  chapter: string;
  title: string;
  duration: string;
  instructor?: string;
  videoUrl: string; // Embeddable YouTube / Educational video link or demo player
  summary?: string;
  description?: string;
  thumbnailText?: string;
  topicsCovered?: string[];
}

export interface StudyNote {
  id: string;
  subject: string;
  chapter: string;
  title: string;
  fileAvailable: boolean;
  pages: number;
  pageCount?: number;
  readTime: string;
  summary: string;
  description?: string;
  keyPoints: string[];
  pdfUrl?: string; // Optional download link if actual file is uploaded
}

export interface FormulaSheet {
  subject: string;
  chapter: string;
  title: string;
  formulas: Array<{ name: string; formula: string; explanation: string }>;
}

export interface PracticeQuestion {
  id: string;
  subject: string;
  chapter: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  difficulty: 'Easy' | 'Moderate' | 'JEE Advanced';
}

export interface MockTest {
  id: string;
  title: string;
  durationMinutes: number;
  totalMarks: number;
  markingScheme: string; // "+4 for correct, -1 for incorrect"
  questions: PracticeQuestion[];
}

export interface CourseCurriculum {
  courseId: string;
  courseTitle: string;
  stream: string;
  targetExam: string;
  subjects: string[];
  lectures: VideoLecture[];
  notes: StudyNote[];
  formulaSheets: FormulaSheet[];
  revisionChecklist: Array<{ id: string; subject: string; chapter: string; topic: string }>;
  mockTests: MockTest[];
}

export const COURSE_CURRICULUM_DATA: Record<string, CourseCurriculum> = {
  'jee-preparation': {
    courseId: 'jee-preparation',
    courseTitle: 'JEE Preparation (Main + Advanced)',
    stream: 'Engineering',
    targetExam: 'IIT-JEE Main & JEE Advanced 2026–2027',
    subjects: ['Physics', 'Chemistry', 'Mathematics'],
    lectures: [
      {
        id: 'jee-phy-101',
        subject: 'Physics',
        chapter: 'Kinematics & Vectors',
        title: 'Projectiles, Relative Motion & Vector Calculus in 2D',
        duration: '48 mins',
        instructor: 'Dr. Rajesh K. Varma',
        videoUrl: 'https://www.youtube-nocookie.com/embed/n29rnJvQ8aU',
        summary: 'Deep conceptual breakdown of trajectory equation, maximum height with variable launch angle, and relative velocity on inclined planes.',
        topicsCovered: [
          'Equation of path of projectile and cartesian representations',
          'Trajectory on an inclined plane: upward & downward launches',
          'Relative velocity: River-swimmer and wind-airplane vector triangles',
          'Previous 5 Years JEE Advanced trick problems'
        ]
      },
      {
        id: 'jee-phy-102',
        subject: 'Physics',
        chapter: 'Laws of Motion & Work-Energy',
        title: 'Constrained Motion, Friction on Wedges & Work-Energy Theorem',
        duration: '52 mins',
        instructor: 'Dr. Rajesh K. Varma',
        videoUrl: 'https://www.youtube-nocookie.com/embed/kKKM8Y-u7ds',
        summary: 'String constraint virtual work method, pseudo force in non-inertial reference frames, and variable spring forces.',
        topicsCovered: [
          'Virtual work principle for pulley and multi-block systems',
          'Two-block friction problems: static vs kinetic threshold',
          'Conservation of mechanical energy with non-conservative work',
          'JEE Advanced multi-concept wedge problems'
        ]
      },
      {
        id: 'jee-chem-101',
        subject: 'Chemistry',
        chapter: 'Chemical Bonding & Molecular Structure',
        title: 'Hybridization, Molecular Orbital Theory & Dipole Moments',
        duration: '45 mins',
        instructor: 'Prof. S. N. Mukherjee',
        videoUrl: 'https://www.youtube-nocookie.com/embed/5U_74Qz5KkI',
        summary: 'VSEPR theory exceptions, drawing MO diagrams for B2, C2, O2, N2, and calculating bond orders with magnetic properties.',
        topicsCovered: [
          'Steric number approach for d-orbital hybridizations (sp3d, sp3d2)',
          'MOT electronic configurations and paramagnetism / diamagnetism',
          'Fajan rules and covalent character in ionic compounds',
          'High-frequency JEE Main MCQs on bond length and strength'
        ]
      },
      {
        id: 'jee-chem-102',
        subject: 'Chemistry',
        chapter: 'Organic Reaction Mechanisms',
        title: 'Electrophilic Addition to Alkenes & Stereochemical Outcomes',
        duration: '50 mins',
        instructor: 'Dr. Anita Roy',
        videoUrl: 'https://www.youtube-nocookie.com/embed/0G2_qQY4h_A',
        summary: 'Markovnikov rule with carbocation rearrangement, hydroboration-oxidation, and halogenation stereochemistry (anti-addition).',
        topicsCovered: [
          'Carbocation stability, hydride shifts & methyl shifts',
          'Halonium ion bridge mechanism and meso product formation',
          'Ozonolysis oxidative vs reductive cleavage patterns',
          'Multi-step organic synthesis problems in JEE Advanced'
        ]
      },
      {
        id: 'jee-math-101',
        subject: 'Mathematics',
        chapter: 'Calculus: Differential Calculus',
        title: 'Continuity, Differentiability & Mean Value Theorems',
        duration: '55 mins',
        instructor: 'Er. Amitav Sen',
        videoUrl: 'https://www.youtube-nocookie.com/embed/1kLw8V126yE',
        summary: 'Sharp turn vs corner differentiation, Lagrange and Cauchy Mean Value Theorems with geometric interpretation and roots isolation.',
        topicsCovered: [
          'Left-hand and right-hand derivative definitions using limits',
          'Rolle’s Theorem and finding root intervals of polynomials',
          'LMVT inequalities and functional equations',
          'JEE Advanced questions on fractional part & greatest integer functions'
        ]
      },
      {
        id: 'jee-math-102',
        subject: 'Mathematics',
        chapter: 'Coordinate Geometry',
        title: 'Conic Sections: Parabola, Ellipse & Hyperbola Normals',
        duration: '58 mins',
        instructor: 'Er. Amitav Sen',
        videoUrl: 'https://www.youtube-nocookie.com/embed/Fw3lWJgR1eQ',
        summary: 'Standard tangent equations (point form, slope form, parametric form) and director circles for all standard conics.',
        topicsCovered: [
          'Condition of tangency: y = mx + c for parabola, ellipse, hyperbola',
          'Equations of normals and locus of intersection of perpendicular normals',
          'Eccentricity and focal distance properties',
          'Common tangents between circles and conics'
        ]
      }
    ],
    notes: [
      {
        id: 'note-phy-01',
        subject: 'Physics',
        chapter: 'Kinematics',
        title: 'Complete 2D Motion & Calculus Kinematics Master Notes',
        fileAvailable: true,
        pages: 14,
        readTime: '25 min read',
        summary: 'Handcrafted concise revision notes covering projectile motion, tangential and radial acceleration, and vector calculus relations.',
        keyPoints: [
          'Acceleration vector decomposition: a_net = sqrt(a_t^2 + a_c^2)',
          'Radius of curvature at any point: R = v^2 / a_perp',
          'Relative velocity approach simplifies projectile collisions to straight lines',
          'Minimum distance of approach formula and angle of safe launch'
        ]
      },
      {
        id: 'note-chem-01',
        subject: 'Chemistry',
        chapter: 'Thermodynamics & Thermochemistry',
        title: 'First & Second Laws, Hess Law & Gibbs Free Energy Master Summary',
        fileAvailable: true,
        pages: 18,
        readTime: '30 min read',
        summary: 'Comprehensive thermodynamics notes linking enthalpy, entropy, work done in reversible/irreversible paths, and Spontaneity criteria.',
        keyPoints: [
          'Work done in isothermal reversible expansion: w = -2.303 nRT log(V2/V1)',
          'Adiabatic process relation: P * V^gamma = constant and TV^(gamma-1) = constant',
          'Delta G = Delta H - T * Delta S: temperature dependence of spontaneity',
          'Kirchhoff equation for temperature variance of reaction enthalpy'
        ]
      },
      {
        id: 'note-math-01',
        subject: 'Mathematics',
        chapter: 'Integral Calculus',
        title: 'Definite Integrals & Properties of Definite Integrals',
        fileAvailable: true,
        pages: 16,
        readTime: '28 min read',
        summary: 'Exhaustive notes on King property, Queen property, periodic integrals, and Leibniz integral rule under integral sign.',
        keyPoints: [
          'King’s Rule: Integral from a to b f(x) dx = Integral from a to b f(a+b-x) dx',
          'Leibniz Rule for differentiating under the integral sign',
          'Wallis formula and reduction formulas for sin^n(x) and cos^n(x)',
          'Definite integral as the limit of a Riemann sum'
        ]
      },
      {
        id: 'note-math-02',
        subject: 'Mathematics',
        chapter: 'Vectors & 3D Geometry',
        title: 'Lines, Planes & Shortest Distance in 3D Space',
        fileAvailable: false,
        pages: 12,
        readTime: '20 min read',
        summary: 'Drafting in progress by senior faculty. Covers skew lines distance and intersection of planes.',
        keyPoints: [
          'Shortest distance between two skew lines vector formula',
          'Angle between two intersecting planes using normal vectors',
          'Coplanarity condition of two straight lines'
        ]
      }
    ],
    formulaSheets: [
      {
        subject: 'Physics',
        chapter: 'Mechanics & Rotational Dynamics',
        title: 'Rotational Dynamics & Torque Formula Bank',
        formulas: [
          { name: 'Moment of Inertia (Ring)', formula: 'I = M * R^2', explanation: 'About central perpendicular axis' },
          { name: 'Moment of Inertia (Disc)', formula: 'I = 0.5 * M * R^2', explanation: 'About central perpendicular axis' },
          { name: 'Parallel Axis Theorem', formula: 'I = I_cm + M * d^2', explanation: 'Valid for rigid bodies of any shape' },
          { name: 'Perpendicular Axis Theorem', formula: 'I_z = I_x + I_y', explanation: 'Strictly valid only for laminar (2D planar) bodies' },
          { name: 'Rotational Kinetic Energy', formula: 'KE_rot = 0.5 * I * omega^2', explanation: 'Total kinetic energy in rolling = KE_trans + KE_rot' },
          { name: 'Torque & Angular Acceleration', formula: 'tau = I * alpha', explanation: 'Net external torque equals rate of change of angular momentum' }
        ]
      },
      {
        subject: 'Chemistry',
        chapter: 'Physical Chemistry',
        title: 'Electrochemistry & Chemical Kinetics Formulas',
        formulas: [
          { name: 'Nernst Equation (298 K)', formula: 'E_cell = E0_cell - (0.0591 / n) * log(Q)', explanation: 'Calculates non-standard electrode and cell potentials' },
          { name: 'Gibbs Energy & Cell Potential', formula: 'Delta G0 = -n * F * E0_cell', explanation: 'F is Faraday constant (96,485 C/mol)' },
          { name: 'Arrhenius Equation', formula: 'k = A * e^(-Ea / (R * T))', explanation: 'Temperature dependence of reaction rate constant' },
          { name: 'First Order Half-Life', formula: 't_half = 0.693 / k', explanation: 'Independent of initial reactant concentration' }
        ]
      },
      {
        subject: 'Mathematics',
        chapter: 'Conic Sections & Coordinate Geometry',
        title: 'Standard Conic Formula Matrix',
        formulas: [
          { name: 'Parabola Tangent (Slope m)', formula: 'y = m * x + a / m', explanation: 'For y^2 = 4ax with point of contact (a/m^2, 2a/m)' },
          { name: 'Ellipse Tangent (Slope m)', formula: 'y = m * x +/- sqrt(a^2 * m^2 + b^2)', explanation: 'For x^2/a^2 + y^2/b^2 = 1' },
          { name: 'Hyperbola Tangent (Slope m)', formula: 'y = m * x +/- sqrt(a^2 * m^2 - b^2)', explanation: 'For x^2/a^2 - y^2/b^2 = 1 (valid when m^2 >= b^2/a^2)' },
          { name: 'Director Circle (Ellipse)', formula: 'x^2 + y^2 = a^2 + b^2', explanation: 'Locus of points of intersection of perpendicular tangents' }
        ]
      }
    ],
    revisionChecklist: [
      { id: 'chk-1', subject: 'Physics', chapter: 'Kinematics', topic: 'Projectiles on inclined planes solved' },
      { id: 'chk-2', subject: 'Physics', chapter: 'Newton Laws', topic: 'Virtual work pulley constraints mastered' },
      { id: 'chk-3', subject: 'Physics', chapter: 'Rotational Motion', topic: 'Rolling without slipping problems completed' },
      { id: 'chk-4', subject: 'Chemistry', chapter: 'Atomic Structure', topic: 'Quantum numbers & Bohr radius relations reviewed' },
      { id: 'chk-5', subject: 'Chemistry', chapter: 'Chemical Bonding', topic: 'MOT paramagnetism & dipole moment exceptions' },
      { id: 'chk-6', subject: 'Chemistry', chapter: 'Organic Chemistry', topic: 'Carbocation rearrangement mechanisms written out' },
      { id: 'chk-7', subject: 'Mathematics', chapter: 'Functions', topic: 'One-one, onto, and composite domain range mapped' },
      { id: 'chk-8', subject: 'Mathematics', chapter: 'Calculus', topic: 'LMVT & Rolle theorem root isolation practiced' },
      { id: 'chk-9', subject: 'Mathematics', chapter: 'Coordinate Geometry', topic: 'Condition of common tangents memorized' }
    ],
    mockTests: [
      {
        id: 'jee-mock-01',
        title: 'JEE Main Diagnostic Simulation Test #1',
        durationMinutes: 20,
        totalMarks: 36,
        markingScheme: '+4 for correct, -1 for incorrect',
        questions: [
          {
            id: 'q-p1',
            subject: 'Physics',
            chapter: 'Kinematics',
            question: 'A ball is projected from the ground with velocity u at an angle theta with the horizontal. The radius of curvature of its trajectory at the highest point is:',
            options: [
              '(u^2 * cos^2(theta)) / g',
              '(u^2 * sin^2(theta)) / g',
              '(u^2) / g',
              '(u^2 * cos(theta)) / (2 * g)'
            ],
            correctOptionIndex: 0,
            explanation: 'At the highest point, the velocity is purely horizontal: v = u * cos(theta). The normal acceleration is gravity g. The radius of curvature R = v^2 / a_perp = (u * cos(theta))^2 / g = (u^2 * cos^2(theta)) / g.',
            difficulty: 'Moderate'
          },
          {
            id: 'q-p2',
            subject: 'Physics',
            chapter: 'Rotational Dynamics',
            question: 'A solid cylinder and a hollow cylinder of the same mass and radius roll down an inclined plane without slipping. Which reaches the bottom first?',
            options: [
              'The solid cylinder',
              'The hollow cylinder',
              'Both reach at the exact same time',
              'Depends on the angle of inclination'
            ],
            correctOptionIndex: 0,
            explanation: 'The acceleration in rolling without slipping is a = (g * sin(theta)) / (1 + I / (M * R^2)). For a solid cylinder, I/(MR^2) = 0.5, giving a = (2/3)*g*sin(theta). For a hollow cylinder, I/(MR^2) = 1, giving a = (1/2)*g*sin(theta). The solid cylinder has higher acceleration and arrives first.',
            difficulty: 'Easy'
          },
          {
            id: 'q-p3',
            subject: 'Physics',
            chapter: 'Electrostatics',
            question: 'An electric dipole of dipole moment p is placed in a uniform electric field E. The work done in rotating the dipole from stable equilibrium (theta = 0) to unstable equilibrium (theta = 180 degrees) is:',
            options: [
              '2 * p * E',
              'p * E',
              '0',
              '-2 * p * E'
            ],
            correctOptionIndex: 0,
            explanation: 'Potential energy U = -p * E * cos(theta). At stable equilibrium (theta = 0), U_initial = -p*E. At unstable equilibrium (theta = 180), U_final = +p*E. Work done W = U_final - U_initial = p*E - (-p*E) = 2*p*E.',
            difficulty: 'Easy'
          },
          {
            id: 'q-c1',
            subject: 'Chemistry',
            chapter: 'Chemical Bonding',
            question: 'According to Molecular Orbital Theory, which of the following species has a bond order of 2.5 and is paramagnetic?',
            options: [
              'O2^+',
              'N2',
              'O2',
              'C2'
            ],
            correctOptionIndex: 0,
            explanation: 'O2 has 16 electrons and bond order 2.0. O2^+ has 15 electrons. Its configuration removes one electron from an antibonding pi* orbital, so Bond Order = (10 - 5) / 2 = 2.5. It retains one unpaired electron in the pi* orbital, making it paramagnetic.',
            difficulty: 'Moderate'
          },
          {
            id: 'q-c2',
            subject: 'Chemistry',
            chapter: 'Thermodynamics',
            question: 'For the reaction: 2 SO2(g) + O2(g) -> 2 SO3(g), Delta H is negative. The reaction is spontaneous at:',
            options: [
              'Low temperatures only',
              'High temperatures only',
              'All temperatures',
              'No temperature'
            ],
            correctOptionIndex: 0,
            explanation: 'The reaction has 3 gas moles turning into 2 gas moles, so Delta S is negative. Delta H is negative (exothermic). For Delta G = Delta H - T * Delta S to remain negative (< 0), the -T * Delta S term (which is positive) must be kept small, which occurs only at low temperatures.',
            difficulty: 'Moderate'
          },
          {
            id: 'q-c3',
            subject: 'Chemistry',
            chapter: 'Organic Chemistry',
            question: 'Which of the following carbocations is most stable due to complete octet stabilization through resonance?',
            options: [
              'CH3-CH(+)-OCH3',
              '(CH3)3C(+)',
              'CH2=CH-CH2(+)',
              'C6H5-CH2(+)'
            ],
            correctOptionIndex: 0,
            explanation: 'In CH3-CH(+)-OCH3, the lone pair on the oxygen atom directly donates into the vacant p-orbital of the adjacent positive carbon, forming a C=O(+) double bond where all atoms satisfy the octet rule. Octet complete resonance outweighs hyperconjugation or simple allylic resonance.',
            difficulty: 'JEE Advanced'
          },
          {
            id: 'q-m1',
            subject: 'Mathematics',
            chapter: 'Calculus',
            question: 'The value of the definite integral from 0 to pi/2 of (sin(x))^2026 / [(sin(x))^2026 + (cos(x))^2026] dx is:',
            options: [
              'pi / 4',
              'pi / 2',
              '1',
              '0'
            ],
            correctOptionIndex: 0,
            explanation: 'Apply King property: Integral I = Integral from 0 to pi/2 of f(pi/2 - x) dx = Integral of (cos(x))^2026 / [(cos(x))^2026 + (sin(x))^2026] dx. Adding the two expressions gives 2*I = Integral from 0 to pi/2 of 1 dx = pi/2. Hence I = pi / 4.',
            difficulty: 'Easy'
          },
          {
            id: 'q-m2',
            subject: 'Mathematics',
            chapter: 'Coordinate Geometry',
            question: 'The locus of the point of intersection of perpendicular tangents to the ellipse x^2 / 16 + y^2 / 9 = 1 is:',
            options: [
              'x^2 + y^2 = 25',
              'x^2 + y^2 = 7',
              'x^2 + y^2 = 144',
              'x^2 + y^2 = 12'
            ],
            correctOptionIndex: 0,
            explanation: 'The locus of perpendicular tangents to an ellipse x^2/a^2 + y^2/b^2 = 1 is its director circle, whose equation is x^2 + y^2 = a^2 + b^2. Here a^2 = 16 and b^2 = 9, so x^2 + y^2 = 16 + 9 = 25.',
            difficulty: 'Easy'
          },
          {
            id: 'q-m3',
            subject: 'Mathematics',
            chapter: 'Vectors & 3D',
            question: 'If the vectors a = 2i - j + k, b = i + 2j - 3k, and c = 3i + lambda*j + 5k are coplanar, then the value of lambda is:',
            options: [
              '-4',
              '4',
              '2',
              '-2'
            ],
            correctOptionIndex: 0,
            explanation: 'Three vectors are coplanar if their scalar triple product [a b c] = 0. Expanding the 3x3 determinant with rows [2, -1, 1], [1, 2, -3], [3, lambda, 5]: 2*(10 + 3*lambda) - (-1)*(5 - (-9)) + 1*(lambda - 6) = 0. 20 + 6*lambda + 14 + lambda - 6 = 0 => 7*lambda + 28 = 0 => lambda = -4.',
            difficulty: 'Moderate'
          }
        ]
      }
    ]
  },

  'neet-preparation': {
    courseId: 'neet-preparation',
    courseTitle: 'NEET Preparation (Medical UG)',
    stream: 'Medical',
    targetExam: 'NEET-UG 2026–2027',
    subjects: ['Biology', 'Physics', 'Chemistry'],
    lectures: [
      {
        id: 'neet-bio-101',
        subject: 'Biology',
        chapter: 'Human Physiology',
        title: 'Neural Control & Conduction of Nerve Impulse (NCERT Line-by-Line)',
        duration: '42 mins',
        instructor: 'Dr. S. Mukherjee (MBBS)',
        videoUrl: 'https://www.youtube-nocookie.com/embed/n29rnJvQ8aU',
        summary: 'Step-by-step breakdown of resting membrane potential, Na+/K+ pump, depolarization, and synaptic neurotransmitter vesicle fusion.',
        topicsCovered: [
          'Axon membrane permeability and ionic gradients in resting state',
          'Action potential propagation and threshold voltage',
          'Electrical vs chemical synapses and synaptic cleft events',
          'NCERT diagram labeling questions from previous 5 years NEET'
        ]
      },
      {
        id: 'neet-bio-102',
        subject: 'Biology',
        chapter: 'Genetics & Evolution',
        title: 'Mendelian Genetics, Pedigree Analysis & Chromosomal Disorders',
        duration: '46 mins',
        instructor: 'Dr. S. Mukherjee (MBBS)',
        videoUrl: 'https://www.youtube-nocookie.com/embed/5U_74Qz5KkI',
        summary: 'Incomplete dominance, codominance, polygenic inheritance, and pedigree charts solving techniques.',
        topicsCovered: [
          'Dihybrid cross test-cross ratios',
          'Autosomal dominant vs recessive pedigree clues',
          'Aneuploidy: Down syndrome, Turner syndrome, Klinefelter syndrome',
          'High-yield NEET MCQs on genetic linkage'
        ]
      }
    ],
    notes: [
      {
        id: 'note-neet-bio-01',
        subject: 'Biology',
        chapter: 'Ecology & Environment',
        title: 'Ecosystem Energy Flow, Productivity & Population Ecology Summary',
        fileAvailable: true,
        pages: 15,
        readTime: '22 min read',
        summary: 'Concise summary of GPP, NPP, 10% law of Lindeman, ecological pyramids, and logistic growth curve equations.',
        keyPoints: [
          'NPP = GPP - R (Respiration losses)',
          'Pyramid of biomass in sea is inverted (phytoplankton vs fishes)',
          'Verhulst-Pearl Logistic Growth equation: dN/dt = rN * (1 - N/K)',
          'Competitive Exclusion Principle by G.F. Gause'
        ]
      }
    ],
    formulaSheets: [
      {
        subject: 'Physics',
        chapter: 'Optics & Wave Optics',
        title: 'NEET High-Yield Optics Formula Sheet',
        formulas: [
          { name: 'Lens Maker Formula', formula: '1/f = (mu - 1) * (1/R1 - 1/R2)', explanation: 'Used for designing converging and diverging thin lenses' },
          { name: 'Magnification (Compound Microscope)', formula: 'm = -(L / f_o) * (D / f_e)', explanation: 'For normal adjustment with final image at near point D (25cm)' }
        ]
      }
    ],
    revisionChecklist: [
      { id: 'chk-n1', subject: 'Biology', chapter: 'Genetics', topic: 'Pedigree chart symbols and rules revised' },
      { id: 'chk-n2', subject: 'Biology', chapter: 'Ecology', topic: 'Population interaction table (+, -, 0) memorized' },
      { id: 'chk-n3', subject: 'Physics', chapter: 'Modern Physics', topic: 'Photoelectric effect Einstein equation solved' }
    ],
    mockTests: [
      {
        id: 'neet-mock-01',
        title: 'NEET High-Yield Mini Diagnostic Test',
        durationMinutes: 15,
        totalMarks: 20,
        markingScheme: '+4 for correct, -1 for incorrect',
        questions: [
          {
            id: 'nq-1',
            subject: 'Biology',
            chapter: 'Ecology',
            question: 'In a marine ecosystem, the pyramid of biomass is generally:',
            options: [
              'Inverted',
              'Upright',
              'Spindle-shaped',
              'Horizontal'
            ],
            correctOptionIndex: 0,
            explanation: 'In aquatic/marine ecosystems, the biomass of primary producers (phytoplankton) is small compared to the biomass of primary consumers (zooplankton and small fishes), because phytoplanktons have a rapid turnover rate and short life span. Hence, the pyramid of biomass in water is inverted.',
            difficulty: 'Easy'
          },
          {
            id: 'nq-2',
            subject: 'Biology',
            chapter: 'Human Physiology',
            question: 'During depolarization of a nerve axon, which ions flow rapidly into the intracellular fluid?',
            options: [
              'Sodium (Na+) ions',
              'Potassium (K+) ions',
              'Calcium (Ca2+) ions',
              'Chloride (Cl-) ions'
            ],
            correctOptionIndex: 0,
            explanation: 'When a stimulus reaches the axon membrane threshold, voltage-gated Na+ channels open immediately, causing a rapid influx of Na+ into the axoplasm, which reverses the membrane polarity from -70 mV to approximately +30 mV.',
            difficulty: 'Easy'
          }
        ]
      }
    ]
  },

  'class-11-12-science': {
    courseId: 'class-11-12-science',
    courseTitle: 'Class 11–12 Science (PCM / PCB)',
    stream: 'Science',
    targetExam: 'CBSE / ISC Board Finals 2026–2027',
    subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology'],
    lectures: [
      {
        id: 'sci-phy-01',
        subject: 'Physics',
        chapter: 'Current Electricity',
        title: 'Kirchhoff Laws, Wheatstone Bridge & Potentiometer Principles',
        duration: '40 mins',
        instructor: 'Dr. Rajesh K. Varma',
        videoUrl: 'https://www.youtube-nocookie.com/embed/n29rnJvQ8aU',
        summary: 'Structured board-style derivations for loop rule, junction rule, balanced bridge condition, and internal resistance measurement.',
        topicsCovered: [
          'Kirchhoff Junction and Loop laws sign convention',
          'Wheatstone bridge balance derivation using current division',
          'Board exam 5-mark derivation breakdown'
        ]
      }
    ],
    notes: [
      {
        id: 'note-sci-01',
        subject: 'Physics',
        chapter: 'Ray Optics',
        title: 'Prism Refraction & Optical Instruments Board Notes',
        fileAvailable: true,
        pages: 12,
        readTime: '20 min read',
        summary: 'Step-by-step ray diagrams and derivations for angle of minimum deviation.',
        keyPoints: [
          'Prism formula: mu = sin((A + D_m)/2) / sin(A/2)',
          'Astronomical telescope magnifying power derivation'
        ]
      }
    ],
    formulaSheets: [],
    revisionChecklist: [
      { id: 'chk-s1', subject: 'Physics', chapter: 'Current Electricity', topic: 'Wheatstone derivation written out' }
    ],
    mockTests: []
  },

  'class-9-10-foundation': {
    courseId: 'class-9-10-foundation',
    courseTitle: 'Class 9–10 Foundation',
    stream: 'Foundation',
    targetExam: 'CBSE / Olympiad / NTSE Foundations',
    subjects: ['Mathematics', 'Science', 'Mental Ability'],
    lectures: [
      {
        id: 'fnd-math-01',
        subject: 'Mathematics',
        chapter: 'Quadratic Equations & Polynomials',
        title: 'Factoring, Discriminant Nature of Roots & Mental Math Short-Cuts',
        duration: '35 mins',
        instructor: 'Er. Amitav Sen',
        videoUrl: 'https://www.youtube-nocookie.com/embed/kKKM8Y-u7ds',
        summary: 'Building strong early intuition on roots, quadratic graphs, and solving higher degree equations.',
        topicsCovered: [
          'Splitting the middle term vs quadratic formula',
          'Discriminant D = b^2 - 4ac interpretation',
          'Word problems on speeds and geometric areas'
        ]
      }
    ],
    notes: [
      {
        id: 'note-fnd-01',
        subject: 'Science',
        chapter: 'Light: Reflection & Refraction',
        title: 'Mirror & Lens Sign Conventions & Ray Diagrams',
        fileAvailable: true,
        pages: 10,
        readTime: '15 min read',
        summary: 'Clean ray diagrams for concave and convex mirrors.',
        keyPoints: [
          'Cartesian sign convention (pole as origin)',
          'Mirror formula: 1/f = 1/v + 1/u'
        ]
      }
    ],
    formulaSheets: [],
    revisionChecklist: [
      { id: 'chk-f1', subject: 'Mathematics', chapter: 'Quadratic Equations', topic: 'Nature of roots table memorized' }
    ],
    mockTests: []
  }
};

export type LectureItem = VideoLecture;

export interface UnifiedCourseCurriculum extends CourseCurriculum {
  id: string;
  title: string;
  targetBadge: string;
  studyNotes: StudyNote[];
}

export const ALL_COURSES_CURRICULUM: UnifiedCourseCurriculum[] = Object.values(COURSE_CURRICULUM_DATA).map((c) => ({
  ...c,
  id: c.courseId,
  title: c.courseTitle,
  targetBadge: c.targetExam,
  studyNotes: c.notes.map((n) => ({
    ...n,
    pageCount: n.pages,
    description: n.summary
  })),
  lectures: c.lectures.map((l) => ({
    ...l,
    thumbnailText: `${l.subject.toUpperCase()}: ${l.chapter}`,
    description: l.summary
  }))
}));

