import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { extractText } from "https://deno.land/x/pdfjs@1.0.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client for auth (if needed, though not directly used in this function's core logic)
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
);

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Authenticate the request (optional, but good practice for protected functions)
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response('Unauthorized: Missing Authorization header', { status: 401, headers: corsHeaders });
  }
  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);

  if (authError || !user) {
    console.error('Authentication error:', authError?.message);
    return new Response('Unauthorized: Invalid or expired token', { status: 401, headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const resumeFile = formData.get('resume') as File;
    const jobDescription = formData.get('jobDescription') as string;

    if (!resumeFile || !jobDescription) {
      return new Response(JSON.stringify({ error: 'Missing resume file or job description' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 1. Extract text from PDF using deno-pdf
    const fileBuffer = await resumeFile.arrayBuffer();
    const pdfText = await extractText(fileBuffer);

    // 2. Construct a detailed prompt for the LLM
    const prompt = `
      You are an expert resume parser. Your task is to extract structured information from the provided resume text and job description.
      Return the extracted data in a JSON format that strictly adheres to the TypeScript interfaces provided below.
      If a field is not found, omit it or use an empty array/string as appropriate, but do not invent data.
      Infer the candidate's name and email from the resume.
      For skills, list all relevant technical and soft skills.
      For experience and education, extract title/degree, company/institution, start/end dates, and descriptions/GPA.
      For projects, extract title, description, and technologies used.
      Also, suggest a primary job role for the candidate based on their resume.

      TypeScript Interfaces:
      interface Candidate {
        id: string; // Generate a unique ID, e.g., "cand-123"
        name: string;
        email: string;
        phone?: string;
        linkedin?: string;
        github?: string;
        skills: string[];
        experience: ExperienceEntry[];
        education: EducationEntry[];
        projects?: ProjectEntry[];
        matchScore: number; // Placeholder, set to 0 initially
        justification: string; // Placeholder, set to "" initially
        resumeFileName: string;
        suggestedRole?: string;
        ugCgpa?: number;
      }

      interface ExperienceEntry {
        title: string;
        company: string;
        startDate: string;
        endDate: string; // Can be "Present"
        description: string[]; // Bullet points or summary
      }

      interface EducationEntry {
        degree: string;
        institution: string;
        startDate: string;
        endDate: string;
        gpa?: number; // CGPA/Percentage
      }

      interface ProjectEntry {
        title: string;
        description: string;
        technologies?: string[];
      }

      ---
      Resume Text:
      ${pdfText}

      ---
      Job Description:
      ${jobDescription}

      ---
      JSON Output:
    `;

    // 3. Make an API call to the LLM (e.g., OpenAI)
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: 'OPENAI_API_KEY not set in environment variables' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o', // Or 'gpt-3.5-turbo', 'gemini-pro', etc.
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: "json_object" }, // Request JSON output
        temperature: 0.2, // Keep it low for factual extraction
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error('OpenAI API error:', errorData);
      return new Response(JSON.stringify({ error: 'Failed to get response from LLM', details: errorData }), {
        status: openaiResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const openaiData = await openaiResponse.json();
    const llmOutput = openaiData.choices[0].message.content;

    // 4. Parse the LLM's JSON response
    let parsedCandidateData;
    try {
      parsedCandidateData = JSON.parse(llmOutput);
      // Generate a unique ID for the candidate
      parsedCandidateData.id = `cand-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      parsedCandidateData.resumeFileName = resumeFile.name;
      parsedCandidateData.matchScore = 0; // Initialize, will be computed on frontend
      parsedCandidateData.justification = ""; // Initialize, will be computed on frontend
    } catch (jsonError) {
      console.error('Failed to parse LLM JSON output:', llmOutput, jsonError);
      return new Response(JSON.stringify({ error: 'Failed to parse LLM output', details: llmOutput }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 5. Return the structured Candidate data
    return new Response(JSON.stringify(parsedCandidateData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Edge Function error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});