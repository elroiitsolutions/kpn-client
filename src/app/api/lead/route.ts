import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { name, phone, project, date, notes } = await req.json();

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    // Prepare WhatsApp direct link for the lead
    const message = encodeURIComponent(
      `*New Site Visit / Lead Inquiry from Website Chatbot*\n\n` +
      `👤 *Name*: ${name || 'Prospective Buyer'}\n` +
      `📞 *Phone*: ${phone}\n` +
      `🏢 *Project*: ${project || 'General Inquiry'}\n` +
      `📅 *Preferred Date*: ${date || 'Flexible'}\n` +
      `💬 *Notes*: ${notes || 'Requested assistance via AI Chatbot'}`
    );

    const whatsappUrl = `https://api.whatsapp.com/send?phone=918925924128&text=${message}`;

    console.log('[New Chatbot Lead Captured]:', { name, phone, project, date });

    return NextResponse.json({
      success: true,
      message: 'Thank you! Our property advisory team will call you shortly.',
      whatsappUrl,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to process lead' }, { status: 500 });
  }
}
