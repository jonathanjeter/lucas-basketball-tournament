# Staging Database Setup Guide

## 🧪 LOCAL DEV → STAGING DATABASE Workflow

This guide helps you create a **separate staging Supabase project** for safe testing while keeping your production database completely isolated.

## 🎯 Why Use Staging?

✅ **Safe Testing** - Test new features without affecting live tournament data  
✅ **Production Protection** - Your live registrations stay untouched  
✅ **Realistic Environment** - Same schema and setup as production  
✅ **Easy Switching** - Toggle between staging and production with one variable  

---

## 📋 Quick Setup (10 minutes)

### Step 1: Create New Supabase Project
1. **Go to [supabase.com](https://supabase.com)**
2. **Click "New Project"**
3. **Name it**: `basketball-tournament-staging` (or similar)
4. **Choose same region** as your production project
5. **Wait for project creation** (~2 minutes)

### Step 2: Get Staging Credentials
1. **Go to Settings → API** in your new staging project
2. **Copy the Project URL** (looks like: `https://abcd1234.supabase.co`)
3. **Copy the anon/public key** (the long JWT token)

### Step 3: Update Environment Variables
In your `.env.local` file, replace these staging placeholders:

```bash
# =============================================================================
# STAGING SUPABASE (SAFE TESTING ENVIRONMENT)
# =============================================================================
# Replace these with your staging project credentials
VITE_STAGING_SUPABASE_URL=https://your-new-staging-project.supabase.co
VITE_STAGING_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-staging-key-here
```

### Step 4: Deploy Database Schema
1. **Open your staging project** → **SQL Editor**
2. **Copy contents** from `database-schema-tables-only.sql` (recommended) OR `database-schema-full.sql` (with sample data)
3. **Paste and run** the SQL script
4. **Verify success** - you should see the success messages

### Step 5: Test Staging Connection
1. **Ensure** `VITE_STAGING_MODE=true` in your `.env.local`
2. **Restart dev server**: `npm run dev`
3. **Check browser console** - should see: "🧪 STAGING MODE: Using staging database"
4. **Visit homepage** - click "Show Database Test" and verify green checkmarks

---

## 🔄 Environment Switching

### Switch to Staging (Safe Testing)
```bash
# In .env.local
VITE_STAGING_MODE=true
```
- Console shows: "🧪 STAGING MODE: Using staging database"
- UI shows orange "STAGING" badge
- Safe to test registrations, break things, etc.

### Switch to Production (Live Tournament)
```bash
# In .env.local
VITE_STAGING_MODE=false
# OR remove the line entirely
```
- Console shows: "🚀 PRODUCTION MODE: Using live database" 
- Console warns: "⚠️ CAUTION: You are connected to LIVE PRODUCTION DATA!"
- UI shows red "PRODUCTION" badge
- **BE CAREFUL** - this is live tournament data!

---

## 📁 Database Schema Options

### Option A: Tables Only (Recommended)
Use `database-schema-tables-only.sql` if you want:
- Clean database structure
- No sample data
- Test with real registrations only

### Option B: Tables + Sample Data
Use `database-schema-full.sql` if you want:
- Database structure + sample data
- Immediate testing capability
- Pre-populated teams/sponsors/volunteers

---

## 🛡️ Security & Best Practices

### ✅ DO:
- **Always test new features in staging first**
- **Use staging for development and demos**
- **Switch to production only for final testing**
- **Keep staging credentials in `.env.local` (never commit)**
- **Use different names for staging project (e.g., add `-staging`)**

### ❌ DON'T:
- **Never test destructive operations in production**
- **Don't leave staging mode on during tournament**
- **Don't share production credentials**
- **Don't commit `.env.local` file to version control**

---

## 🚨 Tournament Day Protocol

### Before Tournament:
```bash
# Switch to production mode
VITE_STAGING_MODE=false
```
1. **Test registration flow** with production database
2. **Verify fundraising stats** are accurate
3. **Confirm all integrations** working

### During Tournament:
- **Keep in production mode**
- **Monitor console** for any errors
- **Have staging available** for quick testing if issues arise

### After Tournament:
```bash
# Switch back to staging for cleanup
VITE_STAGING_MODE=true
```

---

## 🔧 Troubleshooting

### "Environment variables not configured"
- Check `.env.local` has correct staging credentials
- Restart dev server after changes
- Verify no typos in variable names

### "Database connection failed"
- Verify staging Supabase project is running
- Check internet connection
- Confirm schema was deployed successfully

### "Wrong environment showing"
- Clear browser cache and localStorage
- Check `VITE_STAGING_MODE` value in `.env.local`
- Restart development server

---

## 📊 Environment Indicators

Your app now shows which environment you're using:

### 🧪 Staging Mode
- **Console**: "🧪 STAGING MODE: Using staging database"
- **UI Badge**: Orange "STAGING" indicator
- **Header**: Different styling to indicate staging

### 🚀 Production Mode
- **Console**: "🚀 PRODUCTION MODE: Using live database"
- **Console Warning**: "⚠️ CAUTION: You are connected to LIVE PRODUCTION DATA!"
- **UI Badge**: Red "PRODUCTION" indicator
- **Header**: Standard styling

---

## ✅ Setup Complete!

You now have:
- ✅ **Isolated staging environment** for safe testing
- ✅ **Protected production database** for live tournament
- ✅ **Easy switching** between environments
- ✅ **Visual indicators** showing which environment is active
- ✅ **Console logging** for environment awareness

**Ready to develop safely! 🏀**

---

## 🔗 Related Files

- **Environment Config**: `.env.local`
- **Database Client**: `src/lib/supabase.ts`
- **Schema Files**: `database-schema-tables-only.sql`, `database-schema-full.sql`
- **Production Setup**: `SUPABASE_SETUP.md`