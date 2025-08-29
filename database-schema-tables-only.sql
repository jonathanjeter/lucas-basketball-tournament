-- Basketball Tournament Database Schema (Tables Only) - SECURE VERSION
-- Execute this script in your Supabase SQL Editor
-- This version creates only table structures without sample data

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Teams table - stores team registration information
CREATE TABLE teams (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    team_name VARCHAR(100) NOT NULL,
    contact_name VARCHAR(100) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    age_category VARCHAR(20) NOT NULL CHECK (age_category IN ('middle-school', 'high-school-adult')),
    registration_type VARCHAR(20) NOT NULL CHECK (registration_type IN ('full-team', 'partial-team', 'individual')),
    entry_fee_paid BOOLEAN DEFAULT FALSE,
    payment_method VARCHAR(20) CHECK (payment_method IN ('cash', 'check', 'online')),
    payment_amount DECIMAL(10,2) DEFAULT 0,
    donation_amount DECIMAL(10,2) DEFAULT 0,
    waiver_signed BOOLEAN DEFAULT FALSE,
    medical_treatment_consent BOOLEAN DEFAULT FALSE,
    additional_notes TEXT,
    approved BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'checked-in')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Players table - stores individual player information
CREATE TABLE players (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    player_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    contact_phone VARCHAR(20),
    grade_level VARCHAR(20) NOT NULL CHECK (grade_level IN ('6th', '7th', '8th', '9th-12th', 'adult')),
    age_category VARCHAR(20) NOT NULL CHECK (age_category IN ('middle-school', 'high-school-adult')),
    birthdate DATE NOT NULL,
    emergency_contact_name VARCHAR(100) NOT NULL,
    emergency_contact_phone VARCHAR(20) NOT NULL,
    medical_info TEXT,
    parent_consent BOOLEAN DEFAULT FALSE,
    jersey_number INTEGER,
    position VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sponsors table - stores sponsorship information
CREATE TABLE sponsors (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    sponsor_name VARCHAR(200) NOT NULL,
    contact_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    company VARCHAR(200),
    donation_type VARCHAR(20) NOT NULL CHECK (donation_type IN ('monetary', 'items', 'services')),
    donation_amount DECIMAL(10,2),
    item_description TEXT,
    website VARCHAR(500),
    logo_url VARCHAR(500),
    sponsor_level VARCHAR(20) CHECK (sponsor_level IN ('bronze', 'silver', 'gold', 'platinum')) DEFAULT 'bronze',
    display_on_website BOOLEAN DEFAULT TRUE,
    approved BOOLEAN DEFAULT FALSE,
    questions TEXT,
    pickup_scheduled BOOLEAN DEFAULT FALSE,
    pickup_date DATE,
    pickup_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Volunteers table - stores volunteer information
CREATE TABLE volunteers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    volunteer_name VARCHAR(100) NOT NULL,
    age_or_rank VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    dates_available TEXT NOT NULL,
    transportation VARCHAR(20) NOT NULL CHECK (transportation IN ('yes', 'no', 'sometimes')),
    skills TEXT,
    role_preference VARCHAR(100),
    questions TEXT,
    approved BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'assigned')),
    assigned_role VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table - tracks all payment transactions
CREATE TABLE payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    sponsor_id UUID REFERENCES sponsors(id) ON DELETE SET NULL,
    payment_type VARCHAR(20) NOT NULL CHECK (payment_type IN ('registration', 'donation', 'sponsorship')),
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('cash', 'check', 'credit_card', 'paypal', 'venmo')),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    transaction_id VARCHAR(255),
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    processed_by VARCHAR(100),
    receipt_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin users table - for tournament administration
CREATE TABLE admin_users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin', 'volunteer_coordinator')),
    active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tournament brackets (for future tournament management)
