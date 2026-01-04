import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import { Plus, Search as SearchIcon, Settings, User as UserIcon } from 'lucide-react';

const formatCurrency = (num) => "Rs. " + num.toLocaleString();
// Fix: Remove 'Rs.' explicitly before parsing to avoid keeping the abbreviation dot
const parseCurrency = (str) => {
  if (!str) return 0;
  const cleanStr = str.replace(/Rs\.\s*/i, '').replace(/,/g, '');
  return Number(cleanStr);
};

const Dashboard = () => {
  const { state } = useLocation();
  const userType = state?.type || 'user'; // 'guest' or 'user' (default)

  const [activeTab, setActiveTab] = useState('recents');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);

  // Project Details State
  const [selectedProject, setSelectedProject] = useState(null);

  // Form State
  const [newProject, setNewProject] = useState({
    title: '',
    company: '',
    manager: '',
    address: '',
    budget: '',
    deadline: ''
  });

  const projects = [
    {
      id: 1,
      title: 'Construction Road',
      author: 'InfraBuild Nepal',
      status: 'Ongoing',
      statusDescription: 'Phase 2: Base layer compaction complete. Waiting for final asphalt layering.',
      type: 'local',
      budget: 'Rs. 50,00,000',
      deadline: '2024-12-30',
      details: 'Full road expansion project in Kathmandu Valley connecting Ring Road to inner districts.',
      expenditures: [
        { item: 'Site Clearance & Leveling', amount: 500000 },
        { item: 'Raw Materials (Gravel/Sand)', amount: 1500000 },
        { item: 'Labor Wages (Phase 1)', amount: 800000 },
        { item: 'Machinery Rental', amount: 450000 }
      ]
    },
    {
      id: 2,
      title: 'Construction Mall',
      author: 'City Planners',
      status: 'Ongoing',
      statusDescription: 'Initial architectural designs approved. Environmental impact assessment pending.',
      type: 'local',
      budget: 'Rs. 20,00,00,000',
      deadline: '2025-06-15',
      details: 'New eco-friendly shopping complex with solar power integration.',
      expenditures: [
        { item: 'Architectural Design', amount: 1500000 },
        { item: 'Land Survey', amount: 500000 },
        { item: 'Legal & Permits', amount: 1200000 }
      ]
    },
    {
      id: 3,
      title: 'Clean Water Init',
      author: 'Global Team',
      status: 'Completed',
      statusDescription: 'Project successfully completed and handed over to the municipality.',
      type: 'national',
      budget: 'Rs. 1,00,00,000',
      deadline: '2023-10-10',
      details: 'Water purification plants installed across 5 rural districts.',
      expenditures: [
        { item: 'Purification Units', amount: 6000000 },
        { item: 'Installation', amount: 2000000 },
        { item: 'Transport', amount: 500000 },
        { item: 'Community Training', amount: 1000000 },
        { item: 'Maintenance Fund', amount: 500000 }
      ]
    },
    {
      id: 4,
      title: 'Construction Hotel',
      author: 'Hospitality Group',
      status: 'On Hold',
      statusDescription: 'Construction paused for structural integrity review by third-party auditors.',
      type: 'suggested',
      budget: 'Rs. 15,00,00,000',
      deadline: '2025-01-01',
      details: 'Luxury 5-star hotel construction aimed at boosting local tourism.',
      expenditures: [
        { item: 'Foundation Work', amount: 40000000 },
        { item: 'Steel Structure', amount: 35000000 }
      ]
    },
    {
      id: 5,
      title: 'Local Library App',
      author: 'You',
      status: 'Ongoing',
      statusDescription: 'Beta version released. Currently fixing reported bugs.',
      type: 'recents',
      budget: 'Rs. 2,00,000',
      deadline: '2024-05-20',
      details: 'Digital library management system for community schools.',
      expenditures: [
        { item: 'Server Costs', amount: 25000 },
        { item: 'Developer Stipend', amount: 100000 },
        { item: 'Domain & Assets', amount: 15000 }
      ]
    },
  ];

  const handleAddProject = (e) => {
    e.preventDefault();
    console.log("Added project:", newProject);
    setIsAddProjectOpen(false);
    setNewProject({ title: '', company: '', manager: '', address: '', budget: '', deadline: '' });
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  /* Filter logic */
  const filteredProjects = activeTab === 'recents'
    ? projects.filter(p => p.type === 'recents')
    : projects.filter(p => p.type === activeTab || (activeTab === 'home' && p.type === 'suggested'));

  // Component to render modal content
  const ProjectDetailsContent = ({ project }) => {
    if (!project) return null;

    const budgetNum = parseCurrency(project.budget);
    const totalExpenditure = project.expenditures ? project.expenditures.reduce((acc, curr) => acc + curr.amount, 0) : 0;
    const remainingBudget = budgetNum - totalExpenditure;

    return (
      <div className="project-details-view">
        <h3>{project.title}</h3>
        <div className="status-banner">
          <span className="label">Status Update ({project.status}):</span>
          <p>{project.statusDescription}</p>
        </div>

        <div className="details-grid">
          <div className="detail-item">
            <span className="label">Total Budget</span>
            <span className="value highlight">{project.budget}</span>
          </div>
          <div className="detail-item">
            <span className="label">Remaining</span>
            <span className={`value highlight ${remainingBudget < 0 ? 'text-red' : 'text-green'}`}>
              {formatCurrency(remainingBudget)}
            </span>
          </div>
          <div className="detail-item">
            <span className="label">Company</span>
            <span className="value">{project.author}</span>
          </div>
          <div className="detail-item">
            <span className="label">Deadline</span>
            <span className="value">{project.deadline}</span>
          </div>
        </div>

        <div className="expenditure-list-section">
          <h4>Expenditure Breakdown</h4>
          <div className="expenditure-table">
            <div className="table-header">
              <span>Item</span>
              <span>Amount</span>
            </div>
            {project.expenditures && project.expenditures.map((exp, idx) => (
              <div key={idx} className="table-row">
                <span>{exp.item}</span>
                <span>{formatCurrency(exp.amount)}</span>
              </div>
            ))}
            <div className="table-footer">
              <span>Total Spent</span>
              <span>{formatCurrency(totalExpenditure)}</span>
            </div>
          </div>
        </div>

        <div className="expenditure-section">
          <h4>About Project</h4>
          <p>{project.details}</p>
        </div>

        <div className="profile-actions">
          <Button onClick={() => setSelectedProject(null)}>Close</Button>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="main-content">
        {/* Header with Search */}
        <header className="dashboard-header">
          <div className="header-left">
            <h1 className="logo-text-mobile">Koshdarshi</h1>
            <div className="search-bar">
              <SearchIcon size={20} className="search-icon" />
              {/* Disabled interaction for now as requested */}
              <input type="text" placeholder="Explore" readOnly style={{ cursor: 'default' }} onClick={(e) => e.preventDefault()} />
            </div>
          </div>

          <div className="header-right">
            <button className="icon-btn" onClick={() => setIsProfileOpen(true)}>
              <Settings size={24} />
            </button>
            <button className="icon-btn profile-trigger" onClick={() => setIsProfileOpen(true)}>
              <div className="profile-placeholder">
                <UserIcon size={20} />
              </div>
            </button>
          </div>
        </header>

        {/* Categories / Tabs matching screenshot */}
        <div className="tabs-pills">
          {[
            { id: 'home', label: 'Home' },
            { id: 'local', label: 'Local(Kathmandu)' },
            { id: 'national', label: 'National' },
            { id: 'recents', label: 'Recents' }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`pill-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* List View */}
        <div className="projects-list">
          <h3>{activeTab === 'recents' ? 'Recents' : 'Suggested'}</h3>
          {filteredProjects.map((project) => (
            <div key={project.id} className="project-row" onClick={() => handleProjectClick(project)}>
              <div className="row-content">
                <h4>{project.title}</h4>
                <div className="row-meta">
                  <span>{project.author}</span> • <span className="text-primary">{project.budget}</span> • <span>{project.status}</span>
                </div>
              </div>
              <Button variant="ghost" size="sm">View</Button>
            </div>
          ))}
        </div>

        {/* Floating Add Button */}
        <button className="fab-add" onClick={() => setIsAddProjectOpen(true)}>
          <Plus size={24} /> Add
        </button>

        {/* Add Project Modal */}
        <Modal
          isOpen={isAddProjectOpen}
          onClose={() => setIsAddProjectOpen(false)}
          title="Add New Project"
        >
          <form className="add-project-form" onSubmit={handleAddProject}>
            <div className="form-grid">
              <Input label="Project:" value={newProject.title} onChange={e => setNewProject({ ...newProject, title: e.target.value })} required />
              <Input label="Company Involved:" value={newProject.company} onChange={e => setNewProject({ ...newProject, company: e.target.value })} required />
              <Input label="Project Manager:" value={newProject.manager} onChange={e => setNewProject({ ...newProject, manager: e.target.value })} />
              <Input label="Address:" value={newProject.address} onChange={e => setNewProject({ ...newProject, address: e.target.value })} />
              <Input label="Budget Allocation:" value={newProject.budget} onChange={e => setNewProject({ ...newProject, budget: e.target.value })} placeholder="Rs." />
              <Input label="Deadline:" type="date" value={newProject.deadline} onChange={e => setNewProject({ ...newProject, deadline: e.target.value })} />
            </div>
            <div className="modal-actions">
              <Button type="submit" style={{ width: '100%' }}>Done</Button>
              <Button variant="ghost" onClick={() => setIsAddProjectOpen(false)} style={{ width: '100%', marginTop: '0.5rem' }}>Cancel</Button>
            </div>
          </form>
        </Modal>

        {/* Project Details Modal */}
        <Modal
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          title="Project Expenditure"
        >
          <ProjectDetailsContent project={selectedProject} />
        </Modal>

        {/* Profile Modal */}
        <Modal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
        >
          <div className="profile-view">
            <div className="profile-pic-large">
              {/* Cat Image as requested */}
              <img src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=2043&auto=format&fit=crop" alt="Profile" />
            </div>
            <h2>{userType === 'guest' ? 'Guest User' : 'Krish (User)'}</h2>
            <p className="text-muted" style={{ marginBottom: '1rem' }}>
              {userType === 'guest' ? 'Viewing as Guest' : 'Project Manager'}
            </p>
            <div className="profile-actions">
              <Button variant="secondary" onClick={() => setIsProfileOpen(false)}>Log Out</Button>
              <Button variant="secondary" onClick={() => setIsProfileOpen(false)}>Back</Button>
            </div>
          </div>
        </Modal>
      </main>

      <style>{`
        .dashboard-layout { display: flex; min-height: 100vh; background-color: var(--color-bg); color: var(--color-text); }
        
        .main-content {
          flex: 1;
          margin-left: 260px;
          padding: 1.5rem;
          position: relative;
        }

        .header-left { display: flex; align-items: center; gap: 1rem; flex: 1; }
        .logo-text-mobile { display: none; font-size: 1.5rem; font-weight: 800; }
        
        .search-bar {
          display: flex;
          align-items: center;
          background: var(--color-surface);
          border-radius: 2rem;
          padding: 0.5rem 1rem;
          flex: 1;
          max-width: 400px;
        }
        .search-icon { color: var(--color-text-muted); margin-right: 0.5rem; }
        .search-bar input {
          background: transparent;
          border: none;
          color: var(--color-text);
          outline: none;
          width: 100%;
        }

        .header-right { display: flex; gap: 1rem; }
        .icon-btn { color: var(--color-text); padding: 0.5rem; border-radius: 50%; }
        .icon-btn:hover { background-color: var(--color-surface-hover); }
        .profile-placeholder { width: 32px; height: 32px; background: var(--color-surface); border-radius: 50%; display: flex; align-items: center; justify-content: center; }

        /* Tabs Pills */
        .tabs-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin: 2rem 0;
        }

        .pill-tab {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          padding: 0.5rem 1.25rem;
          border-radius: 2rem;
          color: var(--color-text);
          transition: all 0.2s;
        }

        .pill-tab.active {
          background: var(--color-primary);
          border-color: var(--color-primary);
          color: white;
        }

        /* List View */
        .projects-list { display: flex; flex-direction: column; gap: 1rem; }
        .project-row {
          background: var(--color-surface);
          padding: 1rem;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: transform 0.1s;
          cursor: pointer;
        }
        .project-row:hover { transform: translateX(4px); background: var(--color-surface-hover); }
        .row-content h4 { margin-bottom: 0.25rem; }
        .row-meta { font-size: 0.875rem; color: var(--color-text-muted); }

        /* FAB */
        .fab-add {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          background: white;
          color: black;
          padding: 0.75rem 1.5rem;
          border-radius: 2rem;
          font-weight: 600;
          box-shadow: var(--shadow-lg);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: transform 0.2s;
          z-index: 90;
        }
        .fab-add:hover { transform: scale(1.05); }

        /* Forms */
        .form-grid { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem; }
        .add-project-form label { display: block; margin-bottom: 0.25rem; }
        
        /* Profile */
        .profile-view { text-align: center; padding: 1rem; }
        .profile-pic-large img { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; margin-bottom: 1rem; border: 4px solid var(--color-surface); }
        .profile-actions { display: flex; gap: 1rem; justify-content: center; margin-top: 2rem; }

        /* Project Details */
        .project-details-view { padding: 0.5rem; }
        
        .status-banner {
            background-color: rgba(59, 130, 246, 0.1);
            border-left: 4px solid var(--color-primary);
            padding: 1rem;
            margin-bottom: 1.5rem;
            border-radius: 4px;
        }
        .status-banner .label { font-weight: 700; color: var(--color-primary); display: block; margin-bottom: 0.25rem; }

        .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; }
        .detail-item { display: flex; flex-direction: column; gap: 0.25rem; }
        .detail-item .label { font-size: 0.875rem; color: var(--color-text-muted); }
        .detail-item .value { font-weight: 600; }
        .detail-item .value.highlight { font-size: 1.125rem; }
        .text-green { color: #10B981; }
        .text-red { color: #EF4444; }

        .expenditure-list-section { margin-bottom: 1.5rem; }
        .expenditure-table { border: 1px solid var(--color-border); border-radius: var(--radius-md); overflow: hidden; font-size: 0.875rem; }
        .table-header, .table-row, .table-footer { display: flex; justify-content: space-between; padding: 0.75rem 1rem; }
        .table-header { background-color: var(--color-surface-hover); font-weight: 600; }
        .table-row { border-top: 1px solid var(--color-border); }
        .table-footer { border-top: 1px solid var(--color-border); font-weight: 700; background-color: rgba(0,0,0,0.2); }

        .expenditure-section { background: var(--color-surface); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1.5rem; }

        @media (max-width: 768px) {
          .main-content { margin-left: 0; padding-bottom: 5rem; }
          .logo-text-mobile { display: block; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
