
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

interface ChatRequestBody {
  message: string;
  context: {
    students: any[];
    assignments: any[];
    lessons: any[];
  };
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders,
    });
  }

  try {
    // Get API key from environment variables
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    
    if (!OPENAI_API_KEY) {
      throw new Error('Missing OpenAI API key in environment variables');
    }

    // Parse request body
    const requestData: ChatRequestBody = await req.json();
    const { message, context } = requestData;

    if (!message) {
      throw new Error('No message provided');
    }

    console.log('Received message:', message);
    console.log('Context summary:', {
      studentsCount: context.students?.length || 0,
      assignmentsCount: context.assignments?.length || 0,
      lessonsCount: context.lessons?.length || 0,
    });

    // Check if context data is valid
    if (!context.students || !context.assignments || !context.lessons) {
      throw new Error('Invalid context data provided');
    }

    // Format the database context for better prompting
    const studentsContext = context.students.length > 0 
      ? `- ${context.students.length} students in total\n${context.students.slice(0, 5).map(s => `  - ${s.name}: Attendance ${s.attendance}%, Marks ${s.marks || 'Not available'}`).join('\n')}`
      : '- No students data available';

    const assignmentsContext = context.assignments.length > 0
      ? `- ${context.assignments.length} assignments in total\n${context.assignments.slice(0, 5).map(a => `  - ${a.title}: ${a.status}`).join('\n')}`
      : '- No assignments data available';

    const lessonsContext = context.lessons.length > 0
      ? `- ${context.lessons.length} lessons in total\n${context.lessons.map(l => `  - ${l.title}`).join('\n')}`
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
When making such inferences, be transparent about it. If you don't have enough information to answer a question, say so clearly.`;

    console.log('Calling OpenAI API...');

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
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const result = await response.json();
    console.log('OpenAI response received successfully');
    const aiResponse = result.choices[0].message.content;

    return new Response(
      JSON.stringify({
        response: aiResponse,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      },
    );
  } catch (error) {
    console.error('Error processing chat request:', error);

    return new Response(
      JSON.stringify({
        error: 'Error processing request',
        details: error.message,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      },
    );
  }
})
