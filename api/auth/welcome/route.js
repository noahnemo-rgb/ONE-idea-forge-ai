export async function POST(req) {
  try {
    const { email, name } = await req.json();

    if (!email) {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error("RESEND_API_KEY is not set");
      return Response.json(
        { error: "Email service not configured" },
        { status: 500 },
      );
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "IdeaForge <welcome@ideaforge.ai>",
        to: [email],
        subject: "Welcome to IdeaForge! 🚀",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
            <h1 style="color: #6855FF;">Welcome to IdeaForge, ${name || "Builder"}!</h1>
            <p style="font-size: 16px; line-height: 1.6;">
              We're thrilled to have you on board. IdeaForge is designed to help you turn your sparks of inspiration into validated startup concepts.
            </p>
            <p style="font-size: 16px; line-height: 1.6;">
              Here's what you can do right now:
            </p>
            <ul style="font-size: 16px; line-height: 1.6;">
              <li><strong>Forge Ideas:</strong> Use our multi-model AI engine to generate detailed app specs.</li>
              <li><strong>Market Trends:</strong> Check out the latest trending niches on your dashboard.</li>
              <li><strong>Reverse Engineer:</strong> See how successful apps like Notion or Airbnb were built.</li>
            </ul>
            <div style="margin-top: 30px; padding: 20px; background-color: #f4f4f4; border-radius: 10px;">
              <p style="margin: 0; font-weight: bold;">Launch Special Reminder:</p>
              <p style="margin: 5px 0 0 0;">Get 50% off your first month of Pro with code <strong>LAUNCH50</strong>!</p>
            </div>
            <p style="margin-top: 30px; font-size: 14px; color: #777;">
              Happy building,<br>
              The IdeaForge Team
            </p>
          </div>
        `,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Resend API error:", data);
      return Response.json({ error: data }, { status: response.status });
    }

    return Response.json({ message: "Welcome email sent", data });
  } catch (err) {
    console.error("Welcome email failed:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
