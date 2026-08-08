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
  try {
    let sheet;
    try {
      sheet = require('../strivers_a2z_sheet.json');
    } catch (e) {
      sheet = require('../../strivers_a2z_sheet.json');
    }
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
  } catch (error) {
    console.error('[Seeder Error]: Failed to load strivers_a2z_sheet.json', error);
    return [];
  }
};

const defaultCoreQuestions = [
  {
    subject: 'Core Subject',
    question: 'Operating Systems & DBMS Core Fundamentals',
    answer: 'Studied Process vs Thread memory isolation and reviewed ACID transaction isolation levels in relational databases.',
    keyTakeaways: ['Isolated memory vs Shared memory', 'ACID Isolation levels: Read Committed & Serializable'],
    importance: 'High',
    status: 'Completed',
    efficiency: 90
  },
  {
    subject: 'Java',
    question: 'Java Multithreading & Executor Framework Spike',
    answer: 'Implemented custom ThreadPoolExecutor with ArrayBlockingQueue and graceful shutdown hooks to handle concurrent task processing.',
    keyTakeaways: ['ThreadPoolExecutor worker threads', 'RejectedExecutionHandler policy'],
    importance: 'High',
    status: 'Completed',
    efficiency: 95
  },
  {
    subject: 'System',
    question: 'System Design: Distributed Caching & Rate Limiting',
    answer: 'Designed Redis distributed cache strategy with TTL eviction and implemented Sliding Window Counter for API Gateway rate limiting.',
    keyTakeaways: ['Redis Cache-aside pattern', 'Sliding Window Rate Limiter algorithm'],
    importance: 'High',
    status: 'In Progress',
    efficiency: 85
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
      
      const itemsSolved = Array.from({ length: solved }, (_, idx) => {
        let section = 'DSA';
        let title = `Solved DSA: Problem #${idx + 1}`;
        
        // Seeded category selector
        const sectRand = (Math.sin(i * 9.87 + idx) + 1) / 2;
        if (sectRand > 0.82) {
          section = 'Project';
          const projects = ['PrepPulse Dashboard', 'Secure Auth Service', 'Fluent CSS Library'];
          const improvements = [
            'Optimized MongoDB indexes and query execution plans',
            'Implemented custom Fluent UI dark-mode components',
            'Fixed thread concurrency pool leak in backend',
            'Added responsive sidebar design layout for tablets'
          ];
          const projName = projects[Math.floor(sectRand * projects.length) % projects.length];
          const impDesc = improvements[idx % improvements.length];
          title = `Improved ${projName}: ${impDesc}`;
        } else if (sectRand > 0.68) {
          section = 'CORE';
          const topics = ['Operating Systems', 'DBMS', 'Computer Networks', 'System Design'];
          const questions = [
            'Reviewed Process vs Thread memory virtualization and scheduling overhead',
            'Revised ACID Transaction Isolation levels and Read/Write locks',
            'Studied TCP 3-Way Handshake, Flow Control, and Congestion Avoidance',
            'Designed Distributed Caching strategy using Redis and Sliding Window Rate Limiting'
          ];
          const topicName = topics[Math.floor(sectRand * topics.length) % topics.length];
          const questionDesc = questions[idx % questions.length];
          title = `CORE [${topicName}]: ${questionDesc}`;
        }
        
        return {
          section,
          itemId: `seeded-${section.toLowerCase()}-${idx}`,
          title,
          efficiency: Math.max(50, Math.min(100, Math.floor(efficiency - (idx * 2))))
        };
      });

      activities.push({
        date: dateStr,
        solvedCount: solved,
        averageEfficiency: efficiency,
        studyHours: Number((solved * 0.75).toFixed(1)),
        itemsSolved: itemsSolved
      });
    }
  }

  return activities;
};

const runSeeder = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      const existingCount = await Problem.countDocuments();
      if (existingCount > 0) {
        console.log(`[Seeder]: MongoDB already contains ${existingCount} problems. Skipping parsing and initial insert.`);
        return {
          problems: [],
          core: [],
          projects: [],
          jobs: [],
          comm: [],
          heatmap: []
        };
      }
    }

    const problemDocs = await seedDataFromFile();
    console.log(`[Seeder]: Prepared ${problemDocs.length} DSA problems from Striver's A2Z sheet.`);

    if (mongoose.connection.readyState === 1) {
      await Problem.insertMany(problemDocs);
      console.log(`[Seeder]: Inserted ${problemDocs.length} problems into MongoDB.`);
    }

    return {
      problems: problemDocs,
      core: [],
      projects: [],
      jobs: [],
      comm: [],
      heatmap: []
    };
  } catch (err) {
    console.error(`[Seeder Error]: ${err.message}`);
    return null;
  }
};

module.exports = { runSeeder, seedDataFromFile, generateInitialHeatmapData };
