import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

import Dashboard from './pages/Dashboard';
import DsaPage from './pages/DsaPage';
import CorePage from './pages/CorePage';
import ProjectsPage from './pages/ProjectsPage';
import ApplyPage from './pages/ApplyPage';
import CommPage from './pages/CommPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.remove('fluent-dark');
      document.body.classList.add('fluent-light');
    } else {
      document.body.classList.remove('fluent-light');
      document.body.classList.add('fluent-dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Data states
  const [heatmapData, setHeatmapData] = useState({});
  const [dailyThree, setDailyThree] = useState([]);
  const [dsaList, setDsaList] = useState([]);
  const [coreList, setCoreList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [jobList, setJobList] = useState([]);
  const [commList, setCommList] = useState([]);
  const [stats, setStats] = useState({ streak: 7, avgEfficiency: 88 });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);

      // 1. Heatmap
      const heatRes = await fetch('/api/progress/heatmap');
      const heatJson = await heatRes.json();
      if (heatJson.success) setHeatmapData(heatJson.data || {});

      // 2. Daily Three
      const d3Res = await fetch('/api/dsa/daily-three');
      const d3Json = await d3Res.json();
      if (d3Json.success) setDailyThree(d3Json.data || []);

      // 3. DSA Problems
      const dsaRes = await fetch('/api/dsa');
      const dsaJson = await dsaRes.json();
      if (dsaJson.success) setDsaList(dsaJson.data || []);

      // 4. Core
      const coreRes = await fetch('/api/core');
      const coreJson = await coreRes.json();
      if (coreJson.success) setCoreList(coreJson.data || []);

      // 5. Projects
      const projRes = await fetch('/api/projects');
      const projJson = await projRes.json();
      if (projJson.success) setProjectList(projJson.data || []);

      // 6. Apply Jobs
      const jobRes = await fetch('/api/apply');
      const jobJson = await jobRes.json();
      if (jobJson.success) setJobList(jobJson.data || []);

      // 7. Communication
      const commRes = await fetch('/api/communication');
      const commJson = await commRes.json();
      if (commJson.success) setCommList(commJson.data || []);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update Problem status & log heatmap activity
  const handleUpdateDsaStatus = async (id, updateData) => {
    try {
      const res = await fetch(`/api/dsa/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      const json = await res.json();
      if (json.success) {
        // Refresh local state
        setDsaList(prev => prev.map(p => (p._id === id || p.problem_id === id) ? { ...p, ...json.data } : p));
        
        // Refresh daily picks to pull swapped-in problems immediately
        const d3Res = await fetch('/api/dsa/daily-three');
        const d3Json = await d3Res.json();
        if (d3Json.success) setDailyThree(d3Json.data || []);
        
        // Refresh heatmap
        const heatRes = await fetch('/api/progress/heatmap');
        const heatJson = await heatRes.json();
        if (heatJson.success) setHeatmapData(heatJson.data || {});
      }
    } catch (e) {
      console.error('Error updating DSA problem:', e);
    }
  };

  // Add custom problem
  const handleAddCustomDsa = async (probData) => {
    try {
      const res = await fetch('/api/dsa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(probData)
      });
      const json = await res.json();
      if (json.success) {
        setDsaList(prev => [json.data, ...prev]);
      }
    } catch (e) {
      console.error('Error adding custom DSA problem:', e);
    }
  };

  // Core handlers
  const handleAddCore = async (coreData) => {
    try {
      const res = await fetch('/api/core', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(coreData)
      });
      const json = await res.json();
      if (json.success) setCoreList(prev => [json.data, ...prev]);
    } catch (e) {
      console.error('Error adding core question:', e);
    }
  };

  const handleUpdateCore = async (id, data) => {
    try {
      const res = await fetch(`/api/core/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (json.success) {
        setCoreList(prev => prev.map(c => c._id === id ? { ...c, ...json.data } : c));
      }
    } catch (e) {
      console.error('Error updating core question:', e);
    }
  };

  // Project handlers
  const handleAddProject = async (projData) => {
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projData)
      });
      const json = await res.json();
      if (json.success) setProjectList(prev => [json.data, ...prev]);
    } catch (e) {
      console.error('Error adding project:', e);
    }
  };

  const handleAddProjectQuestion = async (projId, qData) => {
    try {
      const res = await fetch(`/api/projects/${projId}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(qData)
      });
      const json = await res.json();
      if (json.success) {
        setProjectList(prev => prev.map(p => p._id === projId ? json.data : p));
      }
    } catch (e) {
      console.error('Error adding project question:', e);
    }
  };

  const handleAddProjectImprovement = async (projId, impData) => {
    try {
      const res = await fetch(`/api/projects/${projId}/improvements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(impData)
      });
      const json = await res.json();
      if (json.success) {
        setProjectList(prev => prev.map(p => p._id === projId ? json.data : p));
        
        // Refresh heatmap data
        const heatRes = await fetch('/api/progress/heatmap');
        const heatJson = await heatRes.json();
        if (heatJson.success) setHeatmapData(heatJson.data || {});
      }
    } catch (e) {
      console.error('Error adding project improvement:', e);
    }
  };

  // Job Application handlers
  const handleAddJob = async (jobData) => {
    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData)
      });
      const json = await res.json();
      if (json.success) setJobList(prev => [json.data, ...prev]);
    } catch (e) {
      console.error('Error adding job application:', e);
    }
  };

  const handleUpdateJobStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/apply/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const json = await res.json();
      if (json.success) {
        setJobList(prev => prev.map(j => j._id === id ? { ...j, status } : j));
      }
    } catch (e) {
      console.error('Error updating job status:', e);
    }
  };

  const handleAddJobQuestion = async (jobId, qData) => {
    try {
      const res = await fetch(`/api/apply/${jobId}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(qData)
      });
      const json = await res.json();
      if (json.success) {
        setJobList(prev => prev.map(j => j._id === jobId ? json.data : j));
      }
    } catch (e) {
      console.error('Error adding company question:', e);
    }
  };

  // Communication handlers
  const handleAddComm = async (commData) => {
    try {
      const res = await fetch('/api/communication', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commData)
      });
      const json = await res.json();
      if (json.success) setCommList(prev => [json.data, ...prev]);
    } catch (e) {
      console.error('Error adding comm item:', e);
    }
  };

  const handleUpdateComm = async (id, data) => {
    try {
      const res = await fetch(`/api/communication/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (json.success) {
        setCommList(prev => prev.map(c => c._id === id ? { ...c, ...data } : c));
      }
    } catch (e) {
      console.error('Error updating comm item:', e);
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="main-content">
        <Navbar
          activeTab={activeTab}
          onRefresh={fetchData}
          stats={stats}
          searchQuery={searchQuery}
          setSearchQuery={(q) => {
            setSearchQuery(q);
            if (q && activeTab !== 'dsa') setActiveTab('dsa');
          }}
          theme={theme}
          toggleTheme={() => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))}
        />

        <main className="page-container">
          {activeTab === 'dashboard' && (
            <Dashboard
              heatmapData={heatmapData}
              dailyThree={dailyThree}
              onSolveDsa={(id, status, eff) => handleUpdateDsaStatus(id, { status, efficiency: eff })}
              dsaList={dsaList}
              coreList={coreList}
              projectList={projectList}
              jobList={jobList}
              commList={commList}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'dsa' && (
            <DsaPage
              problems={dsaList}
              dailyThree={dailyThree}
              onUpdateStatus={(id, data) => handleUpdateDsaStatus(id, data)}
              onAddCustom={handleAddCustomDsa}
            />
          )}

          {activeTab === 'core' && (
            <CorePage
              coreList={coreList}
              onAddCore={handleAddCore}
              onUpdateCore={handleUpdateCore}
            />
          )}

          {activeTab === 'project' && (
            <ProjectsPage
              projectList={projectList}
              onAddProject={handleAddProject}
              onAddQuestion={handleAddProjectQuestion}
              onAddImprovement={handleAddProjectImprovement}
            />
          )}

          {activeTab === 'apply' && (
            <ApplyPage
              jobList={jobList}
              onAddJob={handleAddJob}
              onUpdateJobStatus={handleUpdateJobStatus}
              onAddCompanyQuestion={handleAddJobQuestion}
            />
          )}

          {activeTab === 'communication' && (
            <CommPage
              commList={commList}
              onAddComm={handleAddComm}
              onUpdateComm={handleUpdateComm}
            />
          )}
        </main>
      </div>
    </div>
  );
}
