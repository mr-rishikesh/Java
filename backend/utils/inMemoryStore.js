const { seedDataFromFile, generateInitialHeatmapData } = require('./seeder');

class InMemoryStore {
  constructor() {
    this.problems = [];
    this.core = [];
    this.projects = [];
    this.jobs = [];
    this.comm = [];
    this.activities = [];
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;
    const problemDocs = await seedDataFromFile();
    this.problems = problemDocs.map((p, idx) => ({ ...p, _id: `mem_p_${idx + 1}` }));
    
    this.core = [
      {
        _id: 'mem_c_1',
        subject: 'Operating Systems',
        question: 'What is the difference between a Process and a Thread?',
        answer: 'A Process is an executing instance of a program with independent memory space. A Thread is a lightweight execution segment within a process sharing memory.',
        keyTakeaways: ['Isolated memory space vs shared memory', 'Process creation overhead is higher'],
        importance: 'High',
        status: 'Learning',
        efficiency: 85
      },
      {
        _id: 'mem_c_2',
        subject: 'DBMS',
        question: 'Explain ACID Properties in Relational Databases.',
        answer: 'Atomicity, Consistency, Isolation, Durability. Ensures reliability during concurrent transactions.',
        keyTakeaways: ['Atomicity prevents partial writes', 'Isolation levels handle concurrency'],
        importance: 'High',
        status: 'Mastered',
        efficiency: 95
      },
      {
        _id: 'mem_c_3',
        subject: 'System Design',
        question: 'How do you scale a web application horizontally vs vertically?',
        answer: 'Vertical scaling (Scale-up) adds CPU/RAM to a single server. Horizontal scaling (Scale-out) adds more server nodes behind a Load Balancer.',
        keyTakeaways: ['Horizontal scaling requires stateless app servers', 'Use Redis for session sharing'],
        importance: 'High',
        status: 'Learning',
        efficiency: 80
      }
    ];

    this.projects = [
      {
        _id: 'mem_proj_1',
        title: 'PrepPulse - Microsoft Fluent Interview Operating System',
        description: 'Fullstack MERN platform for managing DSA problem solving, CS Fundamentals, System Design, Job Applications, and STAR behavioral prep.',
        techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Vite', 'Fluent CSS'],
        githubUrl: 'https://github.com/example/preppulse',
        liveUrl: 'https://preppulse.dev',
        status: 'In Progress',
        efficiency: 90,
        questions: [
          {
            _id: 'q_1',
            question: 'How does the daily 3 random problem algorithm handle unique dates?',
            answer: 'Uses a deterministic hash of YYYY-MM-DD to seed the pseudo-random generator, ensuring identical recommendations throughout the day.',
            type: 'Architecture'
          }
        ],
        improvements: []
      }
    ];

    this.jobs = [
      {
        _id: 'mem_job_1',
        company: 'Microsoft',
        role: 'Software Engineer II (Fullstack)',
        location: 'Redmond, WA / Remote',
        salary: '$180,000 - $220,000',
        status: 'Interviewing',
        appliedDate: new Date(),
        jobUrl: 'https://careers.microsoft.com',
        notes: 'System Design round scheduled next week. Focus on Azure services, microservices, and distributed caching.',
        questions: [
          {
            _id: 'jq_1',
            question: 'Design a scalable notification service that handles millions of events per minute.',
            round: 'System Design',
            answerNotes: 'Use Kafka for event queuing and Redis for subscriber preferences.'
          }
        ]
      },
      {
        _id: 'mem_job_2',
        company: 'Google',
        role: 'Software Engineer (L4)',
        location: 'Mountain View, CA',
        salary: '$200,000 - $250,000',
        status: 'Applied',
        appliedDate: new Date(),
        jobUrl: 'https://careers.google.com',
        notes: 'Referral submitted by senior engineer.',
        questions: []
      }
    ];

    this.comm = [
      {
        _id: 'mem_comm_1',
        title: 'Tell me about a time you resolved a major technical disagreement in a team.',
        category: 'Conflict Resolution',
        situation: 'During the architecture phase of our microservice project, engineers disagreed on GraphQL vs REST.',
        task: 'As tech lead, I needed to align the team without delaying the development roadmap.',
        action: 'I organized a 1-hour benchmark spike where both members presented prototype metrics.',
        result: 'Agreed on REST for high-throughput public endpoints and GraphQL for flexible internal mobile dashboard queries.',
        fullAnswer: 'I approach technical disputes through data-driven spikes rather than subjective arguments.',
        confidenceLevel: 'High',
        efficiency: 90
      }
    ];

    this.activities = generateInitialHeatmapData().map((a, idx) => ({ ...a, _id: `mem_act_${idx}` }));
    this.initialized = true;
    console.log(`[InMemoryStore]: Initialized with ${this.problems.length} problems.`);
  }