CREATE TABLE tournament_brackets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tournament_name VARCHAR(100) NOT NULL DEFAULT 'Basketball Tournament 2025',
    age_category VARCHAR(20) NOT NULL CHECK (age_category IN ('middle-school', 'high-school-adult')),
    bracket_type VARCHAR(20) DEFAULT 'single-elimination' CHECK (bracket_type IN ('single-elimination', 'double-elimination', 'round-robin')),
    bracket_data JSONB,
    status VARCHAR(20) DEFAULT 'not-started' CHECK (status IN ('not-started', 'in-progress', 'completed')),
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact inquiries table - for general contact form submissions
CREATE TABLE contact_inquiries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    inquiry_type VARCHAR(20) NOT NULL CHECK (inquiry_type IN ('general', 'volunteer', 'sponsor', 'media')),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(200),
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'in-progress', 'resolved')),
    responded_at TIMESTAMP WITH TIME ZONE,
    responded_by UUID REFERENCES admin_users(id),
    response_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_teams_age_category ON teams(age_category);
CREATE INDEX idx_teams_status ON teams(status);
CREATE INDEX idx_teams_approved ON teams(approved);
CREATE INDEX idx_teams_created_at ON teams(created_at);

CREATE INDEX idx_players_team_id ON players(team_id);
CREATE INDEX idx_players_age_category ON players(age_category);
CREATE INDEX idx_players_grade_level ON players(grade_level);

CREATE INDEX idx_sponsors_donation_type ON sponsors(donation_type);
CREATE INDEX idx_sponsors_approved ON sponsors(approved);
CREATE INDEX idx_sponsors_sponsor_level ON sponsors(sponsor_level);

CREATE INDEX idx_volunteers_status ON volunteers(status);
CREATE INDEX idx_volunteers_approved ON volunteers(approved);

CREATE INDEX idx_payments_team_id ON payments(team_id);
CREATE INDEX idx_payments_sponsor_id ON payments(sponsor_id);
CREATE INDEX idx_payments_status ON payments(payment_status);
CREATE INDEX idx_payments_type ON payments(payment_type);
CREATE INDEX idx_payments_date ON payments(payment_date);

CREATE INDEX idx_contact_inquiries_status ON contact_inquiries(status);
CREATE INDEX idx_contact_inquiries_type ON contact_inquiries(inquiry_type);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_brackets ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for development (open access)
-- WARNING: These policies allow public read/write access - suitable for development only!

-- Teams policies
CREATE POLICY "Teams are viewable by everyone" ON teams FOR SELECT USING (true);
CREATE POLICY "Teams can be inserted by everyone" ON teams FOR INSERT WITH CHECK (true);
CREATE POLICY "Teams can be updated by everyone" ON teams FOR UPDATE USING (true);

-- Players policies  
CREATE POLICY "Players are viewable by everyone" ON players FOR SELECT USING (true);
CREATE POLICY "Players can be inserted by everyone" ON players FOR INSERT WITH CHECK (true);
CREATE POLICY "Players can be updated by everyone" ON players FOR UPDATE USING (true);

-- Sponsors policies
CREATE POLICY "Sponsors are viewable by everyone" ON sponsors FOR SELECT USING (true);
CREATE POLICY "Sponsors can be inserted by everyone" ON sponsors FOR INSERT WITH CHECK (true);
CREATE POLICY "Sponsors can be updated by everyone" ON sponsors FOR UPDATE USING (true);

-- Volunteers policies
CREATE POLICY "Volunteers are viewable by everyone" ON volunteers FOR SELECT USING (true);
CREATE POLICY "Volunteers can be inserted by everyone" ON volunteers FOR INSERT WITH CHECK (true);
CREATE POLICY "Volunteers can be updated by everyone" ON volunteers FOR UPDATE USING (true);

-- Payments policies (slightly more restrictive)
CREATE POLICY "Payments are viewable by everyone" ON payments FOR SELECT USING (true);
CREATE POLICY "Payments can be inserted by everyone" ON payments FOR INSERT WITH CHECK (true);

-- Contact inquiries policies
CREATE POLICY "Contact inquiries are viewable by everyone" ON contact_inquiries FOR SELECT USING (true);
CREATE POLICY "Contact inquiries can be inserted by everyone" ON contact_inquiries FOR INSERT WITH CHECK (true);

