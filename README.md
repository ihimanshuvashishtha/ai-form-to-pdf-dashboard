# AI Form to PDF Generator Dashboard

An enterprise-grade, beautifully styled, full-stack Next.js 14 App Router portfolio project that enables dynamic customer data capture, professional AI-powered text optimizations, robust draft persistence, and paginated client PDF exporting.

## Project Overview

This dashboard allows agencies and consultants to digitize customer acquisition forms, improve content via an inline AI Assistant, save records to Supabase, and download elegantly formatted client PDF reports.

## Features

- **Dynamic Form Capture**: Capture customer scope, timeline, and budget parameters with fully validated fields using React Hook Form & Zod.
- **AI-Powered Optimization**: Leverage OpenAI on the fly to rewrite descriptions, enhance requirements, and synthesize executive summaries.
- **Sleek PDF Exporting**: Instantly render highly customized paginated PDFs directly from submitted client files using `jspdf`.
- **LocalStorage Auto-Saving**: Preserves form entries automatically to prevent loss upon refresh or navigational changes.
- **Advanced Dashboard**: Track total registered forms, download PDFs, view, filter, edit, and delete records seamlessly.

## Tech Stack

- **Core**: Next.js 14 (App Router) & TypeScript
- **Style**: Tailwind CSS
- **Data Layers**: Supabase PostgreSQL & Local Hybrid Fallback Cache
- **Validation**: Zod
- **AI Utilities**: OpenAI API (Server-Side Server Actions)
- **Document Exporting**: jsPDF

## Getting Started

Follow these steps to initialize and run the portfolio project locally.

### Prerequisites

- Node.js >= 18.17.0
- npm >= 9.0.0

### Installation

1. Clone or download the repository.
2. Install the necessary project dependencies:

   ```bash
   npm install
   ```
3. Set up the local environment variables. Duplicate the `.env.example` file to create your own `.env.local`:

   ```bash
   cp .env.example .env.local
   ```
4. Run the local development server:

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to experience the landing page and dashboard.

## Database Setup (Supabase)

To link with a live instance, copy and run the schema SQL located inside `/supabase/schema.sql` within your Supabase project's SQL editor. Optionally, use `/supabase/seed.sql` to populate sample data.

## Demo Credentials

You can experience the authenticated dashboard routes immediately using the following fallback demo credentials:

- **Login Email**: `demo@portfolio.com`
- **Login Password**: `password123`

---
