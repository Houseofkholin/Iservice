import { pgTable, text, timestamp, boolean, integer, decimal, uniqueIndex } from "drizzle-orm/pg-core"

// Users table
export const users = pgTable("User", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { withTimezone: true }),
  password: text("password"),
  image: text("image"),
  location: text("location"),
  bio: text("bio"),
  walletAddress: text("walletAddress").unique(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
})

// NextAuth tables
export const accounts = pgTable("Account", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("providerAccountId").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
})

export const sessions = pgTable("Session", {
  id: text("id").primaryKey(),
  sessionToken: text("sessionToken").notNull().unique(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { withTimezone: true }).notNull(),
})

export const verificationTokens = pgTable(
  "VerificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { withTimezone: true }).notNull(),
  },
  (table) => {
    return {
      identifierToken: uniqueIndex("VerificationToken_identifier_token_key").on(table.identifier, table.token),
    }
  },
)

// Categories table
export const categories = pgTable("Category", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  icon: text("icon"),
  parentId: text("parentId").references(() => categories.id),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
})

// Services table
export const services = pgTable("Service", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  longDescription: text("longDescription"),
  price: decimal("price").notNull(),
  deliveryTime: text("deliveryTime").notNull(),
  revisions: text("revisions"),
  skills: text("skills").array(),
  requirements: text("requirements"),
  serviceType: text("serviceType"),
  location: text("location"),
  rating: decimal("rating").notNull().default("0"),
  status: text("status").notNull().default("ACTIVE"),
  blockchainId: text("blockchainId"),
  transactionHash: text("transactionHash"),
  providerId: text("providerId")
    .notNull()
    .references(() => users.id),
  categoryId: text("categoryId")
    .notNull()
    .references(() => categories.id),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
})

// Images table
export const images = pgTable("Image", {
  id: text("id").primaryKey(),
  url: text("url").notNull(),
  serviceId: text("serviceId")
    .notNull()
    .references(() => services.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
})

// Bids table
export const bids = pgTable("Bid", {
  id: text("id").primaryKey(),
  amount: decimal("amount").notNull(),
  message: text("message"),
  status: text("status").notNull().default("PENDING"),
  transactionHash: text("transactionHash"),
  serviceId: text("serviceId")
    .notNull()
    .references(() => services.id),
  userId: text("userId")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
})

// Contracts table
export const contracts = pgTable("Contract", {
  id: text("id").primaryKey(),
  status: text("status").notNull().default("ACTIVE"),
  startDate: timestamp("startDate", { withTimezone: true }).defaultNow().notNull(),
  endDate: timestamp("endDate", { withTimezone: true }),
  transactionHash: text("transactionHash"),
  serviceId: text("serviceId")
    .notNull()
    .references(() => services.id),
  providerId: text("providerId")
    .notNull()
    .references(() => users.id),
  clientId: text("clientId")
    .notNull()
    .references(() => users.id),
  bidId: text("bidId")
    .notNull()
    .unique()
    .references(() => bids.id),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
})

// Reviews table
export const reviews = pgTable("Review", {
  id: text("id").primaryKey(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  serviceId: text("serviceId")
    .notNull()
    .references(() => services.id),
  userId: text("userId")
    .notNull()
    .references(() => users.id),
  contractId: text("contractId").references(() => contracts.id),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
})

// Notifications table
export const notifications = pgTable("Notification", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(),
  isRead: boolean("isRead").notNull().default(false),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  relatedId: text("relatedId"),
  relatedType: text("relatedType"),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
})

// Messages table
export const messages = pgTable("Message", {
  id: text("id").primaryKey(),
  content: text("content").notNull(),
  senderId: text("senderId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  receiverId: text("receiverId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  conversationId: text("conversationId").notNull(),
  isRead: boolean("isRead").notNull().default(false),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
})

// Conversations table
export const conversations = pgTable("Conversation", {
  id: text("id").primaryKey(),
  lastMessageAt: timestamp("lastMessageAt", { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
})

// ConversationParticipants junction table
export const conversationParticipants = pgTable(
  "ConversationParticipant",
  {
    id: text("id").primaryKey(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    conversationId: text("conversationId")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => {
    return {
      userConversation: uniqueIndex("ConversationParticipant_userId_conversationId_key").on(
        table.userId,
        table.conversationId,
      ),
    }
  },
)

// Transactions table
export const transactions = pgTable("Transaction", {
  id: text("id").primaryKey(),
  amount: decimal("amount").notNull(),
  type: text("type").notNull(),
  status: text("status").notNull(),
  transactionHash: text("transactionHash"),
  userId: text("userId")
    .notNull()
    .references(() => users.id),
  contractId: text("contractId").references(() => contracts.id),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
})

