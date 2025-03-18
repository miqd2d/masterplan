
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0'

// Create a custom error for handling cases when API key is not set
class ConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigurationError';
  }
}

interface ChatRequestBody {
  message: string;
  context: {
    students: any[];
    assignments: any[];
    lessons: any[];
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    // Get API key from environment variables
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    
    if (!OPENAI_API_KEY) {
      throw new ConfigurationError('Missing OpenAI API key in environment variables');
    }

    // Parse request body
    const requestData: ChatRequestBody = await req.json();
    const { message, context } = requestData;

    if (!message) {
      throw new Error('No message provided');
    }

    // Format the database context for better prompting
    const studentsContext = context.students.length > 0 
      ? `- ${context.students.length} students in total
${context.students.slice(0, 5).map(s => `  - ${s.name}: Attendance ${s.attendance}%, Marks ${s.marks || 'Not available'}`).join('\n')}`
      : '- No students data available';

    const assignmentsContext = context.assignments.length > 0
      ? `- ${context.assignments.length} assignments in total
${context.assignments.slice(0, 5).map(a => `  - ${a.title}: ${a.status}`).join('\n')}`
      : '- No assignments data available';

    const lessonsContext = context.lessons.length > 0
      ? `- ${context.lessons.length} lessons in total
${context.lessons.map(l => `  - ${l.title}`).join('\n')}`
      : '- No lessons data available';

    // Create the system prompt with database context
    const systemPrompt = `You are an AI teaching assistant for a learning platform called "Masterplan".
You have access to the following information about the user's teaching data:

STUDENTS:
${studentsContext}

ASSIGNMENTS:
${assignmentsContext}

LESSONS:
${lessonsContext}

Use this information to provide helpful insights and answer questions about the teacher's class data.
Be precise and helpful. If asked for statistics or data that isn't directly provided, you can make reasonable inferences based on the data you have.
When making such inferences, be transparent about it. If you don't have enough information to answer a question, say so.`;

    // Call OpenAI API for completion
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
        max_tokens: 1500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const result = await response.json();
    const aiResponse = result.choices[0].message.content;

    return new Response(
      JSON.stringify({
        response: aiResponse,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      },
    );
  } catch (error) {
    console.error('Error processing chat request:', error);

    // Different error handling based on error type
    if (error instanceof ConfigurationError) {
      return new Response(
        JSON.stringify({
          error: error.message,
          hint: 'Please set the OPENAI_API_KEY environment variable in your Supabase project.',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        },
      );
    }

    return new Response(
      JSON.stringify({
        error: 'Error processing request',
        details: error.message,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      },
    );
  }
})