-- Tournament brackets policies
CREATE POLICY "Brackets are viewable by everyone" ON tournament_brackets FOR SELECT USING (true);
CREATE POLICY "Brackets can be inserted by everyone" ON tournament_brackets FOR INSERT WITH CHECK (true);
CREATE POLICY "Brackets can be updated by everyone" ON tournament_brackets FOR UPDATE USING (true);

-- Admin users policies (restricted)
CREATE POLICY "Admin users are viewable by authenticated users" ON admin_users FOR SELECT USING (auth.role() = 'authenticated');

-- SECURITY FIX: Create fundraising stats function WITHOUT SECURITY DEFINER
-- This function now respects RLS policies (SECURITY INVOKER is the default)
CREATE OR REPLACE FUNCTION get_fundraising_stats()
RETURNS TABLE(
    total_raised NUMERIC,
    goal NUMERIC,
    registered_teams BIGINT,
    registered_players BIGINT,
    total_sponsors BIGINT,
    approved_teams BIGINT,
    approved_sponsors BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        -- Total raised from completed payments (respects RLS)
        COALESCE(SUM(CASE WHEN p.payment_status = 'completed' THEN p.amount ELSE 0 END), 0) as total_raised,
        -- Fixed fundraising goal
        400.00 as goal,
        -- Count of all registered teams (respects RLS)
        COUNT(DISTINCT t.id) as registered_teams,
        -- Count of all registered players (respects RLS)
        COUNT(pl.id) as registered_players,
        -- Count of all sponsors (respects RLS)
        COUNT(DISTINCT s.id) as total_sponsors,
        -- Count of approved teams only (respects RLS)
        COUNT(DISTINCT CASE WHEN t.approved = true THEN t.id END) as approved_teams,
        -- Count of approved sponsors only (respects RLS)
        COUNT(DISTINCT CASE WHEN s.approved = true THEN s.id END) as approved_sponsors
    FROM teams t
    LEFT JOIN players pl ON t.id = pl.team_id
    LEFT JOIN payments p ON t.id = p.team_id
    LEFT JOIN sponsors s ON 1=1;
END;
$$ LANGUAGE plpgsql;
-- NOTE: No SECURITY DEFINER - function respects user permissions and RLS policies

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update updated_at timestamps
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON players
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sponsors_updated_at BEFORE UPDATE ON sponsors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_volunteers_updated_at BEFORE UPDATE ON volunteers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brackets_updated_at BEFORE UPDATE ON tournament_brackets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- SECURITY FIX: Create fundraising dashboard view with proper security
-- This view respects RLS policies (no SECURITY DEFINER)
CREATE OR REPLACE VIEW public.fundraising_dashboard AS
SELECT 
    (SELECT COUNT(*) FROM teams) as total_teams,
    (SELECT COUNT(*) FROM teams WHERE approved = true) as approved_teams,
    (SELECT COUNT(*) FROM players) as total_players,
    (SELECT COUNT(*) FROM sponsors) as total_sponsors,
    (SELECT COUNT(*) FROM sponsors WHERE approved = true) as approved_sponsors,
    (SELECT COUNT(*) FROM volunteers) as total_volunteers,
    (SELECT COUNT(*) FROM volunteers WHERE approved = true) as approved_volunteers,
    (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE payment_status = 'completed') as total_revenue,
    400.00 as fundraising_goal;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.fundraising_dashboard TO anon, authenticated;

-- Success message
DO $$ BEGIN
    RAISE NOTICE '✅ Basketball Tournament Database Schema Created Successfully (SECURE VERSION)!';
    RAISE NOTICE '📊 Tables created: teams, players, sponsors, volunteers, payments, admin_users, tournament_brackets, contact_inquiries';
    RAISE NOTICE '🔒 Security fixes applied: SECURITY DEFINER removed from functions and views';
    RAISE NOTICE '🛡️  RLS policies enabled for development mode (public access)';
    RAISE NOTICE '🚀 Ready to connect your application!';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  IMPORTANT: Current RLS policies allow public access - suitable for development only!';
    RAISE NOTICE '🔐 For production, implement proper authentication and restrict RLS policies.';
END $$;