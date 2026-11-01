import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

export interface Registration {
  id: string;
  student_name: string;
  email: string;
  phone: string;
  course: string;
  batch_preference: string;
  message?: string;
  status: 'New' | 'Contacted' | 'Enrolled' | 'Archived';
  created_at: string;
}

export interface RegistrationInput {
  student_name: string;
  email: string;
  phone: string;
  course: string;
  batch_preference: string;
  message?: string;
}

// Retrieve environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if valid credentials are provided
export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('your-project-id') &&
    supabaseUrl.startsWith('http')
  );
};

// Initialize Supabase Client if configured
export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

// ==============================================================================
// LOCAL STORAGE DEMO REPOSITORY (Fallback when Supabase keys are not yet added)
// ==============================================================================
const LOCAL_STORAGE_KEY = 'brightpath_demo_registrations';
const LOCAL_STORAGE_AUTH_KEY = 'brightpath_demo_admin_auth';

const INITIAL_DEMO_RECORDS: Registration[] = [
  {
    id: 'demo-reg-1',
    student_name: 'Priyanshu Sharma',
    email: 'priyanshu.sharma@example.com',
    phone: '9800000001',
    course: 'JEE Preparation (Main + Advanced)',
    batch_preference: 'Morning Batch (7:00 AM – 9:30 AM)',
    message: 'Interested in booking a 2-day free demo class. Aiming for IIT JEE 2027.',
    status: 'New',
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
  },
  {
    id: 'demo-reg-2',
    student_name: 'Ananya Deshmukh',
    email: 'ananya.d@example.com',
    phone: '9812345678',
    course: 'NEET Preparation (Medical UG)',
    batch_preference: 'Evening Batch (4:00 PM – 7:30 PM)',
    message: 'Need help with Physics numerical practice for NEET UG 2026.',
    status: 'Contacted',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(), // 18 hrs ago
  },
  {
    id: 'demo-reg-3',
    student_name: 'Rohan Verma',
    email: 'verma.rohan@example.com',
    phone: '9789012345',
    course: 'Class 9–10 Foundation',
    batch_preference: 'Weekend Intensive Cohort',
    message: 'Scored 94% in Class 8, looking for Olympiad foundation.',
    status: 'Enrolled',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
  },
];

const getLocalRegistrations = (): Registration[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_RECORDS));
      return INITIAL_DEMO_RECORDS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMO_RECORDS;
  }
};

const saveLocalRegistrations = (list: Registration[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
};

// ==============================================================================
// REGISTRATION OPERATIONS
// ==============================================================================

/**
 * Saves a new registration to Supabase (or demo storage)
 * and attempts to trigger serverless email notifications.
 */
export async function submitRegistration(input: RegistrationInput): Promise<{
  success: boolean;
  data?: Registration;
  error?: string;
  isDemoMode: boolean;
  emailNotificationSent?: boolean;
}> {
  const isDemo = !isSupabaseConfigured();

  let createdRecord: Registration;

  if (isDemo || !supabase) {
    // Save to Local Demo Storage
    const newRecord: Registration = {
      id: `demo-${Date.now()}`,
      student_name: input.student_name,
      email: input.email,
      phone: input.phone,
      course: input.course,
      batch_preference: input.batch_preference,
      message: input.message || '',
      status: 'New',
      created_at: new Date().toISOString(),
    };

    const existing = getLocalRegistrations();
    saveLocalRegistrations([newRecord, ...existing]);
    createdRecord = newRecord;
  } else {
    // Save to Persistent Supabase Database
    const { data, error } = await supabase
      .from('registrations')
      .insert([
        {
          student_name: input.student_name,
          email: input.email,
          phone: input.phone,
          course: input.course,
          batch_preference: input.batch_preference,
          message: input.message || null,
          status: 'New',
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase registration error:', error);
      return {
        success: false,
        error: error.message || 'Failed to save registration in database.',
        isDemoMode: false,
      };
    }

    createdRecord = data as Registration;
  }

  // Attempt server-side email notification via Netlify Function / API route
  let emailSent = false;
  try {
    const notifyResponse = await fetch('/api/notify-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        registration: createdRecord,
      }),
    });

    if (notifyResponse.ok) {
      emailSent = true;
    }
  } catch {
    // Email notification failure is non-fatal: the registration is safely saved in the database!
    console.info('Serverless email notification endpoint not active or returned an error.');
  }

  return {
    success: true,
    data: createdRecord,
    isDemoMode: isDemo,
    emailNotificationSent: emailSent,
  };
}

/**
 * Fetch all registrations (Requires Authenticated Admin or Demo Mode)
 */
export async function fetchRegistrations(): Promise<{
  data: Registration[];
  error?: string;
}> {
  if (!isSupabaseConfigured() || !supabase) {
    return { data: getLocalRegistrations() };
  }

  const { data, error } = await supabase
    .from('registrations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return { data: [], error: error.message };
  }

  return { data: (data || []) as Registration[] };
}

/**
 * Update the status of a registration (e.g. 'Contacted', 'Enrolled')
 */
export async function updateRegistrationStatus(
  id: string,
  newStatus: Registration['status']
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured() || !supabase) {
    const list = getLocalRegistrations();
    const updated = list.map((item) =>
      item.id === id ? { ...item, status: newStatus } : item
    );
    saveLocalRegistrations(updated);
    return { success: true };
  }

  const { error } = await supabase
    .from('registrations')
    .update({ status: newStatus })
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Delete a registration
 */
export async function deleteRegistration(
  id: string
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured() || !supabase) {
    const list = getLocalRegistrations();
    const updated = list.filter((item) => item.id !== id);
    saveLocalRegistrations(updated);
    return { success: true };
  }

  const { error } = await supabase
    .from('registrations')
    .delete()
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

// ==============================================================================
// ADMIN AUTHENTICATION
// ==============================================================================

export interface AdminAuthState {
  isAuthenticated: boolean;
  email: string | null;
  isDemoAdmin: boolean;
}

export async function getAdminAuthState(): Promise<AdminAuthState> {
  if (!isSupabaseConfigured() || !supabase) {
    const isDemoLoggedIn = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY) === 'true';
    return {
      isAuthenticated: isDemoLoggedIn,
      email: isDemoLoggedIn ? 'admin@brightpathacademy.edu.in (Demo Admin)' : null,
      isDemoAdmin: true,
    };
  }

  const { data: { session } } = await supabase.auth.getSession();
  return {
    isAuthenticated: Boolean(session && session.user),
    email: session?.user?.email || null,
    isDemoAdmin: false,
  };
}

export async function signInAdmin(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; user?: User }> {
  if (!isSupabaseConfigured() || !supabase) {
    // Demo Mode login (accepts admin@brightpathacademy.edu.in with any password or 'admin123')
    if (email.trim().toLowerCase() === 'admin@brightpathacademy.edu.in' || email.includes('admin')) {
      localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, 'true');
      return { success: true };
    }
    return {
      success: false,
      error: 'Demo Mode: Please use "admin@brightpathacademy.edu.in" with any password (e.g. admin123) to log into the demo portal.',
    };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, user: data.user || undefined };
}

export async function signOutAdmin(): Promise<void> {
  if (!isSupabaseConfigured() || !supabase) {
    localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
    return;
  }

  await supabase.auth.signOut();
}
