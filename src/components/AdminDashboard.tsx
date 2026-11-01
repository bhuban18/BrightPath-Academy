import React, { useState, useEffect } from 'react';
import {
  Shield,
  Lock,
  Search,
  Filter,
  Download,
  RefreshCw,
  Phone,
  Mail,
  MessageSquare,
  CheckCircle2,
  Clock,
  UserCheck,
  Archive,
  Trash2,
  Eye,
  LogOut,
  Database,
  ArrowLeft,
  Copy,
  Sparkles,
  AlertTriangle,
  X,
  FileSpreadsheet,
  BookOpen,
  GraduationCap
} from 'lucide-react';
import {
  Registration,
  fetchRegistrations,
  updateRegistrationStatus,
  deleteRegistration,
  signInAdmin,
  signOutAdmin,
  getAdminAuthState,
  isSupabaseConfigured
} from '../lib/supabase';
import { ACADEMY_CONFIG } from '../config/academyConfig';
import { AdminCurriculumManager } from './AdminCurriculumManager';

interface AdminDashboardProps {
  onBackToWebsite: () => void;
  onOpenStudentPortal?: (courseId?: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onBackToWebsite,
  onOpenStudentPortal
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [isDemoAdmin, setIsDemoAdmin] = useState(true);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Registrations Data State
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');
  const [activeTab, setActiveTab] = useState<'registrations' | 'curriculum' | 'setup'>('registrations');

  // Modal for Viewing Full Record Details
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);

  // SQL Copy Notification
  const [copiedSql, setCopiedSql] = useState(false);

  // Check initial authentication
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const auth = await getAdminAuthState();
    setIsAuthenticated(auth.isAuthenticated);
    setAdminEmail(auth.email);
    setIsDemoAdmin(auth.isDemoAdmin);

