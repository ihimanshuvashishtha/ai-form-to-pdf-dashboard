-- Seed initial demo profiles and submissions
-- Replace user UUID if needed for local Supabase Docker testing
INSERT INTO public.profiles (id, full_name, avatar_url)
VALUES 
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Demo User', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.form_submissions (id, user_id, client_name, client_email, project_title, project_type, project_description, requirements, timeline, budget, notes, ai_summary, status)
VALUES 
  ('f7e841db-29b1-4f81-9b16-cd3e54b66b44', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Acme Corp', 'contact@acme.com', 'Acme Modern E-commerce Platform', 'E-commerce', 'Build a Next.js 14 based online store with serverless checkout.', 'Stripe payment integration, User authentication, Order history, Product search', '3 months', '$25,000', 'Integrate with local ERP.', 'A modern Next.js 14 based e-commerce solution delivering exceptional performance and high reliability.', 'completed')
ON CONFLICT (id) DO NOTHING;
