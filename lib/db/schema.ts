import { pgTable, text, timestamp, uuid, varchar, boolean, integer, jsonb, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Enums
export const userRoleEnum = pgEnum('user_role', ['user', 'admin']);
export const subscriptionTierEnum = pgEnum('subscription_tier', ['free', 'creator', 'pro', 'agency', 'enterprise']);
export const subscriptionStatusEnum = pgEnum('subscription_status', ['active', 'canceled', 'past_due', 'trialing']);
export const paymentMethodEnum = pgEnum('payment_method', ['stripe', 'pesapal', 'mpesa']);
export const transactionStatusEnum = pgEnum('transaction_status', ['pending', 'completed', 'failed', 'refunded']);
export const contentTypeEnum = pgEnum('content_type', ['video', 'audio', 'text', 'podcast', 'webinar']);
export const outputTypeEnum = pgEnum('output_type', [
  'linkedin_post',
  'twitter_thread',
  'instagram_caption',
  'tiktok_script',
  'email_newsletter',
  'blog_article',
  'quote_card',
  'carousel',
]);

// Users table (Better Auth will manage this)
export const users = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  role: userRoleEnum('role').notNull().default('user'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

// Sessions table (Better Auth)
export const sessions = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: uuid('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
});

// Accounts table (for OAuth)
export const accounts = pgTable('account', {
  id: uuid('id').primaryKey().defaultRandom(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: uuid('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

// Verification tokens (for email verification, password reset)
export const verifications = pgTable('verification', {
  id: uuid('id').primaryKey().defaultRandom(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

// Subscriptions
export const subscriptions = pgTable('subscription', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  stripeCustomerId: text('stripeCustomerId').unique(),
  stripeSubscriptionId: text('stripeSubscriptionId').unique(),
  paymentMethod: paymentMethodEnum('paymentMethod').default('stripe'),
  tier: subscriptionTierEnum('tier').notNull().default('free'),
  status: subscriptionStatusEnum('status').notNull().default('active'),
  currentPeriodStart: timestamp('currentPeriodStart'),
  currentPeriodEnd: timestamp('currentPeriodEnd'),
  cancelAtPeriodEnd: boolean('cancelAtPeriodEnd').default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

// Transactions (for payment tracking)
export const transactions = pgTable('transaction', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  subscriptionId: uuid('subscriptionId').references(() => subscriptions.id, { onDelete: 'set null' }),
  paymentMethod: paymentMethodEnum('paymentMethod').notNull(),
  status: transactionStatusEnum('status').notNull().default('pending'),
  amount: integer('amount').notNull(), // Amount in cents/smallest currency unit
  currency: text('currency').notNull().default('USD'),
  tier: subscriptionTierEnum('tier').notNull(),

  // Payment gateway references
  stripePaymentIntentId: text('stripePaymentIntentId'),
  pesapalOrderTrackingId: text('pesapalOrderTrackingId'),
  pesapalMerchantReference: text('pesapalMerchantReference'),
  pesapalConfirmationCode: text('pesapalConfirmationCode'),
  mpesaCheckoutRequestId: text('mpesaCheckoutRequestId'),
  mpesaMerchantRequestId: text('mpesaMerchantRequestId'),
  mpesaReceiptNumber: text('mpesaReceiptNumber'),

  // Customer details
  customerEmail: text('customerEmail'),
  customerPhone: text('customerPhone'),
  customerName: text('customerName'),

  // Payment metadata
  metadata: jsonb('metadata'),
  errorMessage: text('errorMessage'),
  paidAt: timestamp('paidAt'),
  refundedAt: timestamp('refundedAt'),

  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

// Brand Profiles (for voice and style)
export const brands = pgTable('brand', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  voiceProfile: jsonb('voiceProfile'), // AI-analyzed voice characteristics
  visualIdentity: jsonb('visualIdentity'), // colors, fonts, logo
  industry: text('industry'),
  targetAudience: text('targetAudience'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

// Content Projects (uploaded content to be repurposed)
export const projects = pgTable('project', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  brandId: uuid('brandId').references(() => brands.id, { onDelete: 'set null' }),
  title: text('title').notNull(),
  description: text('description'),
  contentType: contentTypeEnum('contentType').notNull(),
  sourceUrl: text('sourceUrl'), // YouTube, Vimeo, etc.
  fileUrl: text('fileUrl'), // ImageKit URL
  fileSize: integer('fileSize'), // in bytes
  duration: integer('duration'), // in seconds (for video/audio)
  transcriptUrl: text('transcriptUrl'),
  transcriptText: text('transcriptText'),
  metadata: jsonb('metadata'), // any additional metadata
  processingStatus: text('processingStatus').notNull().default('pending'), // pending, processing, completed, failed
  processingError: text('processingError'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

// Generated Content Outputs
export const outputs = pgTable('output', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('projectId')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  userId: uuid('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  type: outputTypeEnum('type').notNull(),
  title: text('title'),
  content: text('content').notNull(),
  metadata: jsonb('metadata'), // hashtags, links, etc.
  publishedAt: timestamp('publishedAt'),
  scheduledFor: timestamp('scheduledFor'),
  analytics: jsonb('analytics'), // engagement metrics
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

// Teams (for collaboration)
export const teams = pgTable('team', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  ownerId: uuid('ownerId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

// Team Members
export const teamMembers = pgTable('team_member', {
  id: uuid('id').primaryKey().defaultRandom(),
  teamId: uuid('teamId')
    .notNull()
    .references(() => teams.id, { onDelete: 'cascade' }),
  userId: uuid('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  role: text('role').notNull().default('member'), // owner, admin, member
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
  subscription: one(subscriptions),
  transactions: many(transactions),
  brands: many(brands),
  projects: many(projects),
  outputs: many(outputs),
  ownedTeams: many(teams),
  teamMemberships: many(teamMembers),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one, many }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
  transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
  subscription: one(subscriptions, {
    fields: [transactions.subscriptionId],
    references: [subscriptions.id],
  }),
}));

export const brandsRelations = relations(brands, ({ one, many }) => ({
  user: one(users, {
    fields: [brands.userId],
    references: [users.id],
  }),
  projects: many(projects),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
  brand: one(brands, {
    fields: [projects.brandId],
    references: [brands.id],
  }),
  outputs: many(outputs),
}));

export const outputsRelations = relations(outputs, ({ one }) => ({
  project: one(projects, {
    fields: [outputs.projectId],
    references: [projects.id],
  }),
  user: one(users, {
    fields: [outputs.userId],
    references: [users.id],
  }),
}));

export const teamsRelations = relations(teams, ({ one, many }) => ({
  owner: one(users, {
    fields: [teams.ownerId],
    references: [users.id],
  }),
  members: many(teamMembers),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id],
  }),
  user: one(users, {
    fields: [teamMembers.userId],
    references: [users.id],
  }),
}));

// Zod Schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export const insertProjectSchema = createInsertSchema(projects);
export const selectProjectSchema = createSelectSchema(projects);

export const insertOutputSchema = createInsertSchema(outputs);
export const selectOutputSchema = createSelectSchema(outputs);

export const insertBrandSchema = createInsertSchema(brands);
export const selectBrandSchema = createSelectSchema(brands);

export const insertSubscriptionSchema = createInsertSchema(subscriptions);
export const selectSubscriptionSchema = createSelectSchema(subscriptions);

export const insertTransactionSchema = createInsertSchema(transactions);
export const selectTransactionSchema = createSelectSchema(transactions);

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

export type Output = typeof outputs.$inferSelect;
export type InsertOutput = typeof outputs.$inferInsert;

export type Brand = typeof brands.$inferSelect;
export type InsertBrand = typeof brands.$inferInsert;

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;

export type Team = typeof teams.$inferSelect;
export type InsertTeam = typeof teams.$inferInsert;
