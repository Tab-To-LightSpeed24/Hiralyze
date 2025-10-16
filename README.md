# Hiralyze: Intelligent Resume Matching & Candidate Screening

Hiralyze is an intelligent resume parsing and matching application designed to streamline the candidate screening process. It leverages a sophisticated analysis engine to parse resumes, extract key skills and experience, and match them against job descriptions to provide a compatibility score, detailed justification, and intelligent role suggestions.

- **GitHub Repository:** [**Insert GitHub Repository Link Here**]
- **Demo Video:** [**Insert 2-3 Minute Demo Video Link Here**]

---

## 1. Project Objective & Scope

### Objective

The primary goal of Hiralyze is to intelligently and efficiently screen candidates by automating the comparison of resumes against job descriptions, moving beyond simple keyword matching to a deeper, semantic understanding of a candidate's profile.

### Scope of Work

-   **Input:** Accepts multiple PDF resumes and a single job description via a user-friendly drag-and-drop interface.
-   **Data Extraction:** Intelligently parses resumes to extract structured data, including:
    -   Contact Information (Name, Email)
    -   Technical Skills & Proficiencies
    -   Professional Experience
    -   Projects & Portfolio Work
    -   Education & Academic Performance
-   **LLM-Powered Matching:** Computes a multi-factor match score (1–10) that reflects the candidate's suitability for the role.
-   **Candidate Shortlisting:** Displays processed candidates in clear "Shortlisted" and "Not Shortlisted" tabs, each with a concise justification for the decision and a suggested alternative role.

---

## 2. Architecture & Technical Implementation

This repository contains the frontend application, which demonstrates the full user experience and includes a sophisticated client-side simulation of the backend processing logic.

### Technology Stack

-   **Frontend:** React, TypeScript
-   **Styling:** Tailwind CSS, `shadcn/ui`
-   **Animations:** Framer Motion
-   **Authentication:** Supabase Auth
-   **Client-Side Parsing:** `pdfjs-dist`

### Architecture Overview

In a production environment, the application would utilize a client-server architecture:

1.  **Frontend (This Repository):** The user interacts with the React dashboard to upload resumes and the job description.
2.  **Backend API (Node.js/Python):** A secure API endpoint would receive the uploaded files.
3.  **LLM Service:** The backend would send the extracted text from the resume and the job description to a hosted Large Language Model (e.g., OpenAI, Gemini) for analysis.
4.  **Database (PostgreSQL/Supabase):** The parsed, structured data from the resumes and the analysis results from the LLM would be stored for future reference and analytics.

For this demonstration, the backend processing, data extraction, and LLM analysis are **simulated directly on the client-side** within the React application to provide a seamless, all-in-one user experience.

---

## 3. LLM Integration & Prompt Engineering

The core intelligence of Hiralyze lies in its analysis engine, which is designed to function like a sophisticated Large Language Model. The logic follows a structured, multi-factor evaluation process based on the conceptual prompt below.

### Conceptual LLM Prompt Structure

```
"Analyze the provided candidate's resume against the given job description. Your task is to act as an expert technical recruiter.

1.  **Extract Structured Data:** From the resume, identify and structure the following: Name, Email, Technical Skills, Professional Experience, Projects, and Education.

2.  **Identify Core Requirements:** From the job description, identify the primary job role and the key technical and experiential requirements.

3.  **Perform Multi-Factor Scoring (1-10):** Calculate a match score based on a weighted analysis of:
    a.  **Skill Alignment:** The percentage of required skills present in the candidate's profile.
    b.  **Experience Relevance:** The degree to which the candidate's past projects and work history align with the job's responsibilities.
    c.  **Project Depth:** The number and quality of relevant projects that demonstrate practical application of required skills.

4.  **Provide Justification:** Write a clear, concise justification for the final score, explaining whether the candidate is shortlisted and why. Reference the skill match percentage.

5.  **Suggest Alternative Role:** Based on the candidate's complete skill set, suggest an alternative job role where they might be a strong fit, even if they do not perfectly match the current job description.

**Resume Text:** [Candidate's resume text]
**Job Description:** [Job description text]"
```

---

## 4. Demo & Evaluation Guide

To fully evaluate the application's capabilities, we recommend testing the following three scenarios.

### Scenario 1: The Perfect Match (High Score & Shortlisted)

-   **Action:** Paste a job description for a **"Full Stack Developer"** and upload a resume with strong matching skills (e.g., `React`, `Node.js`, `Python`, `PostgreSQL`, `AWS`).
-   **Expected Result:** The candidate appears in the **Shortlisted** tab with a high score (e.g., 8/10). The justification will highlight the high percentage of matched keywords, and the suggested role will be "Full Stack Developer."

### Scenario 2: The Niche Specialist (Low Score & Role Suggestion)

-   **Action:** Use the same "Full Stack Developer" job description, but upload a resume for a **"Mechanical Design Engineer"** (e.g., skills like `SolidWorks`, `AutoCAD`, `ANSYS`, `GD&T`).
-   **Expected Result:** The candidate appears in the **Not Shortlisted** tab with a low score (e.g., 1/10). Crucially, the **Suggested Role** will correctly identify them as a "Mechanical Design Engineer," demonstrating the system's ability to analyze a profile holistically.

### Scenario 3: The Unconventional Format (Robust Parsing)

-   **Action:** Use any job description and upload a resume with an unconventional or minimalist format.
-   **Expected Result:** The system demonstrates its robust parsing capabilities by correctly extracting the available technical skills, even without clear "Skills" or "Experience" sections, and provides an accurate, albeit potentially low, score based on the data it could find.

---

### Evaluation Focus Checklist

-   [✔] **Code Quality & Structure:** Clean, modern React/TypeScript codebase.
-   [✔] **Data Extraction:** Robust client-side PDF parsing and data structuring.
-   [✔] **LLM Prompt Quality:** Sophisticated, multi-factor analysis logic.
-   [✔] **Output Clarity:** Clear, actionable results with justifications and suggestions.