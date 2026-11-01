# BrightPath Academy — Course Registration System
## Beginner's Step-by-Step Setup & Deployment Guide

This guide walks you step-by-step through configuring your **free database (Supabase)**, **automated email notifications (Resend)**, and **Netlify deployment**.

---

### Table of Contents
1. [Overview of the New System](#1-overview-of-the-new-system)
2. [Step 1: Setting Up Your Free Supabase Database](#step-1-setting-up-your-free-supabase-database)
3. [Step 2: Creating Your Admin Login in Supabase](#step-2-creating-your-admin-login-in-supabase)
4. [Step 3: Setting Up Free Email Notifications with Resend](#step-3-setting-up-free-email-notifications-with-resend)
5. [Step 4: Deploying to Netlify via GitHub](#step-4-deploying-to-netlify-via-github)
6. [Step 5: Testing Your System End-to-End](#step-5-testing-your-system-end-to-end)
7. [Offline / Demo Mode Behavior](#offline--demo-mode-behavior)

---

### 1. Overview of the New System

Your website has been upgraded with three interconnected components:

1. **Course Registration Form (`/src/components/ContactSection.tsx`)**:
   - Collects student name, email, phone, course selection, preferred timing, and notes.
   - Saves records directly to your database.
   - Displays a success confirmation with a unique Registration Reference ID (`#BP-XXXX`).
   - Prevents duplicate clicks and accidental resubmissions.

2. **Secure Admin Dashboard (`/src/components/AdminDashboard.tsx`)**:
   - Accessible via the **"Admin"** button in the header, footer, or by navigating to `#admin`.
   - Requires email and password authentication.
   - Allows administrators to search, filter by course and status, change registration statuses (New, Contacted, Enrolled, Archived), view detailed student notes, and export records as a CSV spreadsheet.
   - Protected by **Row Level Security (RLS)** in PostgreSQL, ensuring public visitors cannot view or download other students' registrations.

3. **Serverless Email Dispatcher (`/netlify/functions/notify-admin.ts`)**:
   - Runs securely on Netlify without exposing secret keys in browser code.
   - Automatically formats and emails an admission alert to the institute owner whenever a new student registers.

---

### Step 1: Setting Up Your Free Supabase Database

Supabase provides a free, production-ready PostgreSQL database with authentication and instant REST APIs.

1. **Create an Account**:
   - Go to [https://supabase.com](https://supabase.com) and click **"Start your project"**.
   - Sign in using your GitHub account.

2. **Create a New Project**:
   - Click **"New Project"**.
   - Choose an organization, enter a project name (e.g. `BrightPath-Academy`), and set a secure database password.
   - Choose a region closest to your students (e.g., `South Asia (Mumbai)` for India).
   - Click **"Create new project"** (it takes about 1–2 minutes to provision).

3. **Run the Database SQL Schema**:
   - In your Supabase project dashboard, click on **"SQL Editor"** (terminal icon) on the left sidebar.
   - Click **"New Query"**.
   - Open the file `supabase/schema.sql` from your project repository (or copy it from the Admin Portal's "Setup & SQL" tab), paste it into the editor, and click **"Run"** (green button).
   - You will see `"Success. No rows returned."` Your `registrations` table and security policies are now created!

4. **Copy Your API Keys**:
   - In Supabase, go to **Project Settings** (gear icon at the bottom left) &rarr; **API**.
   - Copy the following two values:
     - **Project URL** (e.g., `https://xyzcompany.supabase.co`)
     - **Project API Keys &rarr; `anon` `public`** key (starts with `eyJ...`)

---

### Step 2: Creating Your Admin Login in Supabase

1. In your Supabase Dashboard, click **"Authentication"** (user icon on the left menu).
2. Click **"Users"** &rarr; **"Add user"** &rarr; **"Create user"**.
3. Enter your administrative email (e.g., `admin@brightpathacademy.edu.in`) and a strong password.
4. Set **"Auto Confirm User"** to **ON** (checked) so you can log in immediately without email confirmation.
5. Click **"Create user"**.
6. You can now use these exact credentials to log in at `#admin` on your website!

---

### Step 3: Setting Up Free Email Notifications with Resend

To receive email alerts without paying for expensive email infrastructure:

1. **Create a Free Account**:
   - Go to [https://resend.com](https://resend.com) and sign up with GitHub or your email (free tier includes 100 emails per day and 3,000 per month).

2. **Create an API Key**:
   - Click **"API Keys"** on the left menu &rarr; **"Create API Key"**.
   - Name it `BrightPath Website` and select full access permissions.
   - Copy the key (it starts with `re_...`).

3. **Sending Domain**:
   - *For initial testing*: You can immediately use `onboarding@resend.dev` as your sender (already configured as default).
   - *For production*: Add your custom domain (e.g. `brightpathacademy.edu.in`) under **Domains** in Resend and add the provided DNS records in your domain registrar.

---

### Step 4: Deploying to Netlify via GitHub

Your project repository contains `netlify.toml`, which configures the build command (`npm run build`), publish directory (`dist`), and serverless functions folder (`netlify/functions`).

1. **Push Changes to GitHub**:
   - In your terminal:
     ```bash
     git add .
     git commit -m "Upgrade to course registration system with Supabase and Netlify functions"
     git push origin main
     ```

2. **Add Environment Variables in Netlify**:
   - Log in to your [Netlify Dashboard](https://app.netlify.com).
   - Select your BrightPath Academy site.
   - Go to **Site Configuration** (or **Site Settings**) &rarr; **Environment Variables**.
   - Click **"Add a variable"** and add the following:

   | Variable Name | Value | Purpose |
   | :--- | :--- | :--- |
   | `VITE_SUPABASE_URL` | `https://your-id.supabase.co` | Connects browser to your Supabase project |
   | `VITE_SUPABASE_ANON_KEY` | `eyJhbGci...` | Supabase public API key |
   | `RESEND_API_KEY` | `re_123456...` | Serverless email notification dispatch |
   | `ADMIN_NOTIFICATION_EMAIL` | `your-email@example.com` | Email address where you receive registration notifications |
   | `SENDER_EMAIL` | `BrightPath <onboarding@resend.dev>` | Email sender name and address |

3. **Trigger a Deploy**:
   - In Netlify, go to **Deploys** &rarr; **Trigger Deploy** &rarr; **Deploy Site**.
   - Netlify will build Vite and compile the serverless function `notify-admin`.

---

### Step 5: Testing Your System End-to-End

1. **Submit a Registration**:
   - Visit your website, scroll down to the **Registration Form**, fill in a test student name, email, phone number, and click **"Submit Course Registration"**.
   - You will see the loading spinner, followed by the confirmation card showing your reference ID (e.g. `#BP-A1B2C3D4`).

2. **Check the Admin Portal**:
   - Click **"Admin"** in the top navigation or navigate to `#admin`.
   - Log in with your admin credentials.
   - You will see the newly submitted registration at the top of the table!
   - Change its status to **"Contacted"** or **"Enrolled"** to verify that status updates persist in your database.
   - Click **"Export CSV"** to download an Excel-compatible spreadsheet.

3. **Check Your Email**:
   - Check the inbox of your `ADMIN_NOTIFICATION_EMAIL`. You will see an email containing the student's details, course preference, and direct click-to-call / click-to-WhatsApp links.

---

### Offline / Demo Mode Behavior

If you run the website locally or before adding your Supabase keys:
- The website operates in **Demo Mode**.
- Registrations are stored safely in browser storage (`localStorage`) so you can demonstrate the complete workflow to clients.
- You can log into the Admin Dashboard using:
  - **Email**: `admin@brightpathacademy.edu.in`
  - **Password**: `admin123`
- Once you add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, the application automatically switches to the live cloud database.

---

### 6. Student Learning Portal & Course Access Workflow

BrightPath Academy includes a full-fledged Student Learning Portal with dedicated curriculum for all four academic tracks:
1. **JEE Preparation (Main + Advanced)**
2. **NEET Preparation (UG Medical)**
3. **Class 11–12 Science (PCM/PCB)**
4. **Class 9–10 Foundation & Olympiads**

#### A. How the Enrollment Flow Works:
1. When a student registers for a course (e.g. **JEE Preparation**), the registration confirmation screen displays an instant **"Launch JEE Preparation Portal"** button.
2. Clicking this button immediately logs the student into their personalized learning dashboard and loads the JEE curriculum.
3. Students can also click the **"Student Portal"** button in the website navbar or visit `#student-portal` at any time.

#### B. Student Learning Dashboard Sections:
- **My Courses**: Switch between enrolled programs or explore additional courses.
- **Video Lectures**: Subject-wise (Physics, Chemistry, Mathematics, Biology) lectures with integrated video player, chapter breakdown, and lecture watch completion tracking.
- **Study Notes**: Chapter-wise comprehensive theory summaries, key definitions, and printable/PDF options.
- **Study Guides**: Formula sheets for rapid revision and interactive chapter revision checklists with live completion percentages.
- **Practice & CBT Mock Tests**: Timed computer-based mock tests (+4/-1 marking scheme, question palette, countdown timer, instant score breakdown, and step-by-step solutions).
- **Progress Tracking**: Real-time progress metric recording completed video hours, notes reviewed, and test performance.

#### C. Admin Curriculum Manager:
- In the Admin Dashboard (`#admin`), click **"Curriculum & Materials"** to inspect course subjects, view all video lectures and chapter notes, add custom video lecture links, and view registered students organized by course.

