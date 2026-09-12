import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const ideaId = searchParams.get("ideaId");

    if (!ideaId) {
      return Response.json({ error: "Missing ideaId" }, { status: 400 });
    }

    const comments = await sql`
      SELECT c.*, u.name as user_name, u.image as user_image
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.idea_id = ${ideaId}
      ORDER BY c.created_at ASC
    `;

    return Response.json({ comments });
  } catch (error) {
    console.error("Fetch comments error:", error);
    return Response.json(
      { error: "Failed to fetch comments" },
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

    const { ideaId, content } = await request.json();

    if (!ideaId || !content) {
      return Response.json(
        { error: "Missing ideaId or content" },
        { status: 400 },
      );
    }

    const [user] = await sql`SELECT id FROM users WHERE email = ${userEmail}`;
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const [newComment] = await sql`
      INSERT INTO comments (idea_id, user_id, content)
      VALUES (${ideaId}, ${user.id}, ${content})
      RETURNING *
    `;

    return Response.json({ comment: newComment });
  } catch (error) {
    console.error("Create comment error:", error);
    return Response.json(
      { error: "Failed to create comment" },
      { status: 500 },
    );
  }
}
