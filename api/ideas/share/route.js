import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const session = await auth();
    const userEmail = session?.user?.email;

    if (!userEmail) {
      return Response.json({ shares: [] });
    }

    const shares = await sql`
      SELECT si.*, i.title as idea_title
      FROM shared_ideas si
      JOIN ideas i ON si.idea_id = i.id
      JOIN users u ON si.shared_by = u.id
      WHERE u.email = ${userEmail}
      ORDER BY si.created_at DESC
    `;

    return Response.json({ shares });
  } catch (error) {
    console.error("Fetch shares error:", error);
    return Response.json({ error: "Failed to fetch shares" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    const userEmail = session?.user?.email;

    if (!userEmail) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { ideaId, shareWithEmail } = await request.json();

    if (!ideaId || !shareWithEmail) {
      return Response.json(
        { error: "Missing ideaId or shareWithEmail" },
        { status: 400 },
      );
    }

    // 1. Get the current user's ID
    const [user] = await sql`SELECT id FROM users WHERE email = ${userEmail}`;
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // 2. Verify the user owns the idea
    const [idea] =
      await sql`SELECT id FROM ideas WHERE id = ${ideaId} AND user_id = ${user.id}`;
    if (!idea) {
      return Response.json(
        { error: "Idea not found or unauthorized" },
        { status: 403 },
      );
    }

    // 3. Create the share record
    await sql`
      INSERT INTO shared_ideas (idea_id, shared_by, shared_with_email)
      VALUES (${ideaId}, ${user.id}, ${shareWithEmail})
      ON CONFLICT DO NOTHING
    `;

    // Optional: Send an email notification here if Resend is configured
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "IdeaForge <sharing@ideaforge.ai>",
            to: [shareWithEmail],
            subject: "An app idea has been shared with you! 🚀",
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
                <h1 style="color: #6855FF;">New Idea Shared!</h1>
                <p style="font-size: 16px; line-height: 1.6;">
                  ${userEmail} has shared an AI-generated app idea with you on IdeaForge.
                </p>
                <p style="font-size: 16px; line-height: 1.6;">
                  Log in to your account to view the full spec and start building!
                </p>
                <a href="${process.env.APP_URL}/history" style="display: inline-block; background-color: #6855FF; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 20px;">View Shared Idea</a>
              </div>
            `,
          }),
        });
      } catch (emailErr) {
        console.error("Failed to send share email:", emailErr);
      }
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Share idea error:", error);
    return Response.json({ error: "Failed to share idea" }, { status: 500 });
  }
}
