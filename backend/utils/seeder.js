const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Problem = require('../models/Problem');
const CoreQuestion = require('../models/CoreQuestion');
const Project = require('../models/Project');
const JobApplication = require('../models/JobApplication');
const Communication = require('../models/Communication');
const DailyActivity = require('../models/DailyActivity');

const seedDataFromFile = async () => {
  const filePath = path.join(__dirname, '../../strivers_a2z_sheet.json');
  if (!fs.existsSync(filePath)) {
    console.error(`[Seeder Error]: File not found at ${filePath}`);
    return [];
  }

  const fileRaw = fs.readFileSync(filePath, 'utf-8');
  const sheet = JSON.parse(fileRaw);

  const problemDocs = [];

  if (sheet.sections && Array.isArray(sheet.sections)) {
    for (const sec of sheet.sections) {
      const catId = sec.category_id || '';
      const catName = sec.category_name || 'General';

      if (sec.subcategories && Array.isArray(sec.subcategories)) {
        for (const sub of sec.subcategories) {
          const subId = sub.subcategory_id || '';
          const subName = sub.subcategory_name || 'General';

          if (sub.problems && Array.isArray(sub.problems)) {
            for (const p of sub.problems) {
              problemDocs.push({
                problem_id: p.problem_id,
                problem_name: p.problem_name,
                category_id: catId,
                category_name: catName,
                subcategory_id: subId,
                subcategory_name: subName,
                article: p.article || null,
                youtube: p.youtube || null,
                leetcode: p.leetcode || null,
                plus: p.plus || null,
                editorial: p.editorial || null,
                link: p.link || null,
                difficulty: p.difficulty ? (p.difficulty.charAt(0).toUpperCase() + p.difficulty.slice(1).toLowerCase()) : 'Easy',
                status: 'Unsolved',
                efficiency: 0,
                userNotes: ''
              });
            }
          }
        }
      }
    }
  }

  return problemDocs;
};

const defaultCoreQuestions = [
  {
    subject: 'Operating Systems',
    question: 'What is the difference between a Process and a Thread?',
    answer: 'A Process is an executing instance of a program with independent memory space. A Thread is a lightweight execution segment within a process sharing memory, files, and resources with peer threads.',
    keyTakeaways: ['Isolated memory space vs shared memory', 'Process creation overhead is higher', 'Context switching is faster for threads'],
    importance: 'High',
    status: 'Learning',
    efficiency: 85
  },
  {
    subject: 'DBMS',
    question: 'Explain ACID Properties in Relational Databases.',
    answer: 'Atomicity (all or nothing execution), Consistency (data satisfies integrity constraints), Isolation (concurrent transactions execute independently), Durability (committed changes persist despite system crashes).',
    keyTakeaways: ['Atomicity prevents partial writes', 'Isolation levels: Read Uncommitted, Read Committed, Repeatable Read, Serializable'],
    importance: 'High',
    status: 'Mastered',
    efficiency: 95
  },
  {
    subject: 'Computer Networks',
    question: 'Explain 3-Way Handshake in TCP connection establishment.',
    answer: '1. Client sends SYN (Synchronize sequence number).\n2. Server responds with SYN-ACK (Synchronize-Acknowledge).\n3. Client sends ACK (Acknowledge). TCP connection is established.',
    keyTakeaways: ['Ensures bidirectional communication readiness', 'Exchanges initial sequence numbers (ISN)'],
    importance: 'High',
    status: 'Mastered',
    efficiency: 90
  },
  {
    subject: 'OOPs',
    question: 'What are the 4 Pillars of Object-Oriented Programming?',
    answer: '1. Encapsulation (bundling data & methods with restricted access)\n2. Abstraction (hiding implementation complexity)\n3. Inheritance (reusing parent class properties)\n4. Polymorphism (overloading & overriding methods).',
    keyTakeaways: ['Compile-time polymorphism (overloading)', 'Run-time polymorphism (virtual functions/overriding)'],
    importance: 'High',
    status: 'Mastered',
    efficiency: 100
  },
  {
    subject: 'System Design',
    question: 'How do you scale a web application horizontally vs vertically?',
    answer: 'Vertical scaling (Scale-up) adds more CPU/RAM to a single node. Horizontal scaling (Scale-out) adds more server nodes behind a Load Balancer.',
    keyTakeaways: ['Horizontal scaling requires stateless application servers', 'Load balancers: Nginx, HAProxy, AWS ALB'],
    importance: 'High',
    status: 'Learning',
    efficiency: 80
  }
];

const defaultProjects = [
  {
    title: 'PrepPulse - Microsoft Fluent Interview Operating System',
    description: 'Fullstack MERN platform for managing DSA problem solving, CS Fundamentals, System Design, Job Applications, and STAR behavioral prep with GitHub-style contribution analytics.',
    techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Vite', 'Fluent CSS'],
    githubUrl: 'https://github.com/example/preppulse',
    liveUrl: 'https://preppulse.dev',
    status: 'In Progress',
    efficiency: 90,
    questions: [
      {
        question: 'How does the daily 3 random problem algorithm handle unique dates?',
        answer: 'Uses a deterministic hash of YYYY-MM-DD to seed the pseudo-random generator, ensuring identical recommendations throughout the day without unnecessary DB recalculation.',
        type: 'Architecture'
      },
      {
        question: 'How is the contribution heatmap rendered efficiently for 365 days?',
        answer: 'Uses SVG grid components with aggregated daily activity maps indexed by ISO date string, keeping DOM nodes minimal and rendering at 60 FPS.',
        type: 'Optimization'
      }
    ]
  }
];

