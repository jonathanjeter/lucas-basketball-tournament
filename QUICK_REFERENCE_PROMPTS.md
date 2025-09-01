# QUICK REFERENCE: STEP-BY-STEP CLAUDE CODE PROMPTS

## 🚀 EXECUTE IN ORDER - Copy/Paste These Exact Prompts

---

### **STEP 1: Critical Systems Fix** ⚡
**Copy this prompt and send to Claude Code:**

```
claude-code --model sonnet-4 --allow-file-system --allow-directory-access --allow-npm

URGENT VOLUNTEER RECRUITMENT: Cemetery project is Saturday September 6, 2025. Currently only 2-3 volunteers signed up, need 8-10+. Tournament was successful ($270 raised) but site still shows tournament registration instead of volunteer recruitment.

CRITICAL FIXES NEEDED TODAY:
1. Switch from staging to production mode (change VITE_STAGING_MODE=false in .env.local) to show correct $270 raised instead of $50
2. Fix volunteer registration form - it's likely broken like other forms were during tournament development
3. Add emergency "VOLUNTEERS NEEDED THIS SATURDAY!" banner to homepage with countdown to September 6
4. Verify volunteer form saves to database and sends email confirmations

Project details: Saturday Sept 6, 7:30 AM-12:00 PM, Pioneer Cemetery Waxahachie, manual labor with SAR training, minors OK with supervision.

Priority: Get volunteer signup system working immediately so we can recruit before Saturday.
```

---

### **STEP 2: Homepage Transformation** 🏠  
**After Step 1 is complete, use this prompt:**

```
claude-code --model sonnet-4 --allow-file-system --allow-directory-access --allow-npm

HOMEPAGE COMPLETE OVERHAUL: Replace all tournament registration content with urgent volunteer recruitment for cemetery project.

TRANSFORM HOMEPAGE TO INCLUDE:
- Hero section: "Volunteers Needed This Saturday!" for Eagle Scout cemetery restoration
- Project overview: Partnership with Sons of American Revolution, headstone preservation
- Prominent volunteer signup call-to-action button
- Fundraising progress: "$270 raised, only $130 remaining" toward $400 goal
- Add Venmo and Zelle donation options for remaining funds
- Brief tournament success callout linking to summary page
- Urgency messaging throughout: "Only days left", "Help preserve history"

Current tournament was successful: $120 raised + $150 sponsorships = $270 total, 12 participants, 3 tournament rounds.

Emphasize Saturday deadline and need for volunteers NOW. Make volunteer signup the primary focus.
```

---

### **STEP 3: Content Updates & Pages** 📄
**After Step 2 is complete, use this prompt:**

```
claude-code --model sonnet-4 --allow-file-system --allow-directory-access --allow-npm

CONTENT UPDATES AND NEW PAGES:

1. UPDATE PROJECT PAGE (/project):
   - Correct date: Saturday, September 6, 2025
   - Correct time: 7:30 AM - 12:00 PM  
   - Add details: SAR provides on-site training for safe headstone preservation
   - Requirements: Manual labor, no experience needed, equipment provided
   - Age policy: Minors welcome with adult supervision
   - Integrate volunteer signup form

2. CREATE TOURNAMENT SUMMARY PAGE (/tournament-summary):
   - Event: August 30, 2025, 12 participants
   - Results: Round 1 won by Team Oreo (3 teams of 4, full court)
             Round 2 won by Team Blaze (4 teams of 3, half court)  
             Round 3 won by Team Lightning (2 teams of 5, full court)
   - Fundraising success: $270 raised toward Eagle Scout cemetery project
   - Photo gallery placeholder (iPhone action shots + group photo available)
   - Thank you message to community, participants, sponsors
   - Call-to-action: "Help complete the project - volunteer this Saturday!"

3. ADD PAYMENT OPTIONS:
   - Need Venmo handle and Zelle email from Lucas
   - Prominent display for remaining $130 fundraising
   - Message: "$270 raised, only $130 remaining for Eagle Scout project"

Focus on documenting tournament success while driving volunteer recruitment.
```

---

### **STEP 4: Final Testing & Deployment** ✅
**After Step 3 is complete, use this prompt:**

```
claude-code --model sonnet-4 --allow-file-system --allow-directory-access --allow-npm

FINAL TESTING AND DEPLOYMENT PREPARATION:

1. COMPLETE SYSTEM TEST:
   - Test volunteer form submission end-to-end
   - Verify volunteer data saves to production database  
   - Confirm email confirmations sent to volunteers and admin
   - Test payment link functionality (Venmo/Zelle when added)
   - Mobile device testing - volunteer registration must work on phones

2. SITE-WIDE VERIFICATION:
   - All pages show correct $270 fundraising total
   - Navigation updated for project focus (remove tournament registration)
   - Urgent volunteer messaging consistent throughout
   - Meta tags optimized for "volunteer cemetery restoration Waxahachie"

3. DEPLOYMENT READINESS:
   - Verify all changes committed and ready to push
   - Production mode confirmed active
   - No console errors or broken functionality
   - Ready for immediate deployment to lucasjeter.com

4. MOBILE OPTIMIZATION:
   - Volunteer signup process smooth on mobile
   - All CTAs large enough for touch interaction
   - Fast loading on mobile connections
   - Form validation clear and helpful

Priority: Site must be ready for immediate volunteer recruitment sharing. Test that someone can visit homepage on their phone and successfully sign up to volunteer.
```

---

## 🎯 **BETWEEN STEPS:** Questions to Ask Lucas

### After Step 1:
- "Is the volunteer form now working? Can you test submitting a volunteer signup?"
- "Do you see the correct $270 fundraising total on the homepage?"

### After Step 2:  
- "What's your Venmo handle for donations?"
- "What email should people use for Zelle transfers?"
- "Does the homepage transformation look good for volunteer recruitment?"

### After Step 3:
- "Do you have the tournament photos ready to upload?"
- "Is the project page information accurate for Saturday's event?"
- "Should we add any specific SAR contact information?"

### After Step 4:
- "Have you tested the volunteer signup on your phone?"
- "Are you ready to deploy and start sharing for volunteer recruitment?"
- "Any final changes needed before going live?"

---

## 🚨 **EMERGENCY BACKUP PLANS**

### If Volunteer Form Still Breaks:
"The volunteer form isn't working. Create a simple contact form that captures Name, Email, Phone, and 'I want to volunteer Saturday' checkbox. We can manually follow up."

### If Homepage Changes Are Too Drastic:
"Keep existing structure but replace tournament registration with volunteer signup, add emergency banner, update stats to $270."

### If Timeline Too Tight:
"Focus ONLY on: 1) Fix volunteer form, 2) Add volunteer banner to homepage, 3) Switch to production mode. Skip tournament summary page for now."

---

## ✅ **SUCCESS VERIFICATION**

After all steps complete, verify:
- [ ] Someone can visit lucasjeter.com on their phone
- [ ] See urgent volunteer messaging for Saturday
- [ ] Click volunteer signup and complete form successfully  
- [ ] Receive email confirmation
- [ ] Site shows correct $270 fundraising progress
- [ ] Tournament success story visible but not dominant
- [ ] Ready to share widely for volunteer recruitment

**🎯 GOAL: Transform site from tournament registration to volunteer recruitment in one day, deploy live, start recruiting immediately for Saturday project!**