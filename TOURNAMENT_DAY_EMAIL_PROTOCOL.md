# Tournament Day Email Protocol & Operations Guide

## 🏀 Lucas's Eagle Scout Basketball Tournament - August 30, 2025

This guide provides **comprehensive email system protocols** for tournament day operations, ensuring smooth communication with all participants.

---

## 📋 **Pre-Tournament Setup (August 29, 2025)**

### **1. Environment Verification** ⚙️
**Time**: Day before tournament (evening)

✅ **Switch to Production Mode**:
```bash
# In .env.local
VITE_STAGING_MODE=false
# OR remove the line entirely
```

✅ **Verify EmailJS Configuration**:
- [ ] Service ID configured and active
- [ ] Public key valid and not expired
- [ ] Participant template published and tested
- [ ] Admin template published and tested
- [ ] Email quota sufficient (check EmailJS dashboard)

✅ **Test Email Delivery**:
- [ ] Send test participant confirmation to your own email
- [ ] Send test admin notification to tournament organizers
- [ ] Verify emails arrive within 30 seconds
- [ ] Check spam folders and email formatting

### **2. Contact List Preparation** 📞
**Time**: Day before tournament

✅ **Key Personnel Contacts**:
- **Tournament Director**: Lucas (primary contact)
- **Parent Coordinator**: [Parent/Guardian contact]
- **Volunteer Coordinator**: [Volunteer lead contact]
- **Emergency Contact**: [School/venue contact]

✅ **Email Distribution Lists**:
- **Admin Notifications**: All tournament staff emails
- **Emergency Contacts**: Key personnel only
- **Volunteer Updates**: Volunteer coordinator emails

### **3. Communication Templates Ready** 📧
**Time**: Day before tournament

✅ **Standard Messages**:
- Team check-in confirmations
- Schedule updates/delays
- Emergency notifications
- Final tournament instructions

---

## 🌅 **Tournament Day Morning (6:00 AM - 7:30 AM)**

### **1. System Status Check** 📊
**Time**: 6:00 AM (1.5 hours before check-in)

✅ **Technical Verification**:
```bash
# Admin Dashboard → Email Testing Tab
1. Verify production mode active
2. Check EmailJS configuration status  
3. Send test emails to staff
4. Confirm database connectivity
5. Review overnight registrations
```

✅ **Registration Review**:
- [ ] Check for new overnight registrations
- [ ] Review pending approvals
- [ ] Verify team contact information
- [ ] Confirm participant counts

### **2. Pre-Check-In Communications** 📱
**Time**: 6:30 AM (1 hour before check-in)

✅ **Team Reminder Sequence** (if needed):
```
Subject: 🏀 Tournament Day Reminder - Check-in at 7:30 AM

Good morning [Team Name],

Just a friendly reminder that check-in begins at 7:30 AM sharp at:
📍 Finley Junior High School Gym
📍 2401 Brown Street, Waxahachie, TX

Please bring:
✅ Entry fee ($20 per player - cash or check)  
✅ Signed waivers for all players
✅ Water bottles and snacks
✅ Basketball shoes (non-marking)

Questions? Contact Lucas at [phone/email]

See you on the court!
🏀 Tournament Staff
```

---

## 🏃‍♂️ **Check-In Period (7:30 AM - 8:00 AM)**

### **1. Real-Time Registration Monitoring** 👥
**Time**: Continuous during check-in

✅ **Admin Dashboard Operations**:
- Monitor new registrations in real-time
- Approve walk-in registrations immediately
- Update team payment status upon check-in
- Mark teams as "checked-in" in system

✅ **Communication Protocols**:
- **New registrations**: Admin notifications sent automatically
- **Missing teams**: Manual follow-up via phone/text
- **Documentation issues**: On-site resolution with notes

### **2. Last-Minute Registration Handling** ⚡
**Time**: As needed during check-in

