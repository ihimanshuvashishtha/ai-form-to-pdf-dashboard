-- AI Form to PDF Generator - Database Schema

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  full_name TEXT,
  avatar_url TEXT
);

-- FORM SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.form_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  project_title TEXT NOT NULL,
  project_type TEXT NOT NULL,
  project_description TEXT NOT NULL,
  requirements TEXT NOT NULL,
  timeline TEXT NOT NULL,
  budget TEXT NOT NULL,
  notes TEXT,
  ai_summary TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'completed', 'pdf_generated')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- GENERATED PDFS TABLE
CREATE TABLE IF NOT EXISTS public.generated_pdfs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID REFERENCES public.form_submissions(id) ON DELETE CASCADE,
  pdf_url TEXT,
  pdf_blob_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_forms_user ON public.form_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_forms_status ON public.form_submissions(status);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_pdfs ENABLE ROW LEVEL SECURITY;

-- Policies for PROFILES
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Policies for FORM SUBMISSIONS
CREATE POLICY "Users can see only their submissions" ON public.form_submissions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own submissions" ON public.form_submissions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own submissions" ON public.form_submissions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own submissions" ON public.form_submissions
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for GENERATED PDFS
CREATE POLICY "Users can view their generated PDFs" ON public.generated_pdfs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.form_submissions
      WHERE public.form_submissions.id = public.generated_pdfs.submission_id
      AND public.form_submissions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their generated PDFs" ON public.generated_pdfs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.form_submissions
      WHERE public.form_submissions.id = public.generated_pdfs.submission_id
      AND public.form_submissions.user_id = auth.uid()
    )
  );
