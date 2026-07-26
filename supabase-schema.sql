-- ======================================================================
-- Supabase SQL Schema for Flowchart Learning Game App
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/cllnwbegfunhmttplovv/sql
-- ======================================================================

-- ── 0. DROP existing tables (clean reset) ─────────────────────────────
DROP TABLE IF EXISTS public.students CASCADE;
DROP TABLE IF EXISTS public.config CASCADE;
DROP TABLE IF EXISTS public.classrooms CASCADE;

-- ── 1. Students Table ─────────────────────────────────────────────────
CREATE TABLE public.students (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    grade TEXT NOT NULL,
    score INT8 DEFAULT 0,
    stars INT8 DEFAULT 0,
    "levelsCompleted" TEXT DEFAULT '[]',
    "tutorialTopicsCompleted" TEXT DEFAULT '[]',
    "timeSpentSec" INT8 DEFAULT 0,
    "lastActive" TEXT,
    "certificateIssued" INT8 DEFAULT 0,
    "hasCompletedTutorial" INT8 DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 2. Config Table ───────────────────────────────────────────────────
CREATE TABLE public.config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

-- ── 3. Classrooms Table ───────────────────────────────────────────────
CREATE TABLE public.classrooms (
    name TEXT PRIMARY KEY
);

-- ── 4. Row Level Security ─────────────────────────────────────────────
ALTER TABLE public.students   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.config     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_students"   ON public.students   FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_config"     ON public.config     FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_classrooms" ON public.classrooms FOR ALL USING (true) WITH CHECK (true);

-- ── 5. Seed Default Config ────────────────────────────────────────────
INSERT INTO public.config (key, value) VALUES
    ('studentPasscode', '1234'),
    ('adminUsername',   'admin'),
    ('adminPassword',   'admin1234')
ON CONFLICT (key) DO NOTHING;

-- ── 6. Seed Default Classrooms ────────────────────────────────────────
INSERT INTO public.classrooms (name) VALUES
    ('ป.4/1'), ('ป.4/2'), ('ป.4/3'),
    ('ป.5/1'), ('ป.5/2'), ('ป.5/3'),
    ('ป.6/1'), ('ป.6/2')
ON CONFLICT (name) DO NOTHING;
