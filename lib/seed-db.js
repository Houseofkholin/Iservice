import { nanoid } from "nanoid"
import { hash } from "bcryptjs"
import { db } from "./db-client"
import * as schema from "./schema"

export async function seedDatabase() {
  // Check if database is already seeded
  const existingCategories = await db.select().from(schema.categories)
  if (existingCategories.length > 0) {
    console.log("Database already seeded")
    return
  }

  console.log("Seeding database...")

  // Seed users
  const users = [
    {
      id: `user_${nanoid()}`,
      name: "John Doe",
      email: "john@example.com",
      password: await hash("password123", 10),
      image: "/placeholder.svg?height=80&width=80&text=JD",
      location: "New York, NY",
      bio: "Experienced web developer specializing in React and blockchain technologies.",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: `user_${nanoid()}`,
      name: "Jane Smith",
      email: "jane@example.com",
      password: await hash("password123", 10),
      image: "/placeholder.svg?height=80&width=80&text=JS",
      location: "San Francisco, CA",
      bio: "UI/UX designer with a passion for creating beautiful and functional interfaces.",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  await db.insert(schema.users).values(users)
  console.log("Seeded users")

  // Seed categories
  const categories = [
    {
      id: `category_${nanoid()}`,
      name: "Creative & Design",
      slug: "creative-design",
      description: "Find creative professionals to bring your ideas to life.",
      icon: "Paintbrush",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: `category_${nanoid()}`,
      name: "Home Services",
      slug: "home-services",
      description: "Get help with home maintenance, cleaning, and repairs.",
      icon: "Home",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: `category_${nanoid()}`,
      name: "Digital Services",
      slug: "digital-services",
      description: "Find experts in web development, digital marketing, and more.",
      icon: "Globe",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: `category_${nanoid()}`,
      name: "Delivery & Moving",
      slug: "delivery-moving",
      description: "Get help with deliveries, moving, and transportation.",
      icon: "Truck",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: `category_${nanoid()}`,
      name: "Food & Cooking",
      slug: "food-cooking",
      description: "Find personal chefs, caterers, and meal prep services.",
      icon: "Utensils",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: `category_${nanoid()}`,
      name: "Education",
      slug: "education",
      description: "Find tutors, teachers, and educational services.",
      icon: "Book",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  await db.insert(schema.categories).values(categories)
  console.log("Seeded categories")

  // Seed services
  const digitalServicesCategory = categories.find((c) => c.slug === "digital-services")
  const homeServicesCategory = categories.find((c) => c.slug === "home-services")
  const foodCookingCategory = categories.find((c) => c.slug === "food-cooking")
  const educationCategory = categories.find((c) => c.slug === "education")
  const deliveryMovingCategory = categories.find((c) => c.slug === "delivery-moving")

  if (
    !digitalServicesCategory ||
    !homeServicesCategory ||
    !foodCookingCategory ||
    !educationCategory ||
    !deliveryMovingCategory
  ) {
    console.error("Categories not found")
    return
  }

  const services = [
    {
      id: `service_${nanoid()}`,
      title: "Website Development for Small Business",
      description:
        "Looking for a developer to create a responsive, modern website with clean code and SEO optimization for my small business.",
      longDescription: `
        <p>I need a professional website for my small bakery business. I want a modern, responsive design that works well on mobile devices and helps me attract local customers.</p>
        
        <p>Requirements:</p>
        <ul>
          <li>Custom website design that matches my brand (I have a logo and color scheme)</li>
          <li>Responsive development for all devices</li>
          <li>SEO optimization to improve local search rankings</li>
          <li>Performance optimization for fast loading</li>
          <li>Content management system so I can update products and prices</li>
          <li>Contact form and Google Maps integration</li>
          <li>Photo gallery for my products</li>
          <li>Simple online ordering system (if possible within budget)</li>
        </ul>
        
        <p>I'd like to see examples of your previous work with small businesses. Please include a timeline for completion in your bid.</p>
      `,
      price: 500,
      deliveryTime: "2-3 weeks",
      status: "ACTIVE",
      providerId: users[0].id,
      categoryId: digitalServicesCategory.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: `service_${nanoid()}`,
      title: "Need Professional House Cleaning",
      description:
        "Looking for someone to provide a thorough cleaning service for my home, including all rooms and special attention to kitchens and bathrooms.",
      longDescription: `
        <p>I need a comprehensive house cleaning service that will leave my home spotless and fresh. I have a 3-bedroom, 2-bathroom house that needs a deep clean.</p>
        
        <p>Requirements:</p>
        <ul>
          <li>Deep cleaning of kitchens and bathrooms</li>
          <li>Dusting and vacuuming all rooms</li>
          <li>Mopping all floors</li>
          <li>Window cleaning</li>
          <li>Laundry and ironing (if possible)</li>
          <li>Organization of closets and cabinets</li>
        </ul>
        
        <p>Please bring your own cleaning supplies and equipment. I'm flexible with scheduling and can work around your availability.</p>
        
        <p>Looking for someone with experience and good reviews. Please include your availability in your bid.</p>
      `,
      price: 85,
      deliveryTime: "1 day",
      status: "ACTIVE",
      providerId: users[1].id,
      categoryId: homeServicesCategory.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: `service_${nanoid()}`,
      title: "Personal Chef Needed for Dinner Party",
      description:
        "Looking for a personal chef to prepare a gourmet meal for my dinner party of 8 people, including menu planning, shopping, cooking, and cleanup.",
      longDescription: `
        <p>I'm hosting a dinner party for 8 people and need a personal chef to handle everything from menu planning to cleanup. This is for a special anniversary celebration.</p>
        
        <p>Requirements:</p>
        <ul>
          <li>Create a gourmet 4-course meal</li>
          <li>Handle all grocery shopping</li>
          <li>Prepare and serve the meal at my home</li>
          <li>Clean up the kitchen after dinner</li>
          <li>Accommodate some dietary restrictions (one vegetarian, one gluten-free)</li>
          <li>Provide a suggested wine pairing for each course</li>
        </ul>
        
        <p>The dinner party is scheduled for March 25th at 7 PM. Please include your proposed menu in your bid.</p>
      `,
      price: 350,
      deliveryTime: "1 day",
      status: "ACTIVE",
      providerId: users[0].id,
      categoryId: foodCookingCategory.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: `service_${nanoid()}`,
      title: "Math Tutoring for High School Student",
      description:
        "Seeking a math tutor for my 11th-grade son who is struggling with calculus. Need someone patient who can explain concepts clearly.",
      longDescription: `
        <p>My son is in 11th grade and is having difficulty with AP Calculus. He's a bright student but is struggling with some of the core concepts. We're looking for a tutor who can help him improve his understanding and grades.</p>
        
        <p>Requirements:</p>
        <ul>
          <li>Experience teaching AP Calculus</li>
          <li>Patient and able to explain complex concepts in simple terms</li>
          <li>Available for 2 hours per week (preferably weekends)</li>
          <li>Can provide practice problems and additional resources</li>
          <li>Track record of helping students improve their grades</li>
        </ul>
        
        <p>We're looking for someone who can start immediately and continue for the rest of the school year (about 3 months).</p>
      `,
      price: 40,
      deliveryTime: "Ongoing",
      status: "ACTIVE",
      providerId: users[1].id,
      categoryId: educationCategory.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: `service_${nanoid()}`,
      title: "Local Delivery Driver Needed",
      description:
        "Need someone to deliver packages for my small business within the city. Must have reliable transportation and be available weekdays.",
      longDescription: `
        <p>I run a small gift basket business and need someone to handle local deliveries. Looking for a reliable person with their own vehicle who can make deliveries on weekdays.</p>
        
        <p>Requirements:</p>
        <ul>
          <li>Own reliable vehicle (car, van, or truck)</li>
          <li>Valid driver's license and insurance</li>
          <li>Available Monday-Friday, approximately 2-4 hours per day</li>
          <li>Ability to handle fragile items carefully</li>
          <li>Professional appearance and demeanor when interacting with customers</li>
          <li>Smartphone for delivery confirmations and navigation</li>
        </ul>
        
        <p>Payment is per delivery, with an average of 8-10 deliveries per day. All deliveries are within a 15-mile radius of downtown.</p>
      `,
      price: 25,
      deliveryTime: "Ongoing",
      status: "ACTIVE",
      providerId: users[0].id,
      categoryId: deliveryMovingCategory.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  await db.insert(schema.services).values(services)
  console.log("Seeded services")

  // Seed images
  const images = []
  for (const service of services) {
    for (let i = 0; i < 3; i++) {
      images.push({
        id: `image_${nanoid()}`,
        url: `/placeholder.svg?height=400&width=600&text=${service.title.substring(0, 10)}+${i + 1}`,
        serviceId: service.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }
  }

  await db.insert(schema.images).values(images)
  console.log("Seeded images")

  // Seed bids
  const bids = [
    {
      id: `bid_${nanoid()}`,
      amount: 450,
      message:
        "I specialize in creating websites for small businesses. I can build a responsive site with all your requirements in 10 days. I've attached samples of my previous work.",
      status: "PENDING",
      serviceId: services[0].id,
      userId: users[1].id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: `bid_${nanoid()}`,
      amount: 75,
      message:
        "I can clean your house thoroughly with eco-friendly products. I have 5 years of experience and can do this job on Saturday.",
      status: "PENDING",
      serviceId: services[1].id,
      userId: users[0].id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: `bid_${nanoid()}`,
      amount: 90,
      message:
        "I offer premium cleaning services with attention to detail. I can bring my own supplies and am available this Friday.",
      status: "PENDING",
      serviceId: services[1].id,
      userId: users[1].id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  await db.insert(schema.bids).values(bids)
  console.log("Seeded bids")

  // Seed notifications
  const notifications = [
    {
      id: `notification_${nanoid()}`,
      title: "New Bid Received",
      message: `You received a new bid of $${bids[0].amount} on your service "${services[0].title}"`,
      type: "BID_RECEIVED",
      isRead: false,
      userId: users[0].id,
      relatedId: services[0].id,
      relatedType: "SERVICE",
      createdAt: new Date(),
    },
    {
      id: `notification_${nanoid()}`,
      title: "New Bid Received",
      message: `You received a new bid of $${bids[1].amount} on your service "${services[1].title}"`,
      type: "BID_RECEIVED",
      isRead: false,
      userId: users[1].id,
      relatedId: services[1].id,
      relatedType: "SERVICE",
      createdAt: new Date(),
    },
    {
      id: `notification_${nanoid()}`,
      title: "New Bid Received",
      message: `You received a new bid of $${bids[2].amount} on your service "${services[1].title}"`,
      type: "BID_RECEIVED",
      isRead: false,
      userId: users[1].id,
      relatedId: services[1].id,
      relatedType: "SERVICE",
      createdAt: new Date(),
    },
  ]

  await db.insert(schema.notifications).values(notifications)
  console.log("Seeded notifications")

  console.log("Database seeding completed")
}

