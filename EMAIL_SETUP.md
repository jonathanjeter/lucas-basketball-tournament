# EmailJS Setup Guide for Basketball Tournament

## 📧 Email Confirmation System

This guide helps you set up automated email confirmations for tournament registrations using EmailJS.

## 🎯 What You'll Get

✅ **Participant Confirmation Emails** - Instant registration confirmations with tournament details  
✅ **Admin Notification Emails** - Alert you when new teams register  
✅ **No Backend Required** - Uses EmailJS service for client-side email sending  
✅ **Tournament-Specific Content** - Pre-configured for August 30, 2025 tournament  

---

## 📋 Quick Setup (15 minutes)

### Step 1: Create EmailJS Account
1. **Go to [EmailJS.com](https://www.emailjs.com/)**
2. **Sign up** for a free account (allows 200 emails/month)
3. **Verify your email** address
4. **Login** to EmailJS dashboard

### Step 2: Connect Email Service
1. **Go to "Email Services"** tab
2. **Click "Add New Service"**
3. **Choose your email provider**:
   - **Gmail** (recommended for personal use)
   - **Outlook/Hotmail**
   - **Yahoo**
   - **Custom SMTP**
4. **Follow setup instructions** for your provider
5. **Test connection** and save

### Step 3: Create Email Templates
You need to create **2 email templates**:

#### Template 1: Participant Confirmation Email
1. **Go to "Email Templates"** tab
2. **Click "Create New Template"**
3. **Name**: `Basketball Tournament - Participant Confirmation`
4. **Template ID**: Copy this for later (e.g., `template_abc123`)
5. **Subject**: `🏀 Registration Confirmed - 3-on-3 Basketball Tournament`
6. **Copy/paste this content**:

```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #f97316, #ea580c); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
    <h1 style="margin: 0; font-size: 28px;">🏀 Registration Confirmed!</h1>
    <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">3-on-3 Basketball Tournament</p>
  </div>
  
  <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; color: #374151; margin: 0 0 20px 0;">
      Hi <strong>{{participant_name}}</strong>,
    </p>
    
    <p style="font-size: 16px; color: #374151; line-height: 1.6;">
      Great news! Your registration for the <strong>{{tournament_name}}</strong> has been confirmed. 
      We're excited to have <strong>{{team_name}}</strong> compete in our tournament!
    </p>
    
    <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 25px 0;">
      <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px;">📅 Tournament Details</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-weight: bold; width: 25%;">Date:</td>
          <td style="padding: 8px 0; color: #1f2937;">Saturday, August 30, 2025</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Check-in:</td>
          <td style="padding: 8px 0; color: #1f2937;"><strong>7:30 AM</strong> (Please arrive on time!)</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Tournament:</td>
          <td style="padding: 8px 0; color: #1f2937;">8:00 AM - 4:00 PM</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Location:</td>
          <td style="padding: 8px 0; color: #1f2937;">Finley Junior High School Gym</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Address:</td>
          <td style="padding: 8px 0; color: #1f2937;">2401 Brown Street<br>Waxahachie, TX 75165</td>
        </tr>
      </table>
    </div>
    
    <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 20px; margin: 25px 0;">
      <h3 style="color: #065f46; margin: 0 0 10px 0; font-size: 18px;">✅ Your Registration</h3>
      <p style="margin: 0; color: #047857; line-height: 1.6;">
        <strong>Team:</strong> {{team_name}}<br>
        <strong>Category:</strong> {{age_category}}<br>
        <strong>Players:</strong> {{players_count}}<br>
        <strong>Type:</strong> {{registration_type}}
      </p>
      
      {{#if donation_amount}}
      <p style="margin: 15px 0 0 0; color: #047857; font-weight: bold;">
        💝 Thank you for your ${{donation_amount}} donation!
      </p>
      {{/if}}
    </div>
    
    <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 25px 0;">
      <h3 style="color: #92400e; margin: 0 0 15px 0; font-size: 18px;">🎒 What to Bring</h3>
      <ul style="margin: 0; color: #78350f; line-height: 1.8;">
        <li><strong>Water bottle</strong> - Stay hydrated throughout the day</li>
        <li><strong>Basketball shoes</strong> - Non-marking soles required</li>
        <li><strong>Comfortable athletic wear</strong> - Team jerseys encouraged</li>
        <li><strong>Snacks/lunch</strong> - Food will be available for purchase</li>
        <li><strong>Signed waivers</strong> - All players must have completed forms</li>
        <li><strong>Entry fee</strong> - $20 per player (cash or check accepted)</li>
      </ul>
    </div>

    <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 20px; margin: 25px 0;">
      <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">💸 Payment Information</h3>
      <p style="margin: 0; color: #1e40af; line-height: 1.6;">
        <strong>Entry Fee:</strong> $20 per player<br>
        <strong>Payment Methods:</strong> Cash or check (made payable to "Lucas Eagle Scout Project")<br>
        <strong>When:</strong> Payment due at check-in on tournament day<br>
        <strong>Additional Donations:</strong> Gratefully accepted to support the Eagle Scout project
      </p>
    </div>

    <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 20px; margin: 25px 0;">
      <h3 style="color: #0c4a6e; margin: 0 0 15px 0; font-size: 18px;">🦅 About This Eagle Scout Project</h3>
      <p style="margin: 0; color: #0c4a6e; line-height: 1.6;">
        This tournament is part of Lucas's Eagle Scout project to promote youth fitness and community engagement. 
        Your participation helps him achieve the highest rank in Scouting while bringing our community together 
        through the love of basketball. Thank you for your support!
      </p>
    </div>
    
    <hr style="border: none; height: 1px; background: #e5e7eb; margin: 30px 0;">
    
    <h3 style="color: #1f2937; margin: 0 0 15px 0;">📞 Questions or Need Help?</h3>
    <p style="color: #6b7280; line-height: 1.6; margin: 0;">
      Contact us at: <a href="mailto:{{contact_email}}" style="color: #f97316;">{{contact_email}}</a><br>
      Phone: {{contact_phone}}<br><br>
      <strong>Tournament Director:</strong> Lucas (Eagle Scout Candidate)<br>
      We're here to help make your tournament experience great!
    </p>
    
    <div style="text-align: center; margin: 30px 0 0 0; padding: 20px 0; border-top: 1px solid #e5e7eb;">
      <p style="color: #9ca3af; margin: 0; font-size: 14px;">
        🏀 <strong>See you on the court Saturday morning!</strong> 🏀<br>
        Supporting Lucas's Eagle Scout Project
      </p>
    </div>
  </div>
</div>
```

#### Template 2: Admin Notification Email
1. **Create another template**
2. **Name**: `Basketball Tournament - Admin Notification`
3. **Template ID**: Copy this for later (e.g., `template_xyz789`)
4. **Subject**: `🚨 New Tournament Registration - {{team_name}} (PENDING APPROVAL)`
5. **Copy/paste this content**:

```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
    <h1 style="margin: 0; font-size: 28px;">🚨 New Registration Alert!</h1>
    <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Lucas's Basketball Tournament - Admin Notification</p>
  </div>
  
  <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; color: #374151; margin: 0 0 20px 0;">
      <strong>{{team_name}}</strong> has registered for the tournament and is awaiting your approval.
    </p>
    
    <div style="background: #fef2f2; border: 2px solid #fca5a5; padding: 20px; border-radius: 8px; margin: 25px 0;">
      <h3 style="color: #b91c1c; margin: 0 0 15px 0; font-size: 18px;">⏳ ACTION REQUIRED</h3>
      <p style="margin: 0; color: #991b1b; font-weight: bold;">
        This registration requires admin approval before the participant receives final confirmation.
      </p>
    </div>
    
    <div style="background: #f8fafc; border: 2px solid #e2e8f0; padding: 20px; border-radius: 8px; margin: 25px 0;">
      <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px;">👥 Team Information</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-weight: bold; width: 30%;">Team Name:</td>
          <td style="padding: 8px 0; color: #1e293b; font-weight: bold;">{{team_name}}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Contact Person:</td>
          <td style="padding: 8px 0; color: #1e293b;">{{contact_name}}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Email:</td>
          <td style="padding: 8px 0; color: #1e293b;"><a href="mailto:{{contact_email}}" style="color: #3b82f6;">{{contact_email}}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Phone:</td>
          <td style="padding: 8px 0; color: #1e293b;">{{contact_phone}}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Age Category:</td>
          <td style="padding: 8px 0; color: #1e293b;">{{age_category}}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Registration Type:</td>
          <td style="padding: 8px 0; color: #1e293b;">{{registration_type}}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Number of Players:</td>
          <td style="padding: 8px 0; color: #1e293b; font-weight: bold;">{{players_count}}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Registration Time:</td>
          <td style="padding: 8px 0; color: #1e293b;">{{registration_date}}</td>
        </tr>
      </table>
    </div>
    
    <div style="background: #fefce8; border-left: 4px solid #eab308; padding: 20px; margin: 25px 0;">
      <h3 style="color: #713f12; margin: 0 0 15px 0; font-size: 18px;">📋 Complete Player Roster</h3>
      <div style="background: white; padding: 15px; border-radius: 6px; border: 1px solid #d6d3d1;">
        <pre style="color: #78350f; font-family: 'Courier New', monospace; white-space: pre-wrap; margin: 0; font-size: 14px; line-height: 1.6;">{{players_list}}</pre>
      </div>
    </div>
    
    {{#if donation_amount}}
    <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 20px; margin: 25px 0;">
      <h3 style="color: #065f46; margin: 0 0 10px 0; font-size: 18px;">💰 Donation Pledged</h3>
      <p style="margin: 0; color: #047857; font-size: 24px; font-weight: bold;">
        ${{donation_amount}}
      </p>
      <p style="margin: 5px 0 0 0; color: #047857; font-size: 14px;">
        (Will be collected at tournament check-in)
      </p>
    </div>
    {{/if}}

    <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 20px; margin: 25px 0;">
      <h3 style="color: #0c4a6e; margin: 0 0 15px 0; font-size: 18px;">📍 Tournament Reminder</h3>
      <p style="margin: 0; color: #0c4a6e; line-height: 1.6; font-size: 14px;">
        <strong>Date:</strong> Saturday, August 30, 2025<br>
        <strong>Check-in:</strong> 7:30 AM<br>
        <strong>Location:</strong> Finley Junior High School Gym, 2401 Brown St, Waxahachie, TX<br>
        <strong>Entry Fee:</strong> $20 per player (due at check-in)
      </p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{admin_dashboard_url}}" style="background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
        🎯 Review & Approve Registration
      </a>
    </div>

    <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 25px 0;">
      <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 16px;">📝 Next Steps for Admin:</h3>
      <ol style="margin: 0; color: #6b7280; line-height: 1.8; padding-left: 20px;">
        <li>Review player information and waivers</li>
        <li>Contact the team if any information is missing</li>
        <li>Approve or request modifications via admin dashboard</li>
        <li>Participant will receive final confirmation once approved</li>
      </ol>
    </div>
    
    <hr style="border: none; height: 1px; background: #e5e7eb; margin: 30px 0;">
    
    <div style="text-align: center;">
      <p style="color: #9ca3af; font-size: 14px; margin: 0;">
        <strong>Tournament Management System</strong><br>
        Lucas's Eagle Scout Project - 3-on-3 Basketball Tournament<br>
        Registration received: {{registration_date}}
      </p>
    </div>
  </div>
</div>
```

### Step 4: Get Your Credentials
1. **Go to "Account"** tab
2. **Copy your User ID** (this is your Public Key)
3. **Go back to "Email Services"** 
4. **Copy your Service ID**
5. **Go to "Email Templates"**
6. **Copy both Template IDs** you just created

### Step 5: Update Environment Variables
In your `.env.local` file, replace these values:

```bash
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=service_abc123  # Your Service ID
VITE_EMAILJS_PUBLIC_KEY=user_xyz789     # Your User ID (Public Key)
VITE_EMAILJS_PARTICIPANT_TEMPLATE_ID=template_participant123  # Participant template ID
VITE_EMAILJS_ADMIN_TEMPLATE_ID=template_admin456             # Admin template ID
```

### Step 6: Test the Setup
1. **Restart your dev server**: `npm run dev`
2. **Register a test team** in staging mode
3. **Check your email** for confirmation
4. **Check admin email** for notification

---

## 🛠 Template Variables Reference

### Participant Email Variables:
- `{{participant_name}}` - Name of the person registering
- `{{participant_email}}` - Email address  
- `{{team_name}}` - Team name
- `{{tournament_name}}` - "3-on-3 Basketball Tournament"
- `{{tournament_date}}` - "Saturday, August 30, 2025"
- `{{tournament_time}}` - "8:00 AM - 4:00 PM"
- `{{tournament_location}}` - "Finley Junior High School Gym"
- `{{tournament_address}}` - Full address
- `{{age_category}}` - "middle-school" or "high-school-adult"
- `{{players_count}}` - Number of players
- `{{registration_type}}` - "full-team", "partial-team", or "individual"
- `{{donation_amount}}` - Amount donated
- `{{contact_phone}}` - Contact phone number
- `{{contact_email}}` - Contact email

### Admin Email Variables:
- `{{team_name}}` - Team name
- `{{contact_name}}` - Contact person name
- `{{contact_email}}` - Contact email
- `{{contact_phone}}` - Contact phone
- `{{age_category}}` - Age category
- `{{registration_type}}` - Registration type
- `{{players_count}}` - Number of players
- `{{donation_amount}}` - Donation amount
- `{{players_list}}` - Formatted list of all players
- `{{registration_date}}` - When registration occurred
- `{{admin_dashboard_url}}` - Link to admin dashboard

---

## 🔧 Troubleshooting

### "EmailJS not configured" in console
- Check all 4 environment variables are set
- Restart development server
- Verify no typos in variable names

### Emails not sending
- Check EmailJS service is connected and tested
- Verify email templates exist and are published
- Check browser console for errors
- Ensure you haven't exceeded EmailJS quota (200/month free)

### Template variables not working
- Use double curly braces: `{{variable_name}}`
- Check spelling matches exactly
- Some variables are conditional (use `{{#if}}` blocks)

### Email goes to spam
- Ask users to check spam folder
- Add your email to safe sender list
- Use a professional email service for better deliverability

---

## 💡 Tips for Success

### Email Best Practices:
- **Test thoroughly** in staging mode first
- **Keep subject lines clear** and professional
- **Include all important tournament details**
- **Make emails mobile-friendly** (they already are!)
- **Monitor your EmailJS quota** usage

### Tournament Day:
- **Switch to production mode**: `VITE_STAGING_MODE=false`
- **Monitor admin email** for new registrations
- **Have backup contact method** ready
- **Check spam folders** if emails missing

---

## 🎯 What Happens Next

After setup, your tournament will automatically:

1. ✅ **Send confirmation emails** to every participant who registers
2. ✅ **Notify you via email** of every new registration  
3. ✅ **Include all tournament details** (date, time, location)
4. ✅ **Show donation amounts** and player information
5. ✅ **Provide direct links** to admin dashboard

**Ready to keep everyone informed! 📧🏀**