    if (auth.isAuthenticated) {
      loadRegistrations();
    }
  };

  const loadRegistrations = async () => {
    setLoading(true);
    const result = await fetchRegistrations();
    setRegistrations(result.data);
    setLoading(false);
  };

  // Login Handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    const result = await signInAdmin(loginEmail, loginPassword);

    if (!result.success) {
      setLoginError(result.error || 'Authentication failed. Please verify your credentials.');
      setLoginLoading(false);
      return;
    }

    setLoginLoading(false);
    await checkAuth();
  };

  // Logout Handler
  const handleLogout = async () => {
    await signOutAdmin();
    setIsAuthenticated(false);
    setAdminEmail(null);
  };

  // Status Update Handler
  const handleStatusChange = async (id: string, newStatus: Registration['status']) => {
    // Optimistic UI update
    setRegistrations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );

    const result = await updateRegistrationStatus(id, newStatus);
    if (!result.success) {
      alert(`Failed to update status: ${result.error}`);
      loadRegistrations();
    }
  };

  // Delete Handler
  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete the registration for ${name}?`)) {
      return;
    }

    setRegistrations((prev) => prev.filter((item) => item.id !== id));
    await deleteRegistration(id);
  };

  // Filter & Search Logic
  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch =
      reg.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.phone.includes(searchTerm) ||
      reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (reg.message && reg.message.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCourse =
      selectedCourseFilter === 'All' || reg.course === selectedCourseFilter;

    const matchesStatus =
      selectedStatusFilter === 'All' || reg.status === selectedStatusFilter;

    return matchesSearch && matchesCourse && matchesStatus;
  });

  // KPI Calculations
  const stats = {
    total: registrations.length,
    new: registrations.filter((r) => r.status === 'New').length,
    contacted: registrations.filter((r) => r.status === 'Contacted').length,
    enrolled: registrations.filter((r) => r.status === 'Enrolled').length,
  };

  // Export to CSV function
  const handleExportCSV = () => {
    if (registrations.length === 0) {
      alert('No registrations available to export.');
      return;
    }

    const headers = [
      'Registration ID',
      'Student Name',
      'Email',
      'Phone',
      'Course',
      'Batch Preference',
      'Status',
      'Created At',
      'Message/Goals',
    ];

    const rows = filteredRegistrations.map((r) => [
      r.id,
      `"${r.student_name.replace(/"/g, '""')}"`,
      r.email,
      r.phone,
      `"${r.course.replace(/"/g, '""')}"`,
      `"${r.batch_preference.replace(/"/g, '""')}"`,
      r.status,
      r.created_at,
      `"${(r.message || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `brightpath_registrations_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sqlSetupScript = `-- 1. Create registrations table
create table if not exists public.registrations (
    id uuid primary key default gen_random_uuid(),
    student_name text not null,
    email text not null,
    phone text not null,
    course text not null,
    batch_preference text not null,
    message text,
    status text not null default 'New',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
alter table public.registrations enable row level security;

-- 3. Public insert policy
create policy "Allow public visitors to insert registrations"
on public.registrations for insert to anon, authenticated with check (true);

-- 4. Admin read & write policies
create policy "Allow authenticated admins to read registrations"
on public.registrations for select to authenticated using (true);

create policy "Allow authenticated admins to update registrations"
on public.registrations for update to authenticated using (true);

create policy "Allow authenticated admins to delete registrations"
on public.registrations for delete to authenticated using (true);`;

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(sqlSetupScript);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  // ==============================================================================
  // VIEW 1: AUTHENTICATION LOGIN FORM (If not logged in)
  // ==============================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-[#0F1E36] to-slate-950 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-7 sm:p-9 border border-slate-200">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#0F1E36] text-white flex items-center justify-center mx-auto mb-3 shadow-sm">
              <Shield className="w-6 h-6 text-[#FF6B35]" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#0F1E36] font-['Plus_Jakarta_Sans']">
              Admin Portal Login
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {ACADEMY_CONFIG.name} · Admissions Management
            </p>
          </div>

          {/* Connection Status Indicator */}
          <div className="mb-5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center justify-between">
            <span className="font-semibold">Backend Engine:</span>
            {isSupabaseConfigured() ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <Database className="w-3.5 h-3.5" />
                Supabase Cloud DB Active
              </span>
            ) : (
              <span className="text-amber-800 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Demo Mode Active
              </span>
            )}
          </div>

          {loginError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Admin Email Address
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@brightpathacademy.edu.in"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-[#0F1E36] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F1E36]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-[#0F1E36] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F1E36]"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#FF6B35] to-[#FA8A3C] hover:from-[#E8551F] hover:to-[#FF6B35] shadow-sm transition-all flex items-center justify-center gap-2"
            >
              {loginLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Sign In to Admin Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Fill Shortcut */}
          <div className="mt-5 pt-4 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={() => {
                setLoginEmail('admin@brightpathacademy.edu.in');
                setLoginPassword('admin123');
              }}
              className="text-xs text-[#0F1E36] hover:text-[#FF6B35] font-semibold underline underline-offset-2"
            >
              Autofill Demo Admin Credentials
            </button>
          </div>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={onBackToWebsite}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Website</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==============================================================================
  // VIEW 2: AUTHENTICATED ADMIN DASHBOARD
  // ==============================================================================
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#191C1E] flex flex-col font-['Inter']">
      {/* Top Admin Navigation Bar */}
      <header className="bg-[#0F1E36] text-white py-3.5 px-4 sm:px-8 border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white">
              <Shield className="w-5 h-5 text-[#FF6B35]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base font-['Plus_Jakarta_Sans']">
                  {ACADEMY_CONFIG.name}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FF6B35] text-white uppercase">
                  Admin Portal
                </span>
              </div>
              <span className="text-xs text-slate-300">
                Logged in as: <strong className="text-white">{adminEmail}</strong>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('registrations')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'registrations'
                  ? 'bg-[#FF6B35] text-white font-bold shadow-xs'
                  : 'bg-white/10 text-slate-200 hover:bg-white/20'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Registrations ({registrations.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('curriculum')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'curriculum'
                  ? 'bg-[#FF6B35] text-white font-bold shadow-xs'
                  : 'bg-white/10 text-slate-200 hover:bg-white/20'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Curriculum & Materials</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('setup')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'setup'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-white/10 text-slate-200 hover:bg-white/20'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Supabase Setup</span>
            </button>

            {onOpenStudentPortal && (
              <button
                type="button"
                onClick={() => onOpenStudentPortal()}
                className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600/80 hover:bg-emerald-600 text-white transition-colors"
                title="Launch Student Learning Portal"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Student Portal</span>
              </button>
            )}

            <button
              type="button"
              onClick={onBackToWebsite}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-slate-200 transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Public Site</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600/80 hover:bg-red-600 text-white transition-colors flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {activeTab === 'setup' ? (
          /* SETUP & SQL MIGRATION VIEW */
          <div className="space-y-6 text-left max-w-4xl mx-auto animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-[#0F1E36] font-['Plus_Jakarta_Sans']">
                    Supabase Database Setup & Schema
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Run this SQL script in your Supabase SQL Editor to provision the persistent database with Row Level Security.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={copySqlToClipboard}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0F1E36] hover:bg-[#1A2E4D] text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                >
                  <Copy className="w-3.5 h-3.5 text-[#FF6B35]" />
                  <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy SQL Script'}</span>
                </button>
              </div>

              <div className="relative">
                <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs font-mono overflow-x-auto border border-slate-800 leading-relaxed">
                  {sqlSetupScript}
                </pre>
              </div>

              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-2 text-xs text-amber-900">
                <span className="font-bold block">3-Minute Beginner Setup Instructions:</span>
                <ol className="list-decimal pl-4 space-y-1">
                  <li>Create a free project at <a href="https://supabase.com" target="_blank" rel="noreferrer" className="underline font-semibold">supabase.com</a>.</li>
                  <li>Click <strong>SQL Editor</strong> in the left menu, paste the SQL above, and click <strong>Run</strong>.</li>
                  <li>Click <strong>Authentication</strong> &rarr; <strong>Users</strong> &rarr; <strong>Add user</strong> to create your official admin login.</li>
                  <li>Go to <strong>Project Settings &rarr; API</strong> to get your URL and anon key. Add them to Netlify environment variables as <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">VITE_SUPABASE_URL</code> and <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">VITE_SUPABASE_ANON_KEY</code>.</li>
                </ol>
              </div>
            </div>
          </div>
        ) : activeTab === 'curriculum' ? (
          /* CURRICULUM & STUDY MATERIALS MANAGER */
          <AdminCurriculumManager
            registrations={registrations}
            onOpenStudentPortal={onOpenStudentPortal}
          />
        ) : (
          /* REGISTRATIONS MANAGEMENT VIEW */
          <div className="space-y-6 text-left animate-in fade-in duration-150">
            {/* KPI Metric Strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 font-semibold block uppercase">Total Applications</span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#0F1E36] tabular-nums font-['Plus_Jakarta_Sans']">
                    {stats.total}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                  <Database className="w-5 h-5 text-[#0F1E36]" />
                </div>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 font-semibold block uppercase">New / Pending</span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#FF6B35] tabular-nums font-['Plus_Jakarta_Sans']">
                    {stats.new}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-[#FF6B35]">
                  <Clock className="w-5 h-5" />
                </div>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 font-semibold block uppercase">In Counseling</span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-blue-600 tabular-nums font-['Plus_Jakarta_Sans']">
                    {stats.contacted}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Phone className="w-5 h-5" />
                </div>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 font-semibold block uppercase">Enrolled</span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tabular-nums font-['Plus_Jakarta_Sans']">
                    {stats.enrolled}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <UserCheck className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search Box */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by student name, phone, email, or notes..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-[#0F1E36] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F1E36]"
                />
              </div>

              {/* Filters & Actions */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Course Filter */}
                <select
                  value={selectedCourseFilter}
                  onChange={(e) => setSelectedCourseFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#0F1E36] focus:outline-none"
                >
                  <option value="All">All Courses</option>
                  {ACADEMY_CONFIG.courses.map((c) => (
                    <option key={c.id} value={c.title}>
                      {c.title}
                    </option>
                  ))}
                  <option value="Free Academic Counseling">Free Counseling</option>
                  <option value="Merit Scholarship Application">Scholarship</option>
                </select>

                {/* Status Filter */}
                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#0F1E36] focus:outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Enrolled">Enrolled</option>
                  <option value="Archived">Archived</option>
                </select>

                {/* Export CSV */}
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
                  title="Export filtered records to CSV"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Export CSV</span>
                </button>

                {/* Refresh */}
                <button
                  type="button"
                  onClick={loadRegistrations}
                  disabled={loading}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  title="Refresh registration data"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Registrations Data Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                      <th className="py-3.5 px-4">Student & Reference</th>
                      <th className="py-3.5 px-4">Contact Info</th>
                      <th className="py-3.5 px-4">Course & Batch</th>
                      <th className="py-3.5 px-4">Date Submitted</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRegistrations.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400">
                          {loading ? 'Loading registrations from database...' : 'No registrations found matching your filter.'}
                        </td>
                      </tr>
                    ) : (
                      filteredRegistrations.map((reg) => (
                        <tr key={reg.id} className="hover:bg-slate-50/60 transition-colors">
                          {/* Student & Ref */}
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-slate-900 block text-sm">
                              {reg.student_name}
                            </span>
                            <span className="font-mono text-[11px] text-[#FF6B35]">
                              #BP-{reg.id.slice(0, 8).toUpperCase()}
                            </span>
                          </td>

                          {/* Contact Info */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5 font-medium text-slate-800">
                              <Phone className="w-3.5 h-3.5 text-slate-400" />
                              <a href={`tel:${reg.phone}`} className="hover:text-[#FF6B35]">
                                +91 {reg.phone}
                              </a>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-500 mt-0.5">
                              <Mail className="w-3.5 h-3.5 text-slate-400" />
                              <a href={`mailto:${reg.email}`} className="hover:underline">
                                {reg.email}
                              </a>
                            </div>
                          </td>

                          {/* Course & Timing */}
                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-slate-800 block">
                              {reg.course}
                            </span>
                            <span className="text-[11px] text-slate-500 block">
                              {reg.batch_preference}
                            </span>
                          </td>

                          {/* Date */}
                          <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                            {new Date(reg.created_at).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                            <span className="block text-[11px] text-slate-400">
                              {new Date(reg.created_at).toLocaleTimeString('en-IN', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </td>

                          {/* Status Dropdown */}
                          <td className="py-3.5 px-4">
                            <select
                              value={reg.status}
                              onChange={(e) =>
                                handleStatusChange(reg.id, e.target.value as Registration['status'])
                              }
                              className={`px-2.5 py-1 rounded-md text-xs font-bold border focus:outline-none ${
                                reg.status === 'New'
                                  ? 'bg-orange-50 text-orange-800 border-orange-200'
                                  : reg.status === 'Contacted'
                                  ? 'bg-blue-50 text-blue-800 border-blue-200'
                                  : reg.status === 'Enrolled'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : 'bg-slate-100 text-slate-600 border-slate-300'
                              }`}
                            >
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Enrolled">Enrolled</option>
                              <option value="Archived">Archived</option>
                            </select>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* WhatsApp Direct */}
                              <a
                                href={`https://wa.me/91${reg.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(reg.student_name)},%20this%20is%20from%20BrightPath%20Academy%20regarding%20your%20registration%20for%20${encodeURIComponent(reg.course)}.`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                                title="WhatsApp student"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </a>

                              {/* View Details */}
                              <button
                                type="button"
                                onClick={() => setSelectedRegistration(reg)}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                                title="View registration notes"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete */}
                              <button
                                type="button"
                                onClick={() => handleDelete(reg.id, reg.student_name)}
                                className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                                title="Delete record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Record Details Modal */}
      {selectedRegistration && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 text-left space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-[#FF6B35] uppercase tracking-wider block">
                  Registration Details
                </span>
                <h3 className="text-xl font-extrabold text-[#0F1E36] font-['Plus_Jakarta_Sans']">
                  {selectedRegistration.student_name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRegistration(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="font-bold text-slate-500 uppercase">Registration ID</span>
                <span className="font-mono text-slate-900 font-bold block">
                  {selectedRegistration.id}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="font-bold text-slate-500 uppercase">Mobile</span>
                  <a href={`tel:${selectedRegistration.phone}`} className="font-bold text-slate-900 block hover:text-[#FF6B35]">
                    +91 {selectedRegistration.phone}
                  </a>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="font-bold text-slate-500 uppercase">Email</span>
                  <a href={`mailto:${selectedRegistration.email}`} className="font-bold text-slate-900 block hover:underline truncate">
                    {selectedRegistration.email}
                  </a>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="font-bold text-slate-500 uppercase">Course & Preferred Batch</span>
                <span className="font-bold text-[#0F1E36] block text-sm">
                  {selectedRegistration.course}
                </span>
                <span className="text-slate-600 block">
                  {selectedRegistration.batch_preference}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="font-bold text-slate-500 uppercase">Student Goals & Notes</span>
                <p className="text-slate-700 italic leading-relaxed whitespace-pre-wrap">
                  {selectedRegistration.message || 'No additional notes provided.'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <a
                href={`tel:${selectedRegistration.phone}`}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
              >
                Call Student
              </a>
              <a
                href={`https://wa.me/91${selectedRegistration.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(selectedRegistration.student_name)},%20this%20is%20from%20BrightPath%20Academy.`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
