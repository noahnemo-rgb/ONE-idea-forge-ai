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

    const { priceId, redirectURL } = await request.json();

    // Get or create user from DB
    let [user] = await sql`
      SELECT id, email, stripe_customer_id FROM users WHERE email = ${userEmail}
    `;

    if (!user) {
      [user] = await sql`
        INSERT INTO users (email, subscription_status, credits, last_credit_reset)
        VALUES (${userEmail}, 'free', 3, NOW())
        RETURNING id, email, stripe_customer_id
      `;
    }

    let stripeCustomerId = user.stripe_customer_id;

    if (!stripeCustomerId) {
      // Create Stripe customer
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user.id,
          source: "ideaforge",
        },
      });
      stripeCustomerId = customer.id;

      // Update user with stripe_customer_id
      await sql`
        UPDATE users SET stripe_customer_id = ${stripeCustomerId} WHERE id = ${user.id}
      `;
    }

    // Define products/prices
    const products = {
      pro_monthly: {
        name: "IdeaForge Pro (Monthly)",
        amount: 1900, // $19.00
        interval: "month",
      },
      pro_yearly: {
        name: "IdeaForge Pro (Yearly)",
        amount: 19000, // $190.00
        interval: "year",
      },
    };

    const product = products[priceId] || products.pro_monthly;

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      customer_email: user.email,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
              description:
                "Unlimited idea generation, advanced features, and priority support",
            },
            unit_amount: product.amount,
            recurring: {
              interval: product.interval,
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${redirectURL || process.env.APP_URL}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: redirectURL || process.env.APP_URL,
      metadata: {
        userId: user.id,
        priceId: priceId,
      },
      subscription_data: {
        metadata: {
          userId: user.id,
        },
      },
    });

    return Response.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return Response.json(
      { error: "Failed to create checkout session" },
      { status: 500 },
    );
  }
}
