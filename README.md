# Hiralyze: Intelligent Resume Matching

Hiralyze is an intelligent resume parsing and matching application designed to streamline the candidate screening process. It intelligently parses resumes, extracts key skills and experience, and matches them against job descriptions using a Large Language Model (LLM) to provide a compatibility score and justification.

## Scope of Work

*   **Input**: Accepts PDF/Text/Word resumes and a job description via a dedicated upload form.
*   **Data Extraction**: Extracts structured data such as skills, experience, education, and academic scores from resumes.
*   **LLM Matching**: Utilizes an LLM (simulated in the frontend for this demo) to compute a match score (1–10) between candidates and job descriptions based on multi-factor criteria.
*   **Candidate Shortlisting**: Displays shortlisted and non-shortlisted candidates in separate tabs, each with a clear justification for their fit and a suggested alternative role.

## Architecture Overview (Frontend Focus)

This repository contains the frontend application built with React and TypeScript, styled with Tailwind CSS and utilizing `shadcn/ui` components, all wrapped in a futuristic, neon-themed design.

| Component | Path | Description |
| :--- | :--- | :--- |
| **Main Dashboard** | `src/pages/Index.tsx` | Orchestrates the application flow, handles the mock processing logic, and manages the state for candidate results. |
| **Input Form** | `src/components/ResumeUploadForm.tsx` | Handles file drag-and-drop/selection and job description input. |
| **Results Display** | `src/components/CandidateList.tsx` | Renders the collection of `CandidateCard` components, separated into Shortlisted and Not Shortlisted tabs. |
| **Candidate Card** | `src/components/CandidateCard.tsx` | Displays individual candidate details, match score, suggested role, and justification. Includes a copy-to-clipboard feature. |
| **Theming/UI** | `src/components/NeonCard.tsx`, `src/components/NeonButton.tsx` | Custom components implementing the neon/futuristic aesthetic using `framer-motion` and Tailwind CSS. |
| **Authentication** | `src/components/SessionContextProvider.tsx`, `src/pages/Login.tsx` | Handles user authentication and session management using Supabase. |
| **Data Types** | `src/types/index.ts` | Defines TypeScript interfaces for data structures like `Candidate` and `JobDescription`. |

**Backend & Database (Simulated/External):**
The core LLM processing logic is currently **simulated** within `src/pages/Index.tsx` using a detailed keyword matching and scoring algorithm for demonstration purposes. In a production environment, this logic would interact with a backend API for:
*   Securely receiving resume files and job descriptions.
*   Sending these inputs to a hosted LLM (e.g., OpenAI, Gemini, or a fine-tuned model) for processing.
*   Storing parsed resume data in a database (Supabase).
*   Retrieving processed candidate data (extracted skills, match scores, justifications) for display.

## LLM Usage Guidance (Simulated Prompt Structure)

The simulated LLM logic in `src/pages/Index.tsx` performs semantic matching and scoring based on the following conceptual prompt structure:

```
"Compare the following candidate's resume against the provided job description.

1. Extract structured data: Name, Email, Skills, Experience (Projects/Work), Education (including 10th/12th/UG/PG scores).
2. Determine the primary job role inferred from the Job Description (JD) or use explicit JD keywords.
3. Apply multi-factor scoring (1-10) based on:
    a. Academic Eligibility (CGPA/Percentage checks).
    b. Keyword Alignment (matching inferred role keywords or explicit JD requirements).
    c. Experience Relevance (matching projects/work history to JD).
    d. Soft Skills Inference (communication, teamwork).
4. Provide a clear, concise justification for the final score.
5. Suggest an alternative or complementary job role based on the candidate's comprehensive skill set, even if they don't perfectly match the current JD.

**Resume:** [Candidate's resume text]
**Job Description:** [Job description text]"
```

## Demo Video Guide (2-3 Minutes)

A short, focused demo video is essential to showcase the application's value.

### Video Placeholder

[**Insert 2-3 Minute Demo Video Link Here**]

### Suggested Testing Procedures for Recording:

To demonstrate the intelligence of Hiralyze, ensure your demo covers these three scenarios:

1.  **Perfect Match & Shortlisting (0:00 - 1:00):**
    *   **JD:** Paste a job description for a "Full Stack Developer" (or "AI Engineer").
    *   **Resumes:** Upload a resume that clearly matches the required skills (e.g., `Kaushik_resume_8.pdf` for Full Stack/AI).
    *   **Expected Result:** Candidate appears in the **Shortlisted** tab with a high score (8-10/10) and a justification that highlights specific matching skills (e.g., React, FastAPI, PostgreSQL, Transformers).

2.  **Eligibility Failure & Not Shortlisted (1:00 - 2:00):**
    *   **JD:** Paste a job description that includes strict academic criteria (e.g., "UG min CGPA 9.0" and "zero experience candidates only").
    *   **Resumes:** Upload a resume that fails one of these criteria (e.g., `Vishakan_latest_August_resume.pdf` which has professional experience, or a resume with a CGPA below 9.0).
    *   **Expected Result:** Candidate appears in the **Not Shortlisted** tab with a low score (1/10) and a justification that explicitly states the failure reason (e.g., "Candidate has professional experience, but job requires zero experience" or "UG CGPA is below required 9.0").

3.  **Role Suggestion & Copy Feature (2:00 - 3:00):**
    *   **JD:** Paste a job description for a "Software Developer".
    *   **Resumes:** Upload a resume that is highly specialized in a different field, like `Resume Aravind.pdf` (Embedded Systems/ECE).
    *   **Expected Result:** Candidate appears in the **Shortlisted** or **Not Shortlisted** tab. Crucially, the **Suggested Role** field should correctly identify a different, relevant role (e.g., "Embedded Systems Engineer" or "IoT Engineer"), demonstrating the LLM's ability to analyze the candidate's full profile beyond the immediate JD.
    *   **Final Action:** Click the **Copy** button on the card to show the quick extraction of all candidate data.