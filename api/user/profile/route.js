import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET() {
  try {
    const session = await auth();
    const userEmail = session?.user?.email;

    if (!userEmail) {
      return Response.json({ user: null });
    }

    let [user] = await sql`
      SELECT id, email, subscription_status, credits, last_credit_reset, has_asked_migration, stripe_customer_id, last_check_subscription_status_at 
      FROM users WHERE email = ${userEmail}
    `;

    if (!user) {
      [user] = await sql`
        INSERT INTO users (email, subscription_status, credits, last_credit_reset, has_asked_migration)
        VALUES (${userEmail}, 'free', 3, NOW(), FALSE)
        RETURNING id, email, subscription_status, credits, last_credit_reset, has_asked_migration, stripe_customer_id, last_check_subscription_status_at
      `;
    }

    // Reset daily credits if needed
    const now = new Date();
    const lastReset = new Date(user.last_credit_reset);
    if (now.toDateString() !== lastReset.toDateString()) {
      await sql`
        UPDATE users SET credits = 3, last_credit_reset = NOW() 
        WHERE id = ${user.id}
      `;
      user.credits = 3;
    }

    // Sync subscription status with Stripe if stale (older than 5 minutes)
    if (user.stripe_customer_id) {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const isStale =
        !user.last_check_subscription_status_at ||
        new Date(user.last_check_subscription_status_at) < fiveMinutesAgo;

      if (isStale) {
        try {
          const customer = await stripe.customers.retrieve(
            user.stripe_customer_id,
            {
              expand: ["subscriptions"],
            },
          );

          const activeSubscription = customer.subscriptions?.data.find(
            (sub) => sub.status === "active" || sub.status === "trialing",
          );

          const newStatus = activeSubscription ? "pro" : "free";

          if (newStatus !== user.subscription_status) {
            await sql`
              UPDATE users 
              SET subscription_status = ${newStatus}, 
                  last_check_subscription_status_at = NOW() 
              WHERE id = ${user.id}
            `;
            user.subscription_status = newStatus;
          } else {
            await sql`
              UPDATE users 
              SET last_check_subscription_status_at = NOW() 
              WHERE id = ${user.id}
            `;
          }
        } catch (error) {
          console.error("Error syncing Stripe status:", error);
          // Continue with existing status if Stripe check fails
        }
      }
    }

    return Response.json({ user });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    const userEmail = session?.user?.email;

    if (!userEmail) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subscription_status } = await request.json();

    if (!subscription_status) {
      return Response.json(
        { error: "subscription_status is required" },
        { status: 400 },
      );
    }

    const [updatedUser] = await sql`
      UPDATE users 
      SET subscription_status = ${subscription_status}
      WHERE email = ${userEmail}
      RETURNING id, email, subscription_status
    `;

    return Response.json({ user: updatedUser });
  } catch (error) {
    console.error("Profile update error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const session = await auth();
    const userEmail = session?.user?.email;

    if (!userEmail) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const token = url.searchParams.get("token");

    if (!token) {
      return Response.json({ error: "Token required" }, { status: 400 });
    }

    const [user] = await sql`
      SELECT id, delete_token, delete_token_expires 
      FROM users 
      WHERE email = ${userEmail}
    `;

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.delete_token || user.delete_token !== token) {
      return Response.json({ error: "Invalid token" }, { status: 403 });
    }

    if (new Date() > new Date(user.delete_token_expires)) {
      return Response.json({ error: "Token expired" }, { status: 403 });
    }

    await sql`
      DELETE FROM users WHERE id = ${user.id}
    `;

    return Response.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Account deletion error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