✅ **Walk-In Registration Process**:
```
1. Manual entry via Admin Dashboard → Manual Entry
2. Immediate admin notification sent
3. Expedited waiver collection
4. Payment processing on-site
5. Team assignment to appropriate bracket
```

✅ **Emergency Contact Updates**:
- Update contact information in real-time
- Ensure emergency contacts are reachable
- Verify medical information accuracy

---

## 🏀 **Tournament Operations (8:00 AM - 4:00 PM)**

### **1. Schedule & Update Communications** 📅

✅ **Bracket Updates** (as needed):
```
Subject: 🏆 Tournament Update - [Team Name]

Hi [Team Name],

Tournament update:
🕐 Next game: [Time]
🏟️ Court: [Court Number]
👥 Opponent: [Opponent Team]

Good luck!
🏀 Tournament Staff
```

✅ **Delay Notifications** (if needed):
```
Subject: ⏰ Tournament Schedule Update

Hi Teams,

Due to [reason], we're running approximately [X] minutes behind schedule.

Updated schedule:
- [New times for affected games]

Thank you for your patience!
🏀 Tournament Staff
```

### **2. Real-Time Issue Management** 🚨

✅ **Emergency Procedures**:
- **Medical Emergency**: Stop tournament communications, focus on emergency response
- **Weather Issues**: Send immediate updates to all teams
- **Facility Issues**: Coordinate with venue staff and inform teams

✅ **Communication Hierarchy**:
1. **Critical Issues**: Immediate notification to all teams
2. **Schedule Changes**: 15-minute advance notice minimum  
3. **General Updates**: Between games or during breaks

---

## 🏆 **Tournament Conclusion (3:00 PM - 4:30 PM)**

### **1. Winner Notifications & Photos** 📸
**Time**: Immediately after championship games

✅ **Championship Announcements**:
```
Subject: 🏆 Congratulations Champions! 

Congratulations to our tournament winners:

🥇 Middle School Division: [Team Name]
🥇 High School/Adult Division: [Team Name]

Thank you to all teams for participating in Lucas's Eagle Scout project! 
Your support helps promote youth fitness and community engagement.

🏀 Tournament Staff
```

### **2. Thank You & Follow-Up Messages** 🙏
**Time**: Within 1 hour of tournament end

✅ **Participant Thank You** (automated via registration system):
```
Subject: 🏀 Thank You for Supporting Lucas's Eagle Scout Project!

Dear [Team Name],

Thank you for participating in today's 3-on-3 Basketball Tournament!

Tournament Results:
🏆 Champions announced
📊 [X] teams participated  
💰 $[Amount] raised for the Eagle Scout project

Your participation helps Lucas achieve the highest rank in Scouting while bringing our community together through basketball.

Photos and final results will be shared soon!

With gratitude,
🦅 Lucas & Tournament Staff
```

---

## 🚨 **Emergency Communication Protocols**

### **1. Medical Emergency Response** 🚑

✅ **Immediate Actions**:
1. **Stop tournament activities** if necessary
2. **Call emergency services** (911)
3. **Notify tournament staff** immediately
4. **DO NOT send mass emails** during active emergency
5. **Document incident** for follow-up

✅ **Post-Emergency Communication**:
```
Subject: Tournament Safety Update

Teams and Parents,

We experienced a medical situation that has been resolved with proper emergency care. The participant is receiving appropriate medical attention.

Tournament activities [will resume/are suspended] at [time].

Thank you for your patience and understanding.

Tournament Staff
```

### **2. Severe Weather Protocol** ⛈️

✅ **Weather Monitoring**:
- Check weather radar every 30 minutes
- Have indoor backup plan ready
- Monitor National Weather Service alerts

✅ **Weather Delay/Cancellation**:
```
Subject: 🌧️ Tournament Weather Update

Important Weather Alert:

Due to [weather condition], the tournament is:
- [X] Temporarily suspended
- [X] Moving indoors to [location]  
- [X] Cancelled and will be rescheduled

Please [specific instructions for teams].

Updates will be sent every 30 minutes.

Tournament Staff
```

