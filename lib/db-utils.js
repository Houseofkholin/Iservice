import { nanoid } from "nanoid"
import { eq, and, or, like, desc, asc, between } from "drizzle-orm"
import { db } from "./db-client"
import * as schema from "./schema"
import { hash, compare } from "bcryptjs"

// User functions
export async function findUserByEmail(email) {
  const results = await db.select().from(schema.users).where(eq(schema.users.email, email))
  return results.length > 0 ? results[0] : null
}

export async function createUser(data) {
  const hashedPassword = await hash(data.password, 10)

  const user = {
    id: `user_${nanoid()}`,
    name: data.name,
    email: data.email,
    password: hashedPassword,
    image: data.image || `/placeholder.svg?height=80&width=80&text=${data.name.charAt(0)}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  await db.insert(schema.users).values(user)

  // Return user without password
  const { password, ...userWithoutPassword } = user
  return userWithoutPassword
}

export async function validateUserCredentials(email, password) {
  const user = await findUserByEmail(email)

  if (!user || !user.password) {
    return null
  }

  const isPasswordValid = await compare(password, user.password)

  if (!isPasswordValid) {
    return null
  }

  // Return user without password
  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}

// Category functions
export async function findCategories() {
  return db.select().from(schema.categories)
}

export async function findCategoryById(id) {
  const results = await db.select().from(schema.categories).where(eq(schema.categories.id, id))
  return results.length > 0 ? results[0] : null
}

export async function createCategory(data) {
  const category = {
    id: `category_${nanoid()}`,
    name: data.name,
    slug: data.slug,
    description: data.description,
    icon: data.icon,
    parentId: data.parentId,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  await db.insert(schema.categories).values(category)
  return category
}

// Service functions
export async function findServices(filters = {}) {
  let query = db
    .select({
      service: schema.services,
      provider: schema.users,
      category: schema.categories,
    })
    .from(schema.services)
    .leftJoin(schema.users, eq(schema.services.providerId, schema.users.id))
    .leftJoin(schema.categories, eq(schema.services.categoryId, schema.categories.id))

  // Apply filters
  const whereConditions = []

  if (filters.category) {
    whereConditions.push(eq(schema.categories.slug, filters.category))
  }

  if (filters.search) {
    whereConditions.push(
      or(like(schema.services.title, `%${filters.search}%`), like(schema.services.description, `%${filters.search}%`)),
    )
  }

  if (filters.min !== undefined || filters.max !== undefined) {
    if (filters.min !== undefined && filters.max !== undefined) {
      whereConditions.push(between(schema.services.price, filters.min, filters.max))
    } else if (filters.min !== undefined) {
      whereConditions.push(schema.services.price >= filters.min)
    } else if (filters.max !== undefined) {
      whereConditions.push(schema.services.price <= filters.max)
    }
  }

  if (filters.status) {
    whereConditions.push(eq(schema.services.status, filters.status))
  }

  if (whereConditions.length > 0) {
    query = query.where(and(...whereConditions))
  }

  // Apply sorting
  if (filters.sort) {
    switch (filters.sort) {
      case "price-low":
        query = query.orderBy(asc(schema.services.price))
        break
      case "price-high":
        query = query.orderBy(desc(schema.services.price))
        break
      case "newest":
        query = query.orderBy(desc(schema.services.createdAt))
        break
      case "oldest":
        query = query.orderBy(asc(schema.services.createdAt))
        break
      case "rating":
        query = query.orderBy(desc(schema.services.rating))
        break
      default:
        query = query.orderBy(desc(schema.services.createdAt))
    }
  } else {
    // Default sort by newest
    query = query.orderBy(desc(schema.services.createdAt))
  }

  const results = await query

  // Get images for each service
  const servicesWithImages = await Promise.all(
    results.map(async (result) => {
      const serviceImages = await db.select().from(schema.images).where(eq(schema.images.serviceId, result.service.id))

      const bids = await db.select().from(schema.bids).where(eq(schema.bids.serviceId, result.service.id))

      return {
        ...result.service,
        provider: {
          id: result.provider?.id,
          name: result.provider?.name,
          image: result.provider?.image,
          location: result.provider?.location,
        },
        category: result.category?.name,
        images: serviceImages.map((img) => img.url),
        bidCount: bids.length,
      }
    }),
  )

  return servicesWithImages
}

export async function findServiceById(id) {
  const results = await db
    .select({
      service: schema.services,
      provider: schema.users,
      category: schema.categories,
    })
    .from(schema.services)
    .leftJoin(schema.users, eq(schema.services.providerId, schema.users.id))
    .leftJoin(schema.categories, eq(schema.services.categoryId, schema.categories.id))
    .where(eq(schema.services.id, id))

  if (results.length === 0) {
    return null
  }

  const result = results[0]

  // Get images for the service
  const serviceImages = await db.select().from(schema.images).where(eq(schema.images.serviceId, id))

  // Get bids for the service
  const serviceBids = await db
    .select({
      bid: schema.bids,
      user: schema.users,
    })
    .from(schema.bids)
    .leftJoin(schema.users, eq(schema.bids.userId, schema.users.id))
    .where(eq(schema.bids.serviceId, id))

  // Format bids with provider info
  const formattedBids = serviceBids.map(({ bid, user }) => ({
    id: bid.id,
    amount: bid.amount,
    message: bid.message,
    status: bid.status,
    createdAt: bid.createdAt,
    provider: {
      id: user?.id,
      name: user?.name,
      avatar: user?.image,
      rating: 4.8, // This would come from reviews in a real app
      completedJobs: 10, // This would be calculated in a real app
    },
  }))

  return {
    id: result.service.id,
    title: result.service.title,
    category: result.category?.name,
    description: result.service.description,
    longDescription: result.service.longDescription,
    price: result.service.price,
    deliveryTime: result.service.deliveryTime,
    status: result.service.status,
    client: {
      id: result.provider?.id,
      name: result.provider?.name,
      avatar: result.provider?.image,
      location: result.provider?.location,
      memberSince: result.provider?.createdAt
        ? new Date(result.provider.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
        : "Unknown",
    },
    images: serviceImages.map((img) => img.url),
    bids: formattedBids,
    createdAt: result.service.createdAt,
    updatedAt: result.service.updatedAt,
  }
}

export async function createService(data) {
  const serviceId = `service_${nanoid()}`

  // Create the service
  await db.insert(schema.services).values({
    id: serviceId,
    title: data.title,
    description: data.description,
    longDescription: data.longDescription,
    price: data.price,
    deliveryTime: data.deliveryTime,
    providerId: data.providerId,
    categoryId: data.categoryId,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  // Add images if provided
  if (data.images && data.images.length > 0) {
    const imageValues = data.images.map((url) => ({
      id: `image_${nanoid()}`,
      url,
      serviceId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))

    await db.insert(schema.images).values(imageValues)
  }

  return { id: serviceId }
}

// Bid functions
export async function createBid(data) {
  const bid = {
    id: `bid_${nanoid()}`,
    amount: data.amount,
    message: data.message,
    status: "PENDING",
    serviceId: data.serviceId,
    userId: data.userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  await db.insert(schema.bids).values(bid)
  return bid
}

// Notification functions
export async function createNotification(data) {
  const notification = {
    id: `notification_${nanoid()}`,
    title: data.title,
    message: data.message,
    type: data.type,
    isRead: false,
    userId: data.userId,
    relatedId: data.relatedId,
    relatedType: data.relatedType,
    createdAt: new Date(),
  }

  await db.insert(schema.notifications).values(notification)
  return notification
}

export async function getUserNotifications(userId) {
  return db
    .select()
    .from(schema.notifications)
    .where(eq(schema.notifications.userId, userId))
    .orderBy(desc(schema.notifications.createdAt))
}

export async function markNotificationAsRead(id) {
  await db.update(schema.notifications).set({ isRead: true }).where(eq(schema.notifications.id, id))
}

export async function markAllNotificationsAsRead(userId) {
  await db.update(schema.notifications).set({ isRead: true }).where(eq(schema.notifications.userId, userId))
}

