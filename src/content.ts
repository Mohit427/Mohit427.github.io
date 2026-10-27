// All personal content lives here so the components stay reusable.

export const profile = {
  first: 'Mohit',
  last: 'Kumar',
  initials: 'MK',
  role: 'CS student & builder',
  location: 'Chennai, India',
  headline:
    "Hello there, I'm a CS student building software that meets the real world, from traffic junctions to autonomous robots.",
  email: 'mohitkumararunkumar@gmail.com',
  resume: '/resume.pdf',
  links: {
    github: 'https://github.com/Mohit427',
    linkedin: 'https://www.linkedin.com/in/mohitkumararunkumar/',
  },
};

export const about = {
  statement:
    "I'm a sophomore at IIITDM Kancheepuram who likes building solutions to real-world problems. I'm happiest when software reaches past the screen and talks to hardware, like signals, sensors and robots. I haven't picked one lane yet, and I'm deliberately getting better at the technologies that are changing how the world works.",
  facts: [
    { label: 'Studying', value: 'B.Tech CSE, IIITDM Kancheepuram' },
    { label: 'Also', value: 'BS Data Science, IIT Madras' },
    { label: 'Based in', value: 'Chennai, India' },
    { label: 'Open to', value: 'Internships' },
  ],
  stats: [
    { value: 9.66, decimals: 2, suffix: '', label: 'CGPA at IIITDM' },
    { value: 98.5, decimals: 1, suffix: '', label: 'JEE Main percentile' },
    { value: 1, decimals: 0, suffix: 'st', label: 'Place, Decode SIH 2026' },
    { value: 125, decimals: 0, suffix: '+', label: 'DSA problems solved' },
  ],
};

export const marqueeTop = [
  'AI Systems', 'Backend', 'Robotics', 'Computer Vision', 'Digital Twins',
  'LLM Agents', 'Full-Stack', 'Data Science', 'Simulation',
];

export const marqueeBottom = [
  'Python', 'C++', 'TypeScript', 'React', 'FastAPI', 'PostgreSQL', 'ROS2 Humble',
  'PX4', 'YOLOv8', 'MediaPipe', 'OpenCV', 'PyTorch', 'scikit-learn', 'SUMO', 'Docker', 'n8n',
];

export type Project = {
  id: string;
  title: string;
  kicker: string;
  blurb: string;
  stack: string[];
  badge?: string;
  repo?: string;
  demo?: string;
  demoLabel?: string;
  image: string;
  hue: number; // used to tint the generated cover when no screenshot exists
};

