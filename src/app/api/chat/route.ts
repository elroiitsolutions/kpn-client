import { NextResponse } from 'next/server';
import { KPN_SYSTEM_PROMPT, generateLocalBotResponse } from '@/data/chatbotKnowledge';
import { projectsData } from '@/data/siteData';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages = [], userMessage = '' } = body;

    const latestText = (userMessage || (messages[messages.length - 1]?.content ?? '')).trim();
    const lower = latestText.toLowerCase();

    // 1. Instant Natural Greetings (Instant reply in <10ms without lag)
    const cleanGreeting = lower.replace(/[!?.,]/g, '').trim();
    const commonGreetings = [
      'hi', 'hello', 'hey', 'hii', 'hiii', 'helo', 'hello there', 'hi there',
      'good morning', 'good afternoon', 'good evening', 'namaste', 'vanakkam'
    ];

    if (commonGreetings.includes(cleanGreeting)) {
      return NextResponse.json({
        reply: `Hello! 👋 Welcome to **KPN Promoters**.\n\nHow can I help you today? Are you looking for **apartments**, **approved plots**, or would you like to **schedule a site visit**?`,
      });
    }

    // 2. Direct High-Precision Intercept for Cab / Taxi inquiries
    // Ensures 100% truthful answer without any AI hallucination or draft text
    if (
      lower.includes('cab') ||
      lower.includes('taxi') ||
      lower.includes('pickup') ||
      lower.includes('drop') ||
      lower.includes('transport') ||
      lower.includes('car facility')
    ) {
      return NextResponse.json(generateLocalBotResponse(latestText));
    }

    const apiKey = process.env.GEMINI_API_KEY || 'AQ.Ab8RN6KMsZhOLGbUQQXtr_16DPDN90ILexiXWv2bH6598tTlzw';
    const debugInfo: Record<string, any> = {};

    // 2. If Gemini API Key is configured, call Google Gemini with system_instruction
    if (apiKey && apiKey.trim() !== '') {
      try {
        const payload = {
          system_instruction: {
            parts: [{ text: KPN_SYSTEM_PROMPT }],
          },
          contents: [
            {
              role: 'user',
              parts: [{ text: latestText }],
            },
          ],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 600,
          },
        };

        // Ultra-fast responsive models (<1s response time)
        const models = ['gemini-3.1-flash-lite', 'gemini-3-flash-preview'];
        let geminiReply = '';

        for (const model of models) {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3500);

            const res = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                signal: controller.signal,
              }
            );

            clearTimeout(timeoutId);

            if (res.ok) {
              const data = await res.json();
              const parts = data.candidates?.[0]?.content?.parts || [];
              let text = parts.map((p: any) => p.text || '').join('\n').trim();

              if (text) {
                // Strip any draft or reasoning tags if emitted
                text = text
                  .replace(/^Draft Content\*{0,3}:\s*/gim, '')
                  .replace(/^\*{0,3}Draft:\*{0,3}\s*/gim, '')
                  .replace(/^Response:\s*/gim, '')
                  .trim();

                geminiReply = text;
                debugInfo[model] = { status: 200, length: text.length };
                break;
              }
            } else {
              const errBody = await res.text();
              debugInfo[model] = { status: res.status, error: errBody.slice(0, 200) };
              console.error(`[Chatbot] Gemini model ${model} HTTP ${res.status}:`, errBody);

              // If Quota Exceeded (429) or Forbidden (403), fail fast!
              // Don't wait for other models to timeout.
              if (res.status === 429 || res.status === 403 || res.status === 401) {
                break;
              }
            }
          } catch (err) {
            debugInfo[model] = { error: (err as any).message };
            console.warn(`[Chatbot] Model ${model} request failed or timed out:`, err);
          }
        }

        if (geminiReply) {
          // Detect if budget/apartment or plot was discussed to attach recommendations
          let recs: typeof projectsData = [];
          if (lower.includes('apartment') || lower.includes('flat') || lower.includes('bhk')) {
            recs = projectsData.filter((p) => p.type === 'Apartments').slice(0, 3);
          } else if (lower.includes('plot') || lower.includes('land')) {
            recs = projectsData.filter((p) => p.type === 'Plots').slice(0, 3);
          }

          return NextResponse.json({
            reply: geminiReply,
            recommendedProjects: recs.length > 0 ? recs : undefined,
            showLeadForm: lower.includes('price') || lower.includes('book') || lower.includes('visit') || lower.includes('contact'),
          });
        }
      } catch (geminiError) {
        console.warn('[Chatbot] Gemini API error, using smart fallback:', geminiError);
      }
    }

    // 3. High-speed smart knowledge engine fallback (Zero API cost)
    const localResult = generateLocalBotResponse(latestText);
    return NextResponse.json(localResult);
  } catch (error) {
    console.error('[Chatbot API Error]:', error);
    return NextResponse.json(
      {
        reply: 'Thank you for reaching out to KPN Promoters! Our customer advisor is ready to assist you. You can connect with us directly on WhatsApp at **+91 8925924128** or call us anytime.',
      },
      { status: 200 }
    );
  }
}
