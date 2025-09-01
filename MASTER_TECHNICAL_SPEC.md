# POST-TOURNAMENT SITE TRANSFORMATION - MASTER TECHNICAL SPECIFICATION

## PROJECT CONTEXT
Transform Lucas's basketball tournament fundraising site into an urgent volunteer recruitment platform for his Eagle Scout cemetery restoration project. Tournament was successful, now pivoting to project execution phase.

## CRITICAL SITUATION
- **Project Date**: Saturday, September 6, 2025, 7:30 AM - 12:00 PM  
- **Current Volunteers**: Only 2-3 people signed up
- **Goal**: Need 8-10+ volunteers ASAP
- **Timeline**: Changes needed TODAY to recruit volunteers by Saturday

## FUNDRAISING STATUS
- **Tournament Raised**: $120 cash + $150 sponsorships = $270 total
- **Goal**: $400 (still need $130)
- **Current Site Shows**: $50 (incorrect - in staging mode)
- **Need**: Venmo/Zelle links for remaining donations

## TOURNAMENT RESULTS (For Summary Page)
**Success Metrics**: 12 participants, 3 different tournament formats
- **Round 1**: 3 teams of 4, full court, round robin → **Team Oreo won**
- **Round 2**: 4 teams of 3, half court, simultaneous games → **Team Blaze won**  
- **Round 3**: 2 teams of 5, full court → **Team Lightning won**
**Photos**: iPhone action shots + group photo available for upload

## CURRENT TECHNICAL STATUS
- **Location**: `/Users/jonathanjeter/Documents/Projects/lucas-basketball-tournament-rebuild/`
- **Mode**: Staging (`VITE_STAGING_MODE=true`) - showing incorrect $50 total
- **Hosting**: Vercel auto-deploy from GitHub main branch
- **Domain**: lucasjeter.com
- **Database**: Supabase (dual staging/production setup)
- **Stack**: React + TypeScript + Vite + Tailwind CSS

## PROJECT DETAILS (from lucasjeter.com/project)
**What**: Cemetery headstone cleaning with Sons of American Revolution
**When**: Saturday, September 6, 2025, 7:30 AM - Noon
**Where**: Pioneer Cemetery, Waxahachie, TX  
**Training**: SAR will provide on-site training for safe headstone preservation
**Requirements**: Manual labor, no experience needed, equipment provided
**Age**: Minors allowed with adult supervision (Boy Scout friendly)

## PRIMARY OBJECTIVES (In Priority Order)
1. **URGENT: Fix volunteer recruitment system**
2. **HOME PAGE**: Complete transformation to project promotion 
3. **PROJECT PAGE**: Update with correct date/time details
4. **TOURNAMENT SUMMARY**: Create new page documenting success
5. **PRODUCTION MODE**: Switch from staging, show correct $270 raised
6. **DONATION LINKS**: Add Venmo/Zelle for remaining $130 fundraising

## DETAILED REQUIREMENTS

### 1. HOME PAGE TRANSFORMATION
**COMPLETE OVERHAUL** - Replace tournament content with:
- **Hero Section**: "Volunteers Needed This Saturday!" with countdown
- **Project Overview**: Eagle Scout cemetery restoration with SAR
- **Call-to-Action**: Prominent volunteer signup button
- **Fundraising Update**: $270 raised, $130 remaining with donation links
- **Tournament Callout**: Brief success story linking to summary page
- **Urgency Messaging**: Only days left, need volunteers now

### 2. VOLUNTEER SYSTEM FIX
Current form likely broken (all forms required fixes). Need:
- **Working volunteer registration** with proper field validation
- **Database integration** to store volunteer signups
- **Email confirmations** for volunteers (using existing EmailJS)
- **Admin notifications** when new volunteers sign up
- **Fields needed**: Name, Email, Phone, Age (if minor), Adult supervisor (if applicable)

### 3. PROJECT PAGE UPDATES
Update `/project` with:
- **Correct date**: Saturday, September 6, 2025
- **Correct time**: 7:30 AM - 12:00 PM  
- **Volunteer requirements**: Manual labor, no experience, equipment provided
- **Age policy**: Minors welcome with adult supervision
- **SAR training**: On-site headstone preservation training provided

### 4. TOURNAMENT SUMMARY PAGE
Create `/tournament-summary` with:
- **Event overview**: Date, participants, format
- **Results**: 3 rounds with winning teams (Oreo, Blaze, Lightning)
- **Photo gallery**: iPhone action shots + group photo
- **Fundraising success**: $270 raised toward $400 goal
- **Thank you message**: Participants, sponsors, community support
- **Next steps**: Link to project volunteer signup

### 5. PRODUCTION MODE SWITCH
- **Switch**: `VITE_STAGING_MODE=false` in `.env.local`
- **Update stats**: Show correct $270 raised
- **Verify**: All production data displaying correctly
- **Test**: All forms working with production database

### 6. DONATION SYSTEM UPDATES
Add payment options for remaining $130:
- **Venmo**: @LucasJeter (or provide correct handle)
- **Zelle**: lucasjeter@email.com (or provide correct email)
- **PayPal**: Keep existing if functional
- **Clear messaging**: "$270 raised, $130 remaining for Eagle Scout project"

## FILE STRUCTURE REFERENCE
```
src/
├── pages/
│   ├── HomePage.tsx (MAJOR OVERHAUL)
│   ├── ProjectPage.tsx (UPDATE DETAILS)
│   ├── TournamentSummary.tsx (CREATE NEW)
│   └── ...existing pages
├── components/
│   ├── forms/ (FIX VOLUNTEER FORM)
│   ├── ui/ (existing components)
│   └── ...
├── types/ (existing tournament types available)
└── lib/supabase.ts (database client)
```

## ENVIRONMENT CONFIGURATION
```bash
# Current staging mode - SWITCH TO PRODUCTION
VITE_STAGING_MODE=true → Change to false or remove

# EmailJS for notifications (existing setup)
VITE_EMAILJS_PUBLIC_KEY=dV7RQfW16zyGB39Ya
VITE_EMAILJS_SERVICE_ID=service_o9mmb5d
VITE_EMAILJS_TEMPLATE_ID=template_q37o7y8
VITE_EMAILJS_ADMIN_TEMPLATE_ID=template_8aa9zak
```

## SUCCESS CRITERIA
- [ ] Home page completely transformed to volunteer recruitment
- [ ] Volunteer form working and storing submissions
- [ ] Project page updated with correct September 6 details  
- [ ] Tournament summary page created with results and photos
- [ ] Production mode active showing correct $270 raised
- [ ] Donation links (Venmo/Zelle) prominently displayed
- [ ] Email confirmations working for volunteer signups
- [ ] Site deployed and live at lucasjeter.com
- [ ] Urgent messaging throughout emphasizing Saturday deadline

## DEPLOYMENT PROCESS
```bash
# After changes:
git add . && git commit -m "Post-tournament: Transform to project promotion" && git push origin main
# Auto-deploys to lucasjeter.com via Vercel
```

## CRITICAL SUCCESS FACTORS
1. **URGENCY**: Every page should emphasize Saturday deadline
2. **CLEAR CALL-TO-ACTION**: Volunteer signup must be prominent
3. **WORKING FORMS**: Volunteer registration must capture signups
4. **MOBILE FRIENDLY**: Volunteers will likely visit on phones
5. **FAST LOADING**: No barriers to volunteer registration

Transform this site from tournament registration to urgent volunteer recruitment. Lives of historical headstones depend on getting volunteers by Saturday!