export const projects: Project[] = [
  {
    id: 'continuum',
    title: 'Continuum',
    kicker: 'HealthTech · 24h hackathon',
    blurb:
      'A patient-owned, consent-based longitudinal health record. It reads prescriptions and lab reports, then flags drug cascades and interactions that no single doctor can see.',
    stack: ['Next.js', 'TypeScript', 'Supabase', 'Postgres RLS', 'Claude API'],
    repo: 'https://github.com/Mohit427/continuum',
    demo: 'https://continuum-steel.vercel.app',
    image: '/projects/continuum.png',
    hue: 168,
  },
  {
    id: 'aura',
    title: 'AURA',
    kicker: 'AI traffic digital twin',
    blurb:
      'A human-centric, predictive, self-optimizing traffic signal system for Vadapalani Junction, Chennai. I led the backend and orchestration layer.',
    stack: ['FastAPI', 'PostgreSQL', 'SUMO + TraCI', 'C++', 'YOLOv8', 'Gemini'],
    badge: '1st place · Decode SIH 2026',
    repo: 'https://github.com/Mohit427/Aura-AI-Traffic',
    image: '/projects/aura.png',
    hue: 262,
  },
  {
    id: 'visture',
    title: 'VisTure',
    kicker: 'AI fitness coach',
    blurb:
      'Real-time form correction in the browser. It tracks pose landmarks at about 30 FPS, counts reps, flags bad form and pairs it with a GPT-4o coach.',
    stack: ['React', 'FastAPI', 'MediaPipe', 'OpenCV', 'GPT-4o'],
    badge: 'Top 3 · E-Summit 2026',
    image: '/projects/visture.png',
    hue: 320,
  },
  {
    id: 'cptestrunner',
    title: 'CP Test Runner',
    kicker: 'VS Code extension · Open VSX',
    blurb:
      'One-click testing for competitive programming. It compiles C++ with g++ on save, runs every sample, and shows PASS / FAIL / TLE / RE verdicts with a side-by-side diff in a live panel inside VS Code.',
    stack: ['TypeScript', 'VS Code API', 'C++', 'g++'],
    repo: 'https://github.com/Mohit427/cp-test-runner',
    demo: 'https://github.com/Mohit427/cp-test-runner/releases',
    demoLabel: 'Download',
    image: '/projects/cptestrunner.png',
    hue: 145,
  },
  {
    id: 'creditlens',
    title: 'Credit Lens',
    kicker: 'Alternative credit scoring',
    blurb:
      'Scores small businesses with no credit history from behavioural cash-flow signals. I built the data and feature pipeline: about 55M simulated UPI rows feeding explainable models.',
    stack: ['Python', 'scikit-learn', 'SHAP', 'FastAPI', 'React'],
    image: '/projects/creditlens.png',
    hue: 210,
  },
  {
    id: 'tripwise',
    title: 'TripWise',
    kicker: 'Smart India Hackathon 2026',
    blurb:
      'A tourism safety platform built on three promises: never lost, never cheated, never crushed. Crowd forecasting with spatio-temporal GNNs and BLE mesh where GPS dies.',
    stack: ['React', 'Node.js', 'ST-GNN', 'NavIC', 'BLE Mesh'],
    image: '/projects/tripwise.png',
    hue: 32,
  },
];

export const path = [
  {
    when: 'Sep 2026',
    title: 'Winner, Decode SIH 2026',
    where: 'OSCode · Cambridge Institute of Technology, Bengaluru',
    body: 'Backend and orchestration lead for AURA in a 5-person team, including a live 2-hour extension challenge set by the judges.',
  },
  {
    when: '2026 – now',
    title: 'Software Developer, Team AUV',
    where: 'IIITDM Kancheepuram',
    body: 'Navigation and control software for the team’s AUV/UAV platforms on ROS2 Humble, inside the PX4 ecosystem.',
  },
  {
    when: '2026 – now',
    title: 'Joint Core Member, AI Wing',
    where: 'Computer Science Club, IIITDM',
    body: 'Designed and ran a Prompt Engineering & Jailbreak CTF for first-years, and support the wing’s applied-AI track.',
  },
  {
    when: '2025 – 2029',
    title: 'B.Tech, Computer Science & Engineering',
    where: 'IIITDM Kancheepuram',
    body: 'CGPA 9.66 / 10. Coursework in algorithms, OOP, digital system design, linear algebra and probability.',
  },
  {
    when: 'In progress',
    title: 'BS in Data Science',
    where: 'IIT Madras (remote)',
    body: 'Foundation level, CGPA 8.5 / 10.',
  },
];

export const toolkit = [
  { group: 'Languages', items: ['C++', 'Python', 'C', 'JavaScript', 'SQL'] },
  { group: 'Backend', items: ['FastAPI', 'Node.js', 'PostgreSQL', 'SQLAlchemy async', 'REST'] },
  { group: 'AI & LLMs', items: ['PyTorch', 'scikit-learn', 'RAG', 'Gemini', 'GPT-4o', 'Ollama'] },
  { group: 'Vision', items: ['YOLOv8', 'MediaPipe', 'OpenCV'] },
  { group: 'Robotics', items: ['ROS2 Humble', 'PX4', 'Eclipse SUMO'] },
  { group: 'Tools', items: ['Git', 'Docker', 'Linux', 'n8n', 'Render'] },
];

export const certifications = ['Agentic AI · Anthropic', 'Introduction to AI', 'ML Crash Course · Google'];
