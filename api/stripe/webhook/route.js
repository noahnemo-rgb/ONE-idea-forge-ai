import sql from "@/app/api/utils/sql";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return Response.json(
      { error: "Webhook signature verification failed" },
      { status: 400 },
    );
  }

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionUpdate(event.data.object);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object);
        break;

      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object);
        break;

      case "invoice.payment_succeeded":
        await handlePaymentSucceeded(event.data.object);
        break;

      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return Response.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}

async function handleSubscriptionUpdate(subscription) {
  const customerId = subscription.customer;
  const status = subscription.status;

  // Map Stripe status to our status
  const subscriptionStatus =
    status === "active" || status === "trialing" ? "pro" : "free";

  // Update user in database
  const result = await sql`
    UPDATE users 
    SET subscription_status = ${subscriptionStatus},
        last_check_subscription_status_at = NOW()
    WHERE stripe_customer_id = ${customerId}
    RETURNING id, email
  `;

  if (result.length > 0) {
    console.log(
      `Updated subscription for user ${result[0].email} to ${subscriptionStatus}`,
    );
  } else {
    console.warn(`No user found for Stripe customer ${customerId}`);
  }
}

async function handleSubscriptionDeleted(subscription) {
  const customerId = subscription.customer;

  const result = await sql`
    UPDATE users 
    SET subscription_status = 'free',
        last_check_subscription_status_at = NOW()
    WHERE stripe_customer_id = ${customerId}
    RETURNING id, email
  `;

  if (result.length > 0) {
    console.log(`Subscription deleted for user ${result[0].email}`);
  }
}

async function handleCheckoutCompleted(session) {
  const customerId = session.customer;
  const customerEmail = session.customer_email;

  // If user doesn't have stripe_customer_id yet, update it
  if (customerEmail) {
    await sql`
      UPDATE users 
      SET stripe_customer_id = ${customerId}
      WHERE email = ${customerEmail} AND stripe_customer_id IS NULL
    `;
  }
}

async function handlePaymentSucceeded(invoice) {
  const customerId = invoice.customer;

  // Ensure subscription is active
  await sql`
    UPDATE users 
    SET subscription_status = 'pro',
        last_check_subscription_status_at = NOW()
    WHERE stripe_customer_id = ${customerId}
  `;
}

async function handlePaymentFailed(invoice) {
  const customerId = invoice.customer;

  console.warn(`Payment failed for customer ${customerId}`);

  // Optionally notify user or take action
  // For now, we'll let Stripe's retry logic handle it
}
