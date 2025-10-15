import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { PDFDocument } from "https://deno.land/x/deno_pdf@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileBase64, fileName } = await req.json();

    if (!fileBase64) {
      return new Response(JSON.stringify({ error: 'No file content provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Decode Base64 to ArrayBuffer
    const binaryString = atob(fileBase64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const pdfDoc = await PDFDocument.load(bytes);
    let fullText = '';

    for (const page of pdfDoc.getPages()) {
      const text = await page.getTextContent();
      fullText += text.items.map(item => item.str).join(' ') + '\n';
    }

    return new Response(JSON.stringify({ fileName, content: fullText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error("Error parsing PDF:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});