const defaultJobs = [
  {
    company: 'Microsoft',
    role: 'Software Engineer II (Fullstack)',
    location: 'Redmond, WA / Remote',
    salary: '$180,000 - $220,000',
    status: 'Interviewing',
    jobUrl: 'https://careers.microsoft.com',
    notes: 'System Design round scheduled next week. Focus on Azure services, microservices, and distributed caching.',
    questions: [
      {
        question: 'Design a scalable notification service that handles millions of events per minute.',
        round: 'System Design',
        answerNotes: 'Use Kafka for event queuing, Redis for subscriber preference cache, and worker pools for push/email dispatching.'
      }
    ]
  },
  {
    company: 'Google',
    role: 'Software Engineer (L4)',
    location: 'Mountain View, CA',
    salary: '$200,000 - $250,000',
    status: 'Applied',
    jobUrl: 'https://careers.google.com',
    notes: 'Referral submitted by senior engineer.',
    questions: []
  }
];

const defaultComm = [
  {
    title: 'Tell me about a time you resolved a major technical disagreement in a team.',
    category: 'Conflict Resolution',
    situation: 'During the architecture phase of our microservice project, two senior engineers disagreed on whether to use GraphQL or REST API.',
    task: 'As the tech lead, I needed to align the team without delaying the development roadmap.',
    action: 'I organized a 1-hour benchmark spike where both team members presented concrete prototype metrics for payload size, caching, and developer velocity.',
    result: 'We agreed on REST for high-throughput public endpoints and GraphQL for flexible internal mobile dashboard queries. Delivered 3 days ahead of schedule.',
    fullAnswer: 'I approach technical disputes through data-driven spikes rather than subjective arguments...',
    confidenceLevel: 'High',
    efficiency: 90
  },
  {
    title: 'What is your biggest weakness and how are you working to overcome it?',
    category: 'HR / Basic',
    situation: 'Earlier in my career, I tended to over-engineer solutions, spending extra time implementing edge-case abstractions.',
    task: 'I realized this impacted sprint velocity on fast-paced projects.',
    action: 'I adopted YAGNI (You Aren\'t Gonna Need It) and instituted strict timeboxing for initial pull requests, focusing on core requirements first.',
    result: 'Improved my feature delivery speed by 40% while preserving code readability.',
    fullAnswer: 'I used to over-engineer abstractions, but now I practice iterative refactoring...',
    confidenceLevel: 'High',
    efficiency: 95
  }
];

// Generates 365 days of sample daily activity to render a beautiful initial Heatmap!
const generateInitialHeatmapData = () => {
  const activities = [];
  const today = new Date();
  
  for (let i = 180; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    // Simulate periodic activity
    // Higher activity on weekdays
    const dayOfWeek = d.getDay();
    const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
    
    // Seeded random for consistency
    const rand = (Math.sin(i * 12.345) + 1) / 2;
    
    if (rand > (isWeekend ? 0.6 : 0.35)) {
      const solved = Math.floor(rand * 5) + 1;
      const efficiency = Math.floor(70 + rand * 30); // 70% to 100%
      activities.push({
        date: dateStr,
        solvedCount: solved,
        averageEfficiency: efficiency,
        studyHours: Number((solved * 0.75).toFixed(1)),
        itemsSolved: Array.from({ length: solved }, (_, idx) => ({
          section: 'DSA',
          itemId: `p-${idx}`,
          title: `Problem #${idx + 1}`,
          efficiency: efficiency
        }))
      });
    }
  }

  return activities;
};

const runSeeder = async () => {
  try {
    const problemDocs = await seedDataFromFile();
    console.log(`[Seeder]: Prepared ${problemDocs.length} DSA problems from Striver's A2Z sheet.`);

    if (mongoose.connection.readyState === 1) {
      // Clean and seed DB
      const existingCount = await Problem.countDocuments();
      if (existingCount === 0) {
        await Problem.insertMany(problemDocs);
        console.log(`[Seeder]: Inserted ${problemDocs.length} problems into MongoDB.`);
      } else {
        console.log(`[Seeder]: MongoDB already contains ${existingCount} problems. Skipping initial insert.`);
      }

      const coreCount = await CoreQuestion.countDocuments();
      if (coreCount === 0) {
        await CoreQuestion.insertMany(defaultCoreQuestions);
        console.log(`[Seeder]: Inserted default Core CS questions.`);
      }

      const projCount = await Project.countDocuments();
      if (projCount === 0) {
        await Project.insertMany(defaultProjects);
        console.log(`[Seeder]: Inserted default Projects.`);
      }

      const jobCount = await JobApplication.countDocuments();
      if (jobCount === 0) {
        await JobApplication.insertMany(defaultJobs);
        console.log(`[Seeder]: Inserted default Job Applications.`);
      }

      const commCount = await Communication.countDocuments();
      if (commCount === 0) {
        await Communication.insertMany(defaultComm);
        console.log(`[Seeder]: Inserted default Communication items.`);
      }

      const actCount = await DailyActivity.countDocuments();
      if (actCount === 0) {
        const heatmapDocs = generateInitialHeatmapData();
        await DailyActivity.insertMany(heatmapDocs);
        console.log(`[Seeder]: Inserted ${heatmapDocs.length} days of initial activity data for Heatmap.`);
      }
    }

    return {
      problems: problemDocs,
      core: defaultCoreQuestions,
      projects: defaultProjects,
      jobs: defaultJobs,
      comm: defaultComm,
      heatmap: generateInitialHeatmapData()
    };
  } catch (err) {
    console.error(`[Seeder Error]: ${err.message}`);
    return null;
  }
};

module.exports = { runSeeder, seedDataFromFile, generateInitialHeatmapData };
