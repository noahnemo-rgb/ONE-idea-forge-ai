import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const session = await auth();
    const userEmail = session?.user?.email;
    const { searchParams } = new URL(request.url);
    const sharedOnly = searchParams.get("shared") === "true";
    const favoritesOnly = searchParams.get("favorites") === "true";
    const collectionsOnly = searchParams.get("collections") === "true";

    if (!userEmail) {
      return Response.json({ ideas: [], collections: [] });
    }

    if (collectionsOnly) {
      const collections = await sql`
        SELECT c.*, COUNT(ci.idea_id) as idea_count
        FROM collections c
        LEFT JOIN collection_ideas ci ON c.id = ci.collection_id
        JOIN users u ON c.user_id = u.id
        WHERE u.email = ${userEmail}
        GROUP BY c.id
        ORDER BY c.created_at DESC
      `;
      return Response.json({ collections });
    }

    // Fetch ideas owned by the user OR shared with the user
    // Added vote_count and user_has_voted
    let query = sql`
      SELECT i.*, 
             CASE WHEN i.user_id = u.id THEN false ELSE true END as is_shared,
             u_owner.email as owner_email,
             (SELECT COUNT(*) FROM votes v WHERE v.idea_id = i.id) as vote_count,
             EXISTS(SELECT 1 FROM votes v JOIN users uv ON v.user_id = uv.id WHERE v.idea_id = i.id AND uv.email = ${userEmail}) as user_has_voted
      FROM ideas i
      JOIN users u ON u.email = ${userEmail}
      LEFT JOIN users u_owner ON i.user_id = u_owner.id
      LEFT JOIN shared_ideas si ON i.id = si.idea_id AND si.shared_with_email = ${userEmail}
      WHERE (i.user_id = u.id OR si.shared_with_email = ${userEmail})
    `;

    if (sharedOnly) {
      query = sql`
        SELECT i.*, true as is_shared, u_owner.email as owner_email,
               (SELECT COUNT(*) FROM votes v WHERE v.idea_id = i.id) as vote_count,
               EXISTS(SELECT 1 FROM votes v JOIN users uv ON v.user_id = uv.id WHERE v.idea_id = i.id AND uv.email = ${userEmail}) as user_has_voted
        FROM ideas i
        JOIN shared_ideas si ON i.id = si.idea_id
        LEFT JOIN users u_owner ON i.user_id = u_owner.id
        WHERE si.shared_with_email = ${userEmail}
      `;
    } else if (favoritesOnly) {
      query = sql`
        SELECT i.*, false as is_shared, u_owner.email as owner_email,
               (SELECT COUNT(*) FROM votes v WHERE v.idea_id = i.id) as vote_count,
               EXISTS(SELECT 1 FROM votes v JOIN users uv ON v.user_id = uv.id WHERE v.idea_id = i.id AND uv.email = ${userEmail}) as user_has_voted
        FROM ideas i
        JOIN users u ON u.email = ${userEmail}
        LEFT JOIN users u_owner ON i.user_id = u_owner.id
        WHERE i.user_id = u.id AND i.is_favorite = true
      `;
    }

    const ideas = await sql`${query} ORDER BY created_at DESC`;

    return Response.json({ ideas });
  } catch (error) {
    console.error("Fetch ideas error:", error);
    return Response.json({ error: "Failed to fetch ideas" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    const userEmail = session?.user?.email;
    const body = await request.json();

    if (!userEmail) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [user] = await sql`SELECT id FROM users WHERE email = ${userEmail}`;
    if (!user)
      return Response.json({ error: "User not found" }, { status: 404 });

    if (body.action === "create_collection") {
      const [collection] = await sql`
        INSERT INTO collections (user_id, name)
        VALUES (${user.id}, ${body.name})
        RETURNING *
      `;
      return Response.json({ collection });
    }

    if (body.action === "vote") {
      const { ideaId } = body;
      if (!ideaId)
        return Response.json({ error: "Missing ideaId" }, { status: 400 });

      // Toggle vote
      const [existingVote] = await sql`
        SELECT id FROM votes WHERE idea_id = ${ideaId} AND user_id = ${user.id}
      `;

      if (existingVote) {
        await sql`DELETE FROM votes WHERE id = ${existingVote.id}`;
        return Response.json({ success: true, voted: false });
      } else {
        await sql`
          INSERT INTO votes (idea_id, user_id)
          VALUES (${ideaId}, ${user.id})
        `;
        return Response.json({ success: true, voted: true });
      }
    }

    return Response.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("POST ideas error:", error);
    return Response.json(
      { error: "Failed to process request" },
      { status: 500 },
    );
  }
}

export async function PATCH(request) {
  try {
    const session = await auth();
    const userEmail = session?.user?.email;
    const { id, is_favorite } = await request.json();

    if (!id || !userEmail) {
      return Response.json({ error: "Missing ID or User" }, { status: 400 });
    }

    await sql`
      UPDATE ideas 
      SET is_favorite = ${is_favorite} 
      WHERE id = ${id} AND user_id = (SELECT id FROM users WHERE email = ${userEmail})
    `;

    return Response.json({ success: true });
  } catch (error) {
    console.error("Update idea error:", error);
    return Response.json({ error: "Failed to update idea" }, { status: 500 });
  }
}
