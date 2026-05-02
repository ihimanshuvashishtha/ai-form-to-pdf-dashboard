"use client";

import { jsPDF } from "jspdf";
import { FormSubmission } from "./supabase";

export function generateAndDownloadPDF(submission: FormSubmission) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const primaryColor = [139, 92, 246]; // Modern violet rgb
  const textDark = [15, 23, 42]; // Slate 900
  const textMuted = [100, 116, 139]; // Slate 500

  // Margins
  const marginX = 20;
  let cursorY = 25;

  // Header Title
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(marginX, cursorY, 5, 12, "F");

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text("AI Project Report", marginX + 10, cursorY + 9);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 190, cursorY + 8, { align: "right" });

  cursorY += 22;

  // Horizontal divider
  doc.setDrawColor(226, 232, 240); // Slate 200
  doc.setLineWidth(0.4);
  doc.line(marginX, cursorY, 190, cursorY);

  cursorY += 12;

  // Project Details Header
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text(submission.project_title, marginX, cursorY);

  cursorY += 8;

  // Subtitle (Type & Timeline)
  doc.setFont("Helvetica", "italic");
  doc.setFontSize(11);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(`${submission.project_type}  |  Est. Timeline: ${submission.timeline}  |  Budget: ${submission.budget}`, marginX, cursorY);

  cursorY += 14;

  // Client Details block
  doc.setFillColor(248, 250, 252); // Slate 50
  doc.rect(marginX, cursorY, 170, 24, "F");
  doc.setDrawColor(226, 232, 240);
  doc.rect(marginX, cursorY, 170, 24, "S");

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text("Client Information", marginX + 8, cursorY + 8);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Name: ${submission.client_name}`, marginX + 8, cursorY + 16);
  doc.text(`Email: ${submission.client_email}`, 110, cursorY + 16);

  cursorY += 34;

  // Project Description section
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text("Project Overview & Description", marginX, cursorY);

  cursorY += 6;

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85); // Slate 700

  const splitDescription = doc.splitTextToSize(submission.project_description, 170);
  doc.text(splitDescription, marginX, cursorY);

  cursorY += splitDescription.length * 5 + 8;

  // Requirements section
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text("Technical & Functional Requirements", marginX, cursorY);

  cursorY += 6;

  doc.setFont("Helvetica", "normal");
  const splitRequirements = doc.splitTextToSize(submission.requirements, 170);
  doc.text(splitRequirements, marginX, cursorY);

  cursorY += splitRequirements.length * 5 + 10;

  // Notes or AI Summary section
  if (submission.ai_summary || submission.notes) {
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text(submission.ai_summary ? "AI-Generated Summary & Insights" : "Additional Project Notes", marginX, cursorY);

    cursorY += 6;

    doc.setFont("Helvetica", "normal");
    const contentText = submission.ai_summary || submission.notes || "";
    const splitNotes = doc.splitTextToSize(contentText, 170);
    doc.text(splitNotes, marginX, cursorY);

    cursorY += splitNotes.length * 5 + 8;
  }

  // Footer metadata
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184); // Slate 400
  doc.text("This report is generated dynamically by AI Form to PDF Dashboard.", marginX, 280);

  // Download PDF file
  const filename = `${submission.project_title.replace(/\s+/g, "_").toLowerCase()}_report.pdf`;
  doc.save(filename);
}
