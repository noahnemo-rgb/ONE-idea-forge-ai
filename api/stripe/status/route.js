import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(request) {
  try {
    const session = await auth();
    const userEmail = session?.user?.email;

    if (!userEmail) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from DB
    const [user] = await sql`
      SELECT id, subscription_status, stripe_customer_id, last_check_subscription_status_at 
      FROM users WHERE email = ${userEmail}
    `;

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const {
      subscription_status,
      stripe_customer_id,
      last_check_subscription_status_at,
    } = user;

    // Check if status is stale (older than 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const isStale =
      !last_check_subscription_status_at ||
      new Date(last_check_subscription_status_at) < fiveMinutesAgo;

    // If user has a Stripe customer ID and status is stale, check with Stripe
    if (stripe_customer_id && isStale) {
      const customer = await stripe.customers.retrieve(stripe_customer_id, {
        expand: ["subscriptions"],
      });

      const activeSubscription = customer.subscriptions?.data.find(
        (sub) => sub.status === "active" || sub.status === "trialing",
      );

      const newStatus = activeSubscription ? "pro" : "free";

      // Update database with fresh status
      await sql`
        UPDATE users 
        SET subscription_status = ${newStatus}, 
            last_check_subscription_status_at = NOW() 
        WHERE id = ${user.id}
      `;

      return Response.json({
        status: newStatus,
        subscription: activeSubscription
          ? {
              id: activeSubscription.id,
              current_period_end: activeSubscription.current_period_end,
              cancel_at_period_end: activeSubscription.cancel_at_period_end,
            }
          : null,
      });
    }

    return Response.json({ status: subscription_status || "free" });
  } catch (error) {
    console.error("Stripe status error:", error);
    return Response.json(
      { error: "Failed to check subscription status" },
      { status: 500 },
    );
  }
}
