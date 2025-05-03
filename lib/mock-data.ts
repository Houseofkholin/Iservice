// Mock data for the dashboard
export const MOCK_PROFILE = {
  totalEarnings: 1248.5,
}

export const MOCK_CONTRACTS = [
  {
    id: "1234",
    serviceTitle: "Logo Design",
    clientId: "client1",
    clientName: "Michael Chen",
    clientAvatar: "/placeholder.svg?height=32&width=32&text=MC",
    amount: 300,
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days from now
    status: "IN_PROGRESS",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
  },
  {
    id: "1235",
    serviceTitle: "Website Redesign",
    clientId: "client2",
    clientName: "Sarah Johnson",
    clientAvatar: "/placeholder.svg?height=32&width=32&text=SJ",
    amount: 750,
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days from now
    status: "IN_PROGRESS",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), // 10 days ago
  },
]

export const MOCK_BIDS = [
  {
    id: "1",
    serviceId: "101",
    serviceTitle: "E-commerce Website Development",
    clientName: "Olivia Taylor",
    clientId: "client1",
    amount: 850,
    message: "I can build a comprehensive e-commerce solution with all the features you need.",
    status: "PENDING",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
  },
  {
    id: "2",
    serviceId: "102",
    serviceTitle: "Logo Design",
    clientName: "Michael Chen",
    clientId: "client2",
    amount: 300,
    message: "I can create a modern, unique logo that represents your brand identity.",
    status: "ACCEPTED",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
  },
]

export const MOCK_SERVICES = [
  {
    id: "1",
    title: "Professional Website Development",
    category: "Web Development",
    description: "I will create a responsive, modern website with clean code and SEO optimization.",
    price: 500,
    deliveryTime: "2-3 weeks",
    rating: 4.9,
    reviewCount: 18,
    status: "ACTIVE",
    bids: 5,
    image: "/placeholder.svg?height=225&width=400&text=Web+Dev",
    createdAt: new Date("2023-02-15").toISOString(),
  },
  {
    id: "2",
    title: "Modern UI/UX Design",
    category: "UI/UX Design",
    description: "I will design a modern, user-friendly interface for your application or website.",
    price: 400,
    deliveryTime: "1-2 weeks",
    rating: 5.0,
    reviewCount: 12,
    status: "ACTIVE",
    bids: 3,
    image: "/placeholder.svg?height=225&width=400&text=UI/UX",
    createdAt: new Date("2023-03-01").toISOString(),
  },
]

export const MOCK_TRANSACTIONS = [
  {
    id: "tx1",
    type: "PAYMENT_RECEIVED",
    contractId: "1230",
    contractTitle: "Content Writing",
    amount: 200,
    status: "COMPLETED",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    id: "tx2",
    type: "ESCROW_CREATED",
    contractId: "1234",
    contractTitle: "Logo Design",
    amount: 300,
    status: "IN_PROGRESS",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
  },
]

