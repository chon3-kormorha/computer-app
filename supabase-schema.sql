-- ======================================================================
-- Supabase SQL Schema for Flowchart Game PWA App
-- Copy and run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/cllnwbegfunhmttplovv/sql
-- ======================================================================

-- 1. Create Students Table
CREATE TABLE IF NOT EXISTS public.students (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    grade TEXT NOT NULL,
    score INT8 DEFAULT 0,
    stars INT8 DEFAULT 0,
    "levelsCompleted" TEXT DEFAULT '[]',
    "timeSpentSec" INT8 DEFAULT 0,
    "lastActive" TEXT,
    "certificateIssued" INT8 DEFAULT 0,
    "hasCompletedTutorial" INT8 DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Config Table
CREATE TABLE IF NOT EXISTS public.config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

-- 3. Create Classrooms Table
CREATE TABLE IF NOT EXISTS public.classrooms (
    name TEXT PRIMARY KEY
);

-- 4. Enable Row Level Security (RLS) & Grant Public Read/Write
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read/write students" ON public.students FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write config" ON public.config FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write classrooms" ON public.classrooms FOR ALL USING (true) WITH CHECK (true);

-- 5. Seed Default Passcode & Classrooms
INSERT INTO public.config (key, value) VALUES 
('studentPasscode', '1234'),
('adminUsername', 'admin'),
('adminPassword', 'admin1234')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.classrooms (name) VALUES 
('ป.4/1'), ('ป.4/2'), ('ป.5/1'), ('ป.5/2'), ('ม.1/1'), ('ม.1/2')
ON CONFLICT (name) DO NOTHING;
