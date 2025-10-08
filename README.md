# Hiralyze

Hiralyze is an intelligent resume parsing and matching application designed to streamline the candidate screening process. It intelligently parses resumes, extracts key skills and experience, and matches them against job descriptions using a Large Language Model (LLM) to provide a compatibility score and justification.

## Scope of Work

*   **Input**: Accepts PDF/Text resumes and a job description.
*   **Data Extraction**: Extracts structured data such as skills, experience, and education from resumes.
*   **LLM Matching**: Utilizes an LLM to compute a match score between candidates and job descriptions.
*   **Candidate Shortlisting**: Displays shortlisted candidates with a clear justification for their fit.

## Architecture Overview (Frontend Focus)

This repository contains the frontend application built with React and TypeScript, styled with Tailwind CSS and utilizing `shadcn/ui` components.

*   **`src/pages/Index.tsx`**: The main dashboard where users interact with the application.
*   **`src/components/ResumeUploadForm.tsx`**: Handles resume file uploads and job description input.
*   **`src/components/CandidateCard.tsx`**: Displays individual candidate details and match information.
*   **`src/components/CandidateList.tsx`**: Manages and renders the collection of `CandidateCard` components.
*   **`src/types/index.ts`**: Defines TypeScript interfaces for data structures like `Candidate` and `JobDescription`.

**Backend & Database (To be implemented separately):**
The frontend is designed to interact with a backend API for:
*   Receiving resume files and job descriptions.
*   Sending these inputs to an LLM for processing.
*   Storing parsed resume data in a database.
*   Retrieving processed candidate data (extracted skills, match scores, justifications) for display.

## LLM Usage Guidance

The backend LLM should perform semantic matching and scoring.

**Example Prompt:**
"Compare the following resume with this job description and rate fit on 1–10 with justification.
**Resume:** [Candidate's resume text]
**Job Description:** [Job description text]"

## Deliverables

*   GitHub repository with commits (this project).
*   README with architecture & LLM prompts (this file).