import { randomUUID } from "node:crypto";

function publicIdea(idea, users, votes, userId) {
  const owner = users.find((user) => user.id === idea.user_id);
  const ideaVotes = votes.filter((vote) => vote.idea_id === idea.id);
  return {
    ...idea,
    owner_email: owner?.email ?? null,
    user_name: owner?.name ?? owner?.email ?? "Partner",
    vote_count: ideaVotes.length,
    user_has_voted: userId ? ideaVotes.some((vote) => vote.user_id === userId) : false,
    is_shared: userId ? idea.user_id !== userId : false,
  };
}

export function createMemoryStore() {
  const users = [];
  const sessions = [];
  const ideas = [];
  const comments = [];
  const votes = [];
  const shares = [];
  const chats = [];

  return {
    async ready() {},
    async createUser({ email, name, passwordHash }) {
      const normalized = email.trim().toLowerCase();
      if (users.some((user) => user.email === normalized)) return null;
      const user = {
        id: randomUUID(),
        email: normalized,
        name: name?.trim() || normalized.split("@")[0],
        image: null,
        password_hash: passwordHash,
        subscription_status: "free",
        credits: 3,
        last_credit_reset: new Date().toISOString(),
        has_asked_migration: false,
        stripe_customer_id: null,
        last_check_subscription_status_at: null,
        created_at: new Date().toISOString(),
      };
      users.push(user);
      return user;
    },
    async findUserByEmail(email) {
      return users.find((user) => user.email === email.trim().toLowerCase()) ?? null;
    },
    async findUserById(id) {
      return users.find((user) => user.id === id) ?? null;
    },
    async saveSession({ tokenHash, userId, expiresAt }) {
      sessions.push({ token_hash: tokenHash, user_id: userId, expires_at: expiresAt });
    },
    async userForToken(tokenHash, now = new Date()) {
      const session = sessions.find((row) => row.token_hash === tokenHash);
      if (!session || new Date(session.expires_at) <= now) return null;
      return users.find((user) => user.id === session.user_id) ?? null;
    },
    async deleteSession(tokenHash) {
      const index = sessions.findIndex((row) => row.token_hash === tokenHash);
      if (index >= 0) sessions.splice(index, 1);
    },
    async refreshCredits(user, now = new Date()) {
      const last = new Date(user.last_credit_reset);
      if (last.toDateString() === now.toDateString()) return user;
      user.credits = 3;
      user.last_credit_reset = now.toISOString();
      return user;
    },
    async insertIdea(input) {
      const { id: _clientId, ...rest } = input;
      const idea = {
        id: randomUUID(),
        visibility: "private",
        is_favorite: false,
        created_at: new Date().toISOString(),
        problem_solved: null,
        unique_value_prop: null,
        monetization_strategies: null,
        technical_feasibility: null,
        market_validation_hints: null,
        ...rest,
      };
      ideas.push(idea);
      return idea;
    },
    async listIdeasForUser(user) {
      const mine = ideas.filter((idea) => idea.user_id === user.id);
      const sharedIds = shares
        .filter((share) => share.shared_with_email === user.email)
        .map((share) => share.idea_id);
      const shared = ideas.filter((idea) => sharedIds.includes(idea.id));
      const seen = new Set();
      return [...mine, ...shared]
        .filter((idea) => {
          if (seen.has(idea.id)) return false;
          seen.add(idea.id);
          return true;
        })
        .sort((a, b) => b.created_at.localeCompare(a.created_at))
        .map((idea) => publicIdea(idea, users, votes, user.id));
    },
    async listPublicIdeas() {
      return ideas
        .filter((idea) => idea.visibility === "public")
        .sort((a, b) => b.created_at.localeCompare(a.created_at))
        .map((idea) => publicIdea(idea, users, votes, null));
    },
    async findIdea(id) {
      return ideas.find((idea) => idea.id === id) ?? null;
    },
    async setVisibility(id, userId, visibility) {
      const idea = ideas.find((row) => row.id === id && row.user_id === userId);
      if (!idea) return null;
      idea.visibility = visibility;
      return idea;
    },
    async setFavorite(id, userId, isFavorite) {
      const idea = ideas.find((row) => row.id === id && row.user_id === userId);
      if (!idea) return null;
      idea.is_favorite = Boolean(isFavorite);
      return idea;
    },
    async shareIdea({ ideaId, sharedBy, email }) {
      const normalized = email.trim().toLowerCase();
      if (shares.some((share) => share.idea_id === ideaId && share.shared_with_email === normalized)) {
        return;
      }
      shares.push({
        id: randomUUID(),
        idea_id: ideaId,
        shared_by: sharedBy,
        shared_with_email: normalized,
        created_at: new Date().toISOString(),
      });
    },
    async listSharesBy(userId) {
      return shares
        .filter((share) => share.shared_by === userId)
        .map((share) => ({
          ...share,
          idea_title: ideas.find((idea) => idea.id === share.idea_id)?.title ?? "",
        }));
    },
    async addComment({ ideaId, userId, content }) {
      const comment = {
        id: randomUUID(),
        idea_id: ideaId,
        user_id: userId,
        content,
        created_at: new Date().toISOString(),
      };
      comments.push(comment);
      const user = users.find((row) => row.id === userId);
      return { ...comment, user_name: user?.name ?? "Partner", user_image: user?.image ?? null };
    },
    async listComments(ideaId) {
      return comments
        .filter((comment) => comment.idea_id === ideaId)
        .map((comment) => {
          const user = users.find((row) => row.id === comment.user_id);
          return { ...comment, user_name: user?.name ?? "Partner", user_image: user?.image ?? null };
        });
    },
    async toggleVote(ideaId, userId) {
      const index = votes.findIndex((vote) => vote.idea_id === ideaId && vote.user_id === userId);
      if (index >= 0) {
        votes.splice(index, 1);
        return false;
      }
      votes.push({ id: randomUUID(), idea_id: ideaId, user_id: userId, created_at: new Date().toISOString() });
      return true;
    },
    async addChat({ userId, ideaId, role, content }) {
      chats.push({
        id: randomUUID(),
        user_id: userId,
        idea_id: ideaId ?? null,
        role,
        content,
        created_at: new Date().toISOString(),
      });
    },
    async listChat(userId, ideaId) {
      return chats
        .filter((row) => row.user_id === userId && (ideaId ? row.idea_id === ideaId : true))
        .slice(-40);
    },
    async setStripeCustomer(userId, customerId) {
      const user = users.find((row) => row.id === userId);
      if (user) user.stripe_customer_id = customerId;
      return user ?? null;
    },
    async setSubscriptionByCustomer(customerId, status) {
      const user = users.find((row) => row.stripe_customer_id === customerId);
      if (!user) return null;
      user.subscription_status = status;
      user.last_check_subscription_status_at = new Date().toISOString();
      return user;
    },
    async spendCredit(user) {
      if (user.subscription_status === "pro" || user.subscription_status === "active") {
        return { ok: true, credits: "unlimited" };
      }
      await this.refreshCredits(user);
      if (user.credits <= 0) return { ok: false, credits: 0 };
      user.credits -= 1;
      return { ok: true, credits: user.credits };
    },
    async markMigrationAsked(userId) {
      const user = users.find((row) => row.id === userId);
      if (user) user.has_asked_migration = true;
    },
  };
}
