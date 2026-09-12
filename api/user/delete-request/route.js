import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";
import crypto from "crypto";

export async function POST() {
  try {
    const session = await auth();
    const userEmail = session?.user?.email;
    const userName = session?.user?.name;

    if (!userEmail) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Generate a unique token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Store token in database
    await sql`
      UPDATE users 
      SET delete_token = ${token}, delete_token_expires = ${expiresAt}
      WHERE email = ${userEmail}
    `;

    // Send confirmation email
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error("RESEND_API_KEY is not set");
      return Response.json(
        { error: "Email service not configured" },
        { status: 500 },
      );
    }

    const confirmUrl = `${process.env.APP_URL}/account/confirm-delete?token=${token}`;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "IdeaForge <security@ideaforge.ai>",
        to: [userEmail],
        subject: "Confirm Account Deletion - IdeaForge",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
            <h1 style="color: #EF4444;">Confirm Account Deletion</h1>
            <p style="font-size: 16px; line-height: 1.6;">
              Hi ${userName || "there"},
            </p>
            <p style="font-size: 16px; line-height: 1.6;">
              We received a request to delete your IdeaForge account. If you made this request, 
              please click the button below to confirm and permanently delete your account.
            </p>
            <div style="margin: 30px 0; text-align: center;">
              <a href="${confirmUrl}" style="background-color: #EF4444; color: white; padding: 15px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block;">
                Confirm Account Deletion
              </a>
            </div>
            <p style="font-size: 14px; line-height: 1.6; color: #666;">
              This link will expire in 24 hours. If you didn't request this deletion, 
              please ignore this email and your account will remain active.
            </p>
            <div style="margin-top: 30px; padding: 20px; background-color: #FEE2E2; border-radius: 10px; border-left: 4px solid #EF4444;">
              <p style="margin: 0; font-weight: bold; color: #991B1B;">Warning:</p>
              <p style="margin: 5px 0 0 0; color: #991B1B;">
                This action cannot be undone. All your ideas, collections, and data will be permanently deleted.
              </p>
            </div>
            <p style="margin-top: 30px; font-size: 14px; color: #777;">
              Best regards,<br>
              The IdeaForge Team
            </p>
          </div>
        `,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Resend API error:", data);
      return Response.json({ error: "Failed to send email" }, { status: 500 });
    }

    return Response.json({
      success: true,
      message: "Confirmation email sent",
    });
  } catch (err) {
    console.error("Delete request failed:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
