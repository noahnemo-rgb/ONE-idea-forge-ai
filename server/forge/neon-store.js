import { SCHEMA_STATEMENTS } from "./schema.js";

let schemaReady = false;

function rowIdea(row, extras = {}) {
  return {
    ...row,
    key_features: row.key_features ?? [],
    monetization_strategies: row.monetization_strategies ?? [],
    scores: row.scores ?? {},
    vote_count: Number(extras.vote_count ?? row.vote_count ?? 0),
    user_has_voted: Boolean(extras.user_has_voted ?? row.user_has_voted),
    is_shared: Boolean(extras.is_shared ?? row.is_shared),
  };
}

export function createNeonStore(sql) {
  return {
    async ready() {
      if (schemaReady) return;
      for (const statement of SCHEMA_STATEMENTS) {
        try {
          await sql.query(statement);
        } catch (error) {
          if (!statement.startsWith("CREATE EXTENSION")) throw error;
        }
      }
      schemaReady = true;
    },
    async createUser({ email, name, passwordHash }) {
      const rows = await sql.query(
        `INSERT INTO users (email, name, password_hash)
         VALUES ($1, $2, $3)
         ON CONFLICT (email) DO NOTHING
         RETURNING *`,
        [email.trim().toLowerCase(), name?.trim() || email.trim().split("@")[0], passwordHash],
      );
      return rows[0] ?? null;
    },
    async findUserByEmail(email) {
      const rows = await sql.query(`SELECT * FROM users WHERE email = $1`, [email.trim().toLowerCase()]);
      return rows[0] ?? null;
    },
    async findUserById(id) {
      const rows = await sql.query(`SELECT * FROM users WHERE id = $1`, [id]);
      return rows[0] ?? null;
    },
    async saveSession({ tokenHash, userId, expiresAt }) {
      await sql.query(
        `INSERT INTO sessions (token_hash, user_id, expires_at) VALUES ($1, $2, $3)`,
        [tokenHash, userId, expiresAt],
      );
    },
    async userForToken(tokenHash) {
      const rows = await sql.query(
        `SELECT u.* FROM sessions s
         JOIN users u ON u.id = s.user_id
         WHERE s.token_hash = $1 AND s.expires_at > NOW()`,
        [tokenHash],
      );
      return rows[0] ?? null;
    },
    async deleteSession(tokenHash) {
      await sql.query(`DELETE FROM sessions WHERE token_hash = $1`, [tokenHash]);
    },
    async refreshCredits(user) {
      const rows = await sql.query(
        `UPDATE users
         SET credits = 3, last_credit_reset = NOW()
         WHERE id = $1 AND last_credit_reset::date < CURRENT_DATE
         RETURNING *`,
        [user.id],
      );
      return rows[0] ?? user;
    },
    async insertIdea(input) {
      const rows = await sql.query(
        `INSERT INTO ideas (
           user_id, prompt, title, description, target_audience, problem_solved,
           unique_value_prop, key_features, monetization_strategies, technical_feasibility,
           market_validation_hints, scores, model_source, creative_mode, visibility
         ) VALUES (
           $1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9::jsonb,$10,$11,$12::jsonb,$13,$14,$15
         ) RETURNING *`,
        [
          input.user_id,
          input.prompt ?? null,
          input.title ?? "Untitled",
          input.description ?? "",
          input.target_audience ?? null,
          input.problem_solved ?? null,
          input.unique_value_prop ?? null,
          JSON.stringify(input.key_features ?? []),
          JSON.stringify(input.monetization_strategies ?? []),
          input.technical_feasibility ?? null,
          input.market_validation_hints ?? null,
          JSON.stringify(input.scores ?? {}),
          input.model_source ?? "ai-buffer",
          input.creative_mode ?? "balanced",
          input.visibility ?? "private",
        ],
      );
      return rows[0];
    },
    async listIdeasForUser(user) {
      const rows = await sql.query(
        `SELECT i.*,
                u_owner.email AS owner_email,
                COALESCE(u_owner.name, u_owner.email) AS user_name,
                (SELECT COUNT(*) FROM votes v WHERE v.idea_id = i.id) AS vote_count,
                EXISTS(SELECT 1 FROM votes v WHERE v.idea_id = i.id AND v.user_id = $1) AS user_has_voted,
                (i.user_id <> $1) AS is_shared
         FROM ideas i
         LEFT JOIN users u_owner ON u_owner.id = i.user_id
         WHERE i.user_id = $1
            OR EXISTS (
              SELECT 1 FROM shared_ideas si
              WHERE si.idea_id = i.id AND si.shared_with_email = $2
            )
         ORDER BY i.created_at DESC`,
        [user.id, user.email],
      );
      return rows.map((row) => rowIdea(row));
    },
    async listPublicIdeas() {
      const rows = await sql.query(
        `SELECT i.*,
                u_owner.email AS owner_email,
                COALESCE(u_owner.name, u_owner.email) AS user_name,
                (SELECT COUNT(*) FROM votes v WHERE v.idea_id = i.id) AS vote_count
         FROM ideas i
         LEFT JOIN users u_owner ON u_owner.id = i.user_id
         WHERE i.visibility = 'public'
         ORDER BY i.created_at DESC
         LIMIT 100`,
      );
      return rows.map((row) => rowIdea(row));
    },
    async findIdea(id) {
      const rows = await sql.query(`SELECT * FROM ideas WHERE id = $1`, [id]);
      return rows[0] ?? null;
    },
    async setVisibility(id, userId, visibility) {
      const rows = await sql.query(
        `UPDATE ideas SET visibility = $3 WHERE id = $1 AND user_id = $2 RETURNING *`,
        [id, userId, visibility],
      );
      return rows[0] ?? null;
    },
    async setFavorite(id, userId, isFavorite) {
      const rows = await sql.query(
        `UPDATE ideas SET is_favorite = $3 WHERE id = $1 AND user_id = $2 RETURNING *`,
        [id, userId, isFavorite],
      );
      return rows[0] ?? null;
    },
    async shareIdea({ ideaId, sharedBy, email }) {
      await sql.query(
        `INSERT INTO shared_ideas (idea_id, shared_by, shared_with_email)
         VALUES ($1, $2, $3)
         ON CONFLICT (idea_id, shared_with_email) DO NOTHING`,
        [ideaId, sharedBy, email.trim().toLowerCase()],
      );
    },
    async listSharesBy(userId) {
      return sql.query(
        `SELECT si.*, i.title AS idea_title
         FROM shared_ideas si
         JOIN ideas i ON i.id = si.idea_id
         WHERE si.shared_by = $1
         ORDER BY si.created_at DESC`,
        [userId],
      );
    },
    async addComment({ ideaId, userId, content }) {
      const rows = await sql.query(
        `INSERT INTO comments (idea_id, user_id, content)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [ideaId, userId, content],
      );
      const userRows = await sql.query(`SELECT name, image FROM users WHERE id = $1`, [userId]);
      return {
        ...rows[0],
        user_name: userRows[0]?.name ?? "Partner",
        user_image: userRows[0]?.image ?? null,
      };
    },
    async listComments(ideaId) {
      return sql.query(
        `SELECT c.*, u.name AS user_name, u.image AS user_image
         FROM comments c
         JOIN users u ON u.id = c.user_id
         WHERE c.idea_id = $1
         ORDER BY c.created_at ASC`,
        [ideaId],
      );
    },
    async toggleVote(ideaId, userId) {
      const existing = await sql.query(
        `SELECT id FROM votes WHERE idea_id = $1 AND user_id = $2`,
        [ideaId, userId],
      );
      if (existing[0]) {
        await sql.query(`DELETE FROM votes WHERE id = $1`, [existing[0].id]);
        return false;
      }
      await sql.query(`INSERT INTO votes (idea_id, user_id) VALUES ($1, $2)`, [ideaId, userId]);
      return true;
    },
    async addChat({ userId, ideaId, role, content }) {
      await sql.query(
        `INSERT INTO chat_messages (user_id, idea_id, role, content) VALUES ($1, $2, $3, $4)`,
        [userId, ideaId ?? null, role, content],
      );
    },
    async listChat(userId, ideaId) {
      const filter = ideaId ? "AND idea_id = $2" : "";
      const params = ideaId ? [userId, ideaId] : [userId];
      return sql.query(
        `SELECT role, content, created_at FROM (
           SELECT role, content, created_at FROM chat_messages
           WHERE user_id = $1 ${filter}
           ORDER BY created_at DESC
           LIMIT 40
         ) recent
         ORDER BY created_at ASC`,
        params,
      );
    },
    async setStripeCustomer(userId, customerId) {
      const rows = await sql.query(
        `UPDATE users SET stripe_customer_id = $2 WHERE id = $1 RETURNING *`,
        [userId, customerId],
      );
      return rows[0] ?? null;
    },
    async setSubscriptionByCustomer(customerId, status) {
      const rows = await sql.query(
        `UPDATE users
         SET subscription_status = $2, last_check_subscription_status_at = NOW()
         WHERE stripe_customer_id = $1
         RETURNING *`,
        [customerId, status],
      );
      return rows[0] ?? null;
    },
    async spendCredit(user) {
      if (user.subscription_status === "pro" || user.subscription_status === "active") {
        return { ok: true, credits: "unlimited" };
      }
      const refreshed = await this.refreshCredits(user);
      if (refreshed.credits <= 0) return { ok: false, credits: 0 };
      const rows = await sql.query(
        `UPDATE users SET credits = credits - 1 WHERE id = $1 AND credits > 0 RETURNING credits`,
        [user.id],
      );
      if (!rows[0]) return { ok: false, credits: 0 };
      user.credits = rows[0].credits;
      return { ok: true, credits: rows[0].credits };
    },
    async markMigrationAsked(userId) {
      await sql.query(`UPDATE users SET has_asked_migration = TRUE WHERE id = $1`, [userId]);
    },
  };
}

export async function openNeonStore() {
  if (!process.env.DATABASE_URL) return null;
  const { neon } = await import("@neondatabase/serverless");
  const sql = neon(process.env.DATABASE_URL);
  const store = createNeonStore(sql);
  await store.ready();
  return store;
}
