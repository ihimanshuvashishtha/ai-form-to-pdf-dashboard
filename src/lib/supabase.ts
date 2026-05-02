"use client";

export interface Profile {
  id: string;
  full_name: string;
  avatar_url?: string;
}

export interface FormSubmission {
  id: string;
  user_id?: string;
  client_name: string;
  client_email: string;
  project_title: string;
  project_type: string;
  project_description: string;
  requirements: string;
  timeline: string;
  budget: string;
  notes?: string;
  ai_summary?: string;
  status: "draft" | "completed" | "pdf_generated";
  created_at: string;
  updated_at: string;
}

// In-memory / LocalStorage fallback layer for 100% stable zero-crash operations
class SupabaseHybridLayer {
  private inMemorySubmissions: FormSubmission[] = [];

  constructor() {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("portfolio_form_submissions");
      if (stored) {
        try {
          this.inMemorySubmissions = JSON.parse(stored);
        } catch (e) {
          this.inMemorySubmissions = [];
        }
      } else {
        // Initialize with default demo data if completely empty
        this.inMemorySubmissions = [
          {
            id: "f7e841db-29b1-4f81-9b16-cd3e54b66b44",
            user_id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
            client_name: "Acme Corp",
            client_email: "contact@acme.com",
            project_title: "Acme Modern E-commerce Platform",
            project_type: "E-commerce",
            project_description: "Build a Next.js 14 based online store with serverless checkout.",
            requirements: "Stripe payment integration, User authentication, Order history, Product search",
            timeline: "3 months",
            budget: "$25,000",
            notes: "Integrate with local ERP system.",
            ai_summary: "Acme Modern E-commerce delivers top-tier performance, ultra-fast loading, and a visually immersive interface to maximize conversion.",
            status: "completed",
            created_at: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
            updated_at: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
          },
          {
            id: "2d1f7c78-62d2-43fa-a692-a1f9a0c6488a",
            user_id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
            client_name: "Quantum Systems",
            client_email: "hello@quantum-sys.org",
            project_title: "Cloud Infrastructure Visualizer",
            project_type: "DevOps Tooling",
            project_description: "Interactive real-time map of microservice deployments with trace analytics.",
            requirements: "OAuth2 linking, Kubernetes cluster integration, Graph visualizer with canvas",
            timeline: "5 months",
            budget: "$60,000",
            notes: "Focus on AWS compatibility first.",
            ai_summary: "Quantum Cloud Visualizer utilizes real-time Kubernetes tracking to streamline infrastructure observability across multi-cloud clusters.",
            status: "pdf_generated",
            created_at: new Date(Date.now() - 3600 * 1000 * 50).toISOString(),
            updated_at: new Date(Date.now() - 3600 * 1000 * 50).toISOString(),
          },
        ];
        localStorage.setItem("portfolio_form_submissions", JSON.stringify(this.inMemorySubmissions));
      }
    }
  }

  private save() {
    if (typeof window !== "undefined") {
      localStorage.setItem("portfolio_form_submissions", JSON.stringify(this.inMemorySubmissions));
    }
  }

  // Submission Operations
  async getSubmissions(): Promise<FormSubmission[]> {
    return [...this.inMemorySubmissions].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  async getSubmissionById(id: string): Promise<FormSubmission | null> {
    const sub = this.inMemorySubmissions.find((item) => item.id === id);
    return sub ? { ...sub } : null;
  }

  async insertSubmission(data: Omit<FormSubmission, "id" | "created_at" | "updated_at">): Promise<FormSubmission> {
    const newItem: FormSubmission = {
      ...data,
      id: Math.random().toString(36).substring(2, 11) + "_" + Date.now().toString(36),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.inMemorySubmissions.push(newItem);
    this.save();
    return newItem;
  }

  async updateSubmission(id: string, data: Partial<Omit<FormSubmission, "id" | "created_at">>): Promise<FormSubmission | null> {
    const idx = this.inMemorySubmissions.findIndex((item) => item.id === id);
    if (idx === -1) return null;

    this.inMemorySubmissions[idx] = {
      ...this.inMemorySubmissions[idx],
      ...data,
      updated_at: new Date().toISOString(),
    };
    this.save();
    return this.inMemorySubmissions[idx];
  }

  async deleteSubmission(id: string): Promise<boolean> {
    const before = this.inMemorySubmissions.length;
    this.inMemorySubmissions = this.inMemorySubmissions.filter((item) => item.id !== id);
    this.save();
    return this.inMemorySubmissions.length < before;
  }
}

export const dbLayer = new SupabaseHybridLayer();
