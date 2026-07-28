import React from 'react';
import Heatmap from '../components/Heatmap';
import DailyThree from '../components/DailyThree';
import StatCard from '../components/StatCard';
import { 
  Code2, 
  Cpu, 
  FolderGit2, 
  Briefcase, 
  MessageSquare, 
  CheckCircle2,
  Award,
  Flame,
  Zap,
  ArrowRight
} from 'lucide-react';

export default function Dashboard({ 
  heatmapData, 
  dailyThree, 
  onSolveDsa, 
  dsaList, 
  coreList, 
  projectList, 
  jobList, 
  commList,
  setActiveTab
}) {
  // Compute Section Stats
  const totalDsa = dsaList.length || 474;
  const solvedDsa = dsaList.filter(p => p.status === 'Solved').length;
  const dsaProgress = Math.round((solvedDsa / (totalDsa || 1)) * 100);

  const totalCore = coreList.length || 5;
  const masteredCore = coreList.filter(c => c.status === 'Mastered').length;
  const coreProgress = Math.round((masteredCore / (totalCore || 1)) * 100);

  const totalProjects = projectList.length || 1;
  const completedProjects = projectList.filter(p => p.status === 'Completed').length;

  const totalJobs = jobList.length || 2;
  const activeJobs = jobList.filter(j => j.status === 'Interviewing' || j.status === 'Applied').length;

  const totalComm = commList.length || 2;
  const highConfComm = commList.filter(c => c.confidenceLevel === 'High').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Welcome & Target Banner */}
      <div className="fluent-card fluent-card-glow" style={{
        background: 'linear-gradient(135deg, rgba(0, 120, 212, 0.25), rgba(0, 188, 242, 0.15))',
        border: '1px solid rgba(0, 188, 242, 0.3)',
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.8rem', padding: '2px 10px', borderRadius: '12px', background: 'rgba(0,188,242,0.2)', color: '#00BCF2', fontWeight: 700 }}>
              🚀 Microsoft Fluent Interview Operating System
            </span>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Welcome back to your Daily Prep Command Center!
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            All 474 Striver A2Z problems loaded. Solve today's 3 random picks to maintain your efficiency streak!
          </p>
        </div>

        <button
          onClick={() => setActiveTab('dsa')}
          className="fluent-btn fluent-btn-primary"
          style={{ padding: '10px 20px', fontSize: '0.9rem' }}
        >
          Explore Striver Sheet <ArrowRight size={16} />
        </button>
      </div>

      {/* 4 Overview Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        <StatCard
          title="DSA Sheet Solved"
          value={`${solvedDsa} / ${totalDsa}`}
          subtext={`${dsaProgress}% completed of Striver A2Z`}
          icon={Code2}
          color="#00BCF2"
          progress={dsaProgress}
        />
        <StatCard
          title="Core CS Fundamentals"
          value={`${masteredCore} / ${totalCore}`}
          subtext="OS, DBMS, CN, System Design"
          icon={Cpu}
          color="#10B981"
          progress={coreProgress}
        />
        <StatCard
          title="Active Job Pipeline"
          value={`${activeJobs} Applications`}
          subtext={`${jobList.filter(j => j.status === 'Interviewing').length} currently interviewing`}
          icon={Briefcase}
          color="#F2C94C"
          progress={Math.round((activeJobs / (totalJobs || 1)) * 100)}
        />
        <StatCard
          title="STAR Behavioral Stories"
          value={`${highConfComm} High Conf.`}
          subtext={`${totalComm} total HR stories ready`}
          icon={MessageSquare}
          color="#8764B8"
          progress={Math.round((highConfComm / (totalComm || 1)) * 100)}
        />
      </div>

      {/* Daily 3 Random Problems Widget */}
      <DailyThree problems={dailyThree} onSolve={onSolveDsa} />

      {/* GitHub / LeetCode Style Daily Contribution Heatmap */}
      <Heatmap heatmapData={heatmapData} />

      {/* 5 Prep Sections Quick Navigation Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {/* DSA Card */}
        <div className="fluent-card" onClick={() => setActiveTab('dsa')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Code2 size={22} color="#00BCF2" />
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>1. DSA Hub</h3>
            </div>
            <span className="fluent-badge badge-solved">474 Problems</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
            Master Data Structures & Algorithms using Striver's A2Z sheet with filters by difficulty, topic & article links.
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', fontWeight: 700, color: '#00BCF2' }}>
            <span>Open DSA Sheet</span>
            <ArrowRight size={16} />
          </div>
        </div>

        {/* CORE Card */}
        <div className="fluent-card" onClick={() => setActiveTab('core')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Cpu size={22} color="#10B981" />
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>2. CORE CS</h3>
            </div>
            <span className="fluent-badge badge-solved" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.3)' }}>5 Topics</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
            Revise Operating Systems, DBMS, Computer Networks, OOPs, and System Design with flashcard Q&A notes.
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', fontWeight: 700, color: '#10B981' }}>
            <span>Open Core Subjects</span>
            <ArrowRight size={16} />
          </div>
        </div>

        {/* Project Card */}
        <div className="fluent-card" onClick={() => setActiveTab('project')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FolderGit2 size={22} color="#F472B6" />
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>3. Projects Vault</h3>
            </div>
            <span className="fluent-badge badge-unsolved">{totalProjects} Projects</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
            Portfolio showcases, technical architecture decisions, system bottlenecks, and project specific interview Q&A.
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', fontWeight: 700, color: '#F472B6' }}>
            <span>View Projects</span>
            <ArrowRight size={16} />
          </div>
        </div>

        {/* Apply Card */}
        <div className="fluent-card" onClick={() => setActiveTab('apply')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Briefcase size={22} color="#F2C94C" />
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>4. Job Applications</h3>
            </div>
            <span className="fluent-badge badge-medium">{totalJobs} Tracked</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
            Kanban job application pipeline, interview round updates, salary negotiations, and company interview question logs.
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', fontWeight: 700, color: '#F2C94C' }}>
            <span>Open Job Tracker</span>
            <ArrowRight size={16} />
          </div>
        </div>

        {/* Communication Card */}
        <div className="fluent-card" onClick={() => setActiveTab('communication')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MessageSquare size={22} color="#8764B8" />
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>5. Communication</h3>
            </div>
            <span className="fluent-badge badge-revising">STAR Method</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
            Craft high-impact Situation, Task, Action, Result stories for HR, behavioral, leadership, and conflict resolution rounds.
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', fontWeight: 700, color: '#8764B8' }}>
            <span>Open Communication</span>
            <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </div>
  );
}
