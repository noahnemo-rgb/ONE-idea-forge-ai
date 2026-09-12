import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const session = await auth();
    const userEmail = session?.user?.email;

    if (!userEmail) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { returnUrl } = await request.json();

    // Get user from DB
    const [user] = await sql`
      SELECT id, email, stripe_customer_id FROM users WHERE email = ${userEmail}
    `;

    if (!user || !user.stripe_customer_id) {
      return Response.json(
        { error: "No active subscription found" },
        { status: 404 },
      );
    }

    // Create portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripe_customer_id,
      return_url: returnUrl || `${process.env.APP_URL}/settings`,
    });

    return Response.json({ url: portalSession.url });
  } catch (error) {
    console.error("Stripe portal error:", error);
    return Response.json(
      { error: "Failed to create portal session" },
      { status: 500 },
    );
  }
}