  // DSA Problems
  getProblems(filters = {}) {
    let list = [...this.problems];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(p => p.problem_name.toLowerCase().includes(q) || p.subcategory_name.toLowerCase().includes(q));
    }
    if (filters.category) {
      list = list.filter(p => p.category_name === filters.category);
    }
    if (filters.subcategory) {
      list = list.filter(p => p.subcategory_name === filters.subcategory);
    }
    if (filters.difficulty) {
      list = list.filter(p => p.difficulty === filters.difficulty);
    }
    if (filters.status) {
      list = list.filter(p => p.status === filters.status);
    }
    return list;
  }

  _getRandomProblemForSlot(slotType, excludedIds = []) {
    const now = new Date();
    const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const filterBase = (p) => {
      if (p.status === 'Solved') return false;
      if (p.neverShow === true) return false;
      
      const probId = p._id || p.problem_id;
      if (excludedIds.includes(probId)) return false;

      if (p.snoozeUntil && new Date(p.snoozeUntil) > now) return false;

      // Slot check
      if (slotType === 'dp') {
        return p.category_name === 'Dynamic Programming [Patterns and Problems]';
      } else if (slotType === 'graph') {
        return p.category_name === 'Graphs [Concepts & Problems]';
      } else {
        return p.category_name !== 'Dynamic Programming [Patterns and Problems]' && p.category_name !== 'Graphs [Concepts & Problems]';
      }
    };

    // Primary: not solved, not snoozed, slot match, and not shown in last 30 days
    let pool = this.problems.filter(p => {
      if (!filterBase(p)) return false;
      if (p.lastPresentedAt && new Date(p.lastPresentedAt) > oneMonthAgo) return false;
      return true;
    });

    // Fallback 1: Relax 30-day constraint
    if (pool.length === 0) {
      pool = this.problems.filter(p => filterBase(p));
    }

    // Fallback 2: Relax snooze limit to prevent crash
    if (pool.length === 0) {
      pool = this.problems.filter(p => {
        const probId = p._id || p.problem_id;
        if (excludedIds.includes(probId)) return false;
        if (slotType === 'dp') {
          return p.category_name === 'Dynamic Programming [Patterns and Problems]';
        } else if (slotType === 'graph') {
          return p.category_name === 'Graphs [Concepts & Problems]';
        } else {
          return p.category_name !== 'Dynamic Programming [Patterns and Problems]' && p.category_name !== 'Graphs [Concepts & Problems]';
        }
      });
    }

    if (pool.length === 0) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  updateProblem(id, updateData) {
    const idx = this.problems.findIndex(p => p._id === id || p.problem_id === id);
    if (idx !== -1) {
      const oldStatus = this.problems[idx].status;
      const prob = this.problems[idx];
      
      const mergedUpdates = { ...updateData };
      if (updateData.status === 'Revising') {
        mergedUpdates.neverShow = false;
      }
      
      this.problems[idx] = { ...prob, ...mergedUpdates };
      
      const isSolved = updateData.status === 'Solved' && oldStatus !== 'Solved';
      const isRevising = updateData.status === 'Revising';
      const isSnoozed = updateData.snoozeUntil || updateData.neverShow;
      
      if (isSolved || isRevising || isSnoozed) {
        const todayStr = new Date().toISOString().split('T')[0];
        let act = this.activities.find(a => a.date === todayStr);
        if (act && act.activeDailyProblems) {
          const probId = prob._id || prob.problem_id;
          const activeIdx = act.activeDailyProblems.indexOf(probId);
          if (activeIdx !== -1) {
            let slotType = 'other';
            if (prob.category_name === 'Dynamic Programming [Patterns and Problems]') {
              slotType = 'dp';
            } else if (prob.category_name === 'Graphs [Concepts & Problems]') {
              slotType = 'graph';
            }

            const replacement = this._getRandomProblemForSlot(slotType, act.activeDailyProblems);
            if (replacement) {
              act.activeDailyProblems[activeIdx] = replacement._id || replacement.problem_id;
              replacement.lastPresentedAt = new Date();
            } else {
              act.activeDailyProblems.splice(activeIdx, 1);
            }
          }
        }
      }
      
      return this.problems[idx];
    }
    return null;
  }

  addProblem(prob) {
    const newProb = {
      ...prob,
      _id: `mem_p_custom_${Date.now()}`,
      problem_id: `custom_${Date.now()}`,
      status: prob.status || 'Unsolved',
      efficiency: prob.efficiency || 0,
      isCustom: true
    };
    this.problems.unshift(newProb);
    return newProb;
  }

  getDailyThree() {
    const todayStr = new Date().toISOString().split('T')[0];
    let act = this.activities.find(a => a.date === todayStr);
    if (!act) {
      act = {
        _id: `mem_act_${Date.now()}`,
        date: todayStr,
        solvedCount: 0,
        averageEfficiency: 0,
        studyHours: 0,
        itemsSolved: [],
        activeDailyProblems: []
      };
      this.activities.push(act);
    }

    if (!act.activeDailyProblems || act.activeDailyProblems.length < 3) {
      const selected = [];

      // Slot 1: DP
      const dpProb = this._getRandomProblemForSlot('dp', []);
      if (dpProb) {
        selected.push(dpProb);
        dpProb.lastPresentedAt = new Date();
      }

      // Slot 2: Graph
      const graphProb = this._getRandomProblemForSlot('graph', selected.map(p => p._id || p.problem_id));
      if (graphProb) {
        selected.push(graphProb);
        graphProb.lastPresentedAt = new Date();
      }

      // Slot 3: Other
      const otherProb = this._getRandomProblemForSlot('other', selected.map(p => p._id || p.problem_id));
      if (otherProb) {
        selected.push(otherProb);
        otherProb.lastPresentedAt = new Date();
      }

      act.activeDailyProblems = selected.map(p => p._id || p.problem_id);
    }

    return act.activeDailyProblems.map(id => this.problems.find(p => p._id === id || p.problem_id === id)).filter(Boolean);
  }

  // Core
  getCore() { return this.core; }
  addCore(q) {
    const newQ = { ...q, _id: `mem_c_${Date.now()}` };
    this.core.unshift(newQ);
    return newQ;
  }
  updateCore(id, data) {
    const idx = this.core.findIndex(c => c._id === id);
    if (idx !== -1) {
      this.core[idx] = { ...this.core[idx], ...data };
      return this.core[idx];
    }
    return null;
  }

  // Projects
  getProjects() { return this.projects; }
  addProject(p) {
    const newP = { ...p, _id: `mem_proj_${Date.now()}`, questions: p.questions || [], improvements: p.improvements || [] };
    this.projects.unshift(newP);
    return newP;
  }
  addProjectQuestion(projId, q) {
    const proj = this.projects.find(p => p._id === projId);
    if (proj) {
      const newQ = { ...q, _id: `pq_${Date.now()}` };
      proj.questions.push(newQ);
      return proj;
    }
    return null;
  }
  addProjectImprovement(projId, imp) {
    const proj = this.projects.find(p => p._id === projId);
    if (proj) {
      if (!proj.improvements) proj.improvements = [];
      const newImp = {
        ...imp,
        _id: `imp_${Date.now()}`,
        createdAt: new Date()
      };
      proj.improvements.push(newImp);
      
      // Also log activity in daily activities
      this.logActivity({
        date: imp.date,
        section: 'Project',
        itemId: projId,
        title: `Improved ${proj.title}: ${imp.description}`,
        efficiency: imp.efficiency
      });
      
      return proj;
    }
    return null;
  }

  // Jobs
  getJobs() { return this.jobs; }
  addJob(j) {
    const newJ = { ...j, _id: `mem_job_${Date.now()}`, questions: j.questions || [], appliedDate: new Date() };
    this.jobs.unshift(newJ);
    return newJ;
  }
  updateJob(id, data) {
    const idx = this.jobs.findIndex(j => j._id === id);
    if (idx !== -1) {
      this.jobs[idx] = { ...this.jobs[idx], ...data };
      return this.jobs[idx];
    }
    return null;
  }
  addJobQuestion(jobId, q) {
    const job = this.jobs.find(j => j._id === jobId);
    if (job) {
      const newQ = { ...q, _id: `jq_${Date.now()}` };
      job.questions.push(newQ);
      return job;
    }
    return null;
  }

  // Communication
  getComm() { return this.comm; }
  addComm(c) {
    const newC = { ...c, _id: `mem_comm_${Date.now()}` };
    this.comm.unshift(newC);
    return newC;
  }
  updateComm(id, data) {
    const idx = this.comm.findIndex(c => c._id === id);
    if (idx !== -1) {
      this.comm[idx] = { ...this.comm[idx], ...data };
      return this.comm[idx];
    }
    return null;
  }

  // Activity / Heatmap
  getActivities() { return this.activities; }
  logActivity({ date, section, itemId, title, efficiency }) {
    const dateStr = date || new Date().toISOString().split('T')[0];
    let act = this.activities.find(a => a.date === dateStr);
    if (!act) {
      act = {
        _id: `mem_act_${Date.now()}`,
        date: dateStr,
        solvedCount: 0,
        averageEfficiency: 0,
        studyHours: 0,
        itemsSolved: []
      };
      this.activities.push(act);
    }
    act.solvedCount += 1;
    act.itemsSolved.push({ section: section || 'DSA', itemId, title, efficiency: efficiency || 100 });
    
    // Recalculate average efficiency
    const totalEff = act.itemsSolved.reduce((sum, item) => sum + (item.efficiency || 100), 0);
    act.averageEfficiency = Math.round(totalEff / act.itemsSolved.length);
    act.studyHours = Number((act.solvedCount * 0.75).toFixed(1));
    return act;
  }
}

const store = new InMemoryStore();
module.exports = store;
