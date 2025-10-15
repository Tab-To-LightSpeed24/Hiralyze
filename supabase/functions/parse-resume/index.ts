import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204, // No Content for successful preflight
      headers: corsHeaders
    });
  }

  try {
    const { fileBase64, fileName } = await req.json();

    if (!fileBase64 || !fileName) {
      return new Response(JSON.stringify({ error: 'File content and name must be provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const fileExtension = fileName.split('.').pop()?.toLowerCase();

    if (fileExtension === 'pdf' || fileExtension === 'doc' || fileExtension === 'docx') {
      // For now, return a placeholder for PDF/DOCX as direct parsing is problematic
      const placeholderContent = `[Content from ${fileName} - PDF/DOCX parsing is currently not supported directly in this Edge Function. Please use a .txt file or integrate a dedicated parsing service.]`;
      return new Response(JSON.stringify({ fileName, content: placeholderContent }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    } else if (fileExtension === 'txt') {
      // For text files, decode and return content
      const decodedContent = atob(fileBase64);
      return new Response(JSON.stringify({ fileName, content: decodedContent }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    } else {
      return new Response(JSON.stringify({ error: `Unsupported file type: ${fileExtension}. Only .pdf, .doc, .docx, and .txt are accepted.` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error("Error in Edge Function:", error.message);
    return new Response(JSON.stringify({ error: `Internal server error: ${error.message}` }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});