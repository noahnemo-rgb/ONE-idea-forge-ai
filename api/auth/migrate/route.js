import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [countResult] = await sql`
      SELECT COUNT(*) as count 
      FROM ideas 
      WHERE user_id IS NULL
    `;

    return Response.json({
      exists: parseInt(countResult.count) > 0,
      count: parseInt(countResult.count),
    });
  } catch (error) {
    console.error("Check migration error:", error);
    return Response.json(
      { error: "Failed to check migration" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    const userEmail = session?.user?.email;

    if (!userEmail) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user ID
    const [user] = await sql`SELECT id FROM users WHERE email = ${userEmail}`;
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Claim ideas that have no user_id (anonymous ideas)
    const result = await sql`
      UPDATE ideas 
      SET user_id = ${user.id} 
      WHERE user_id IS NULL
    `;

    // Mark as asked in the database
    await sql`
      UPDATE users 
      SET has_asked_migration = TRUE 
      WHERE id = ${user.id}
    `;

    return Response.json({
      success: true,
      migratedCount: result.length,
    });
  } catch (error) {
    console.error("Migration error:", error);
    return Response.json({ error: "Failed to migrate data" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const session = await auth();
    const userEmail = session?.user?.email;

    if (!userEmail) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await sql`
      UPDATE users 
      SET has_asked_migration = TRUE 
      WHERE email = ${userEmail}
    `;

    return Response.json({ success: true });
  } catch (error) {
    console.error("Update migration status error:", error);
    return Response.json(
      { error: "Failed to update migration status" },
      { status: 500 },
    );
  }
}
