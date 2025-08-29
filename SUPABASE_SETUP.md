# Supabase Cloud Database Setup Guide

This guide will walk you through setting up Supabase Cloud for your basketball tournament application.

## Prerequisites

- Modern web browser
- Email account (GitHub account recommended for easy sign-up)

## Step 1: Create Supabase Project

### 1.1 Sign Up for Supabase
1. Navigate to [https://supabase.com](https://supabase.com)
2. Click "Start your project" or "Sign up"
3. Sign up using GitHub (recommended) or email
4. Verify your email if using email signup

### 1.2 Create New Project
1. After signing in, you'll see the Supabase Dashboard
2. Click the "New Project" button
3. Fill out the project details:
   - **Organization**: Select or create an organization
   - **Project Name**: "Basketball Tournament" (or your preferred name)
   - **Database Password**: Generate a strong password and **SAVE IT SECURELY**
   - **Region**: Choose the region closest to your users (e.g., "US East" for North America)
   - **Pricing Plan**: Select "Free" tier (sufficient for development and small tournaments)

4. Click "Create new project"
5. **Wait 2-3 minutes** for the project to be created (you'll see a progress indicator)

## Step 2: Get Your Project Credentials

### 2.1 Access Project Settings
1. Once your project is ready, you'll be in the project dashboard
2. Click on "Settings" in the left sidebar
3. Click on "API" under the Settings section

### 2.2 Copy Your Credentials
You need two pieces of information:

1. **Project URL**:
   - Look for "Project URL" section
   - Copy the URL (it looks like: `https://abcdefghijklmno.supabase.co`)
   - This is your `VITE_SUPABASE_URL`

2. **API Keys**:
   - Look for "Project API keys" section
   - Copy the **"anon public"** key (long string starting with `eyJ...`)
   - This is your `VITE_SUPABASE_ANON_KEY`
   - **Do NOT use the service_role key** - it's for server-side use only

## Step 3: Configure Your Local Environment

### 3.1 Update Environment Variables
1. Open your project's `.env.local` file
2. Replace the placeholder values with your actual credentials:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-actual-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...your-actual-anon-key-here...

# Development Mode
VITE_DEV_MODE=true
```

### 3.2 Restart Development Server
After updating `.env.local`, restart your development server:
```bash
npm run dev
```

## Step 4: Create Database Schema

### 4.1 Access SQL Editor
1. In your Supabase project dashboard, click "SQL Editor" in the left sidebar
2. You'll see the SQL editor interface

### 4.2 Run Database Schema
1. Open the `database-schema.sql` file from your project root
2. Copy the entire contents of the file
3. Paste it into the Supabase SQL Editor
4. Click the "Run" button to execute the script

### 4.3 Verify Tables Created
1. Click on "Table Editor" in the left sidebar
2. You should see the following tables created:
   - `teams`
   - `players` 
   - `sponsors`
   - `volunteers`
   - `payments`
   - `admin_users`

## Step 5: Test Your Connection

### 5.1 Using the Built-in Database Test
1. Start your development server: `npm run dev`
2. Open your browser to the development URL (usually `http://localhost:5173`)
3. If you see a yellow "Development Mode" bar at the top, click "Show Database Test"
4. Click the "Test Connection" button - it should show a green checkmark
5. Click the "Test Stats Function" button - it should return fundraising statistics

### 5.2 Manual Verification
You can also verify the connection by:
1. Going to your Supabase project dashboard
2. Clicking "Table Editor" → "teams"
3. You should see some sample data if the schema was created correctly

## Step 6: Security Notes

### 6.1 Current Setup (Development Mode)
- **Row Level Security (RLS)** is enabled but with open policies
- **Anyone can read/write data** - this is for development only
- All forms will save data directly to your database

### 6.2 For Production Use
When you're ready to go live, you'll need to:
1. Implement user authentication
2. Restrict RLS policies to authenticated users only
3. Add admin roles and permissions
4. Remove development-only policies

## Troubleshooting

### Connection Issues
- **Double-check your URL and anon key** in `.env.local`
- **Ensure no extra spaces or quotes** around the values
- **Restart your dev server** after changing environment variables
- **Check that your Supabase project is active** (not paused)

### Schema Issues
- **Check the SQL Editor logs** for any errors when running the schema
- **Verify all tables were created** in the Table Editor
- **Make sure you copied the complete schema** from `database-schema.sql`

### Permission Issues
- **Only use the anon public key** for the frontend
- **Never expose the service_role key** in client-side code
- **RLS policies are set to allow public access** for development

## What's Next?

After completing this setup:
1. ✅ Your database is ready for the tournament application
2. ✅ All forms (registration, sponsors, volunteers) will save real data
3. ✅ You can view and manage data in the Supabase dashboard
4. ✅ The homepage will show real fundraising statistics

### Ready to Test:
- **Team Registration Form**: `/register`
- **Sponsor Form**: `/sponsors` 
- **Volunteer Form**: `/contact`
- **Admin Dashboard**: `/admin`

### Next Phase:
- Set up email notifications (Phase 2)
- Add payment processing (Phase 2)
- Implement admin authentication (Phase 2)
- Deploy to production (Phase 3)

## Support Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

**🏀 Ready to start accepting tournament registrations!** 🏀