---

## 📊 **Post-Tournament Operations (4:30 PM - 6:00 PM)**

### **1. Data Collection & Documentation** 📋

✅ **Tournament Statistics**:
- Final team count and participation numbers
- Total funds raised for Eagle Scout project
- Email delivery success rates
- System performance metrics

✅ **Follow-Up Tasks**:
- Export team contact information
- Document lessons learned
- Prepare final project report
- Schedule thank-you follow-ups

### **2. System Maintenance** 🔧

✅ **Email System Review**:
- Check EmailJS usage and quota
- Review delivery logs for any failures
- Document any technical issues
- Prepare improvements for future events

✅ **Database Cleanup**:
- Mark tournament as completed
- Archive registration data
- Update team statuses
- Backup all tournament data

---

## 📱 **Communication Channels & Backup Plans**

### **Primary Communication Methods**
1. **Email System** (EmailJS) - Primary for formal communications
2. **Admin Dashboard** - Real-time registration monitoring
3. **Direct Phone Contact** - Emergency and urgent issues
4. **Text Messages** - Time-sensitive updates

### **Backup Communication Plans**
1. **EmailJS Failure**: Use personal email accounts with pre-written templates
2. **Internet Issues**: Use mobile hotspot for admin dashboard access
3. **Database Issues**: Maintain paper backup of team information
4. **Power Outage**: Use mobile devices with portable chargers

---

## ✅ **Tournament Day Checklist**

### **6:00 AM - System Check**
- [ ] Switch to production mode
- [ ] Test email delivery
- [ ] Check admin dashboard access
- [ ] Verify staff contact list

### **7:00 AM - Pre-Check-In**
- [ ] Send reminder emails if needed
- [ ] Set up registration table
- [ ] Test mobile internet connection
- [ ] Prepare paper backups

### **7:30 AM - Check-In Begins**
- [ ] Monitor new registrations
- [ ] Process payments and waivers
- [ ] Update team statuses
- [ ] Handle walk-in registrations

### **8:00 AM - Tournament Starts**
- [ ] Monitor for issues
- [ ] Send bracket updates
- [ ] Manage schedule changes
- [ ] Document everything

### **4:00 PM - Tournament Ends**
- [ ] Announce winners
- [ ] Send thank you messages
- [ ] Collect final statistics
- [ ] Begin cleanup process

---

## 📞 **Emergency Contacts**

- **Tournament Director**: Lucas [Phone]
- **Parent/Guardian**: [Name & Phone]
- **Venue Emergency**: Finley Junior High [Phone]
- **Medical Emergency**: 911
- **EmailJS Support**: support@emailjs.com

---

## 📧 **Email Quota Management**

### **EmailJS Free Plan Limits**:
- **200 emails per month**
- **Estimated tournament usage**: 50-100 emails
- **Buffer remaining**: 100+ emails for post-tournament

### **Usage Optimization**:
- Combine updates when possible
- Use selective sending for brackets
- Monitor quota in EmailJS dashboard
- Have backup email ready if quota exceeded

---

## 🎯 **Success Metrics**

### **Communication Goals**:
- [ ] 100% of registered teams receive confirmation emails
- [ ] <30 second email delivery time
- [ ] Zero critical communication failures
- [ ] Positive participant feedback on communication

### **Project Goals**:
- [ ] Successfully support Lucas's Eagle Scout project
- [ ] Promote youth fitness and community engagement  
- [ ] Demonstrate professional tournament organization
- [ ] Document process for future community events

---

**🏀 Ready to Run a Professional Tournament! 🦅**

This protocol ensures smooth communication throughout Lucas's Eagle Scout Basketball Tournament, supporting the community while helping Lucas achieve the highest rank in Scouting.

*Last Updated: Tournament Day - August 30, 2025*