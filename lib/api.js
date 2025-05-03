// API utility functions

// Base API URL from environment or default
const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api"

// Generic fetch function with improved error handling
async function fetchAPI(endpoint, options = {}) {
  try {
    const url = `${API_URL}${endpoint}`
    console.log(`Making ${options.method || "GET"} request to: ${url}`)

    if (options.body) {
      console.log("Request payload:", options.body)
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    // First try to parse the response as JSON
    const data = await response.text()
    let parsedData

    try {
      parsedData = data ? JSON.parse(data) : {}
    } catch (e) {
      console.error("Failed to parse response as JSON:", data.substring(0, 200) + "...")
      parsedData = { message: "Invalid response format" }
    }

    if (!response.ok) {
      // Extract error message from response if available
      const errorMessage =
        parsedData.error || parsedData.message || response.statusText || `API error: ${response.status}`
      console.error(`API error (${endpoint}):`, errorMessage)

      // Return error object instead of throwing
      return {
        error: true,
        message: errorMessage,
        status: response.status,
      }
    }

    return parsedData
  } catch (error) {
    console.error(`API error (${endpoint}):`, error)
    return {
      error: true,
      message: error.message || "Unknown error occurred",
      status: 500,
    }
  }
}

// Services API
export const servicesAPI = {
  // Get all services with optional filters
  getServices: async (filters = {}) => {
    const queryParams = new URLSearchParams()

    // Add filters to query params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value)
      }
    })

    const query = queryParams.toString() ? `?${queryParams.toString()}` : ""
    const result = await fetchAPI(`/services${query}`)

    if (result.error) {
      console.error("Error fetching services:", result.message)
      return []
    }

    return result
  },

  // Get a single service by ID
  getService: async (id) => {
    const result = await fetchAPI(`/services/${id}`)
    if (result.error) {
      console.error(`Error fetching service ${id}:`, result.message)
      return null
    }
    return result
  },

  // Create a new service
  createService: async (data) => {
    const result = await fetchAPI("/services", {
      method: "POST",
      body: JSON.stringify(data),
    })

    if (result.error) {
      throw new Error(result.message)
    }

    return result
  },

  // Update a service
  updateService: async (id, data) => {
    const result = await fetchAPI(`/services/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })

    if (result.error) {
      throw new Error(result.message)
    }

    return result
  },

  // Delete a service
  deleteService: async (id) => {
    const result = await fetchAPI(`/services/${id}`, {
      method: "DELETE",
    })

    if (result.error) {
      throw new Error(result.message)
    }

    return result
  },
}

// Categories API
export const categoriesAPI = {
  // Get all categories
  getCategories: async () => {
    const result = await fetchAPI("/categories")

    if (result.error) {
      console.error("Error fetching categories:", result.message)
      return []
    }

    return result
  },
}

// User API
export const userAPI = {
  // Get current user profile
  getProfile: async () => {
    const result = await fetchAPI("/users/me")

    if (result.error) {
      console.error("Error fetching user profile:", result.message)
      return null
    }

    return result
  },

  // Update user profile
  updateProfile: async (data) => {
    const result = await fetchAPI("/users/me", {
      method: "PUT",
      body: JSON.stringify(data),
    })

    if (result.error) {
      throw new Error(result.message)
    }

    return result
  },

  // Get user services
  getServices: async () => {
    const result = await fetchAPI("/users/me/services")

    if (result.error) {
      console.error("Error fetching user services:", result.message)
      return []
    }

    return result
  },

  // Get user bids
  getBids: async () => {
    const result = await fetchAPI("/users/me/bids")

    if (result.error) {
      console.error("Error fetching user bids:", result.message)
      return []
    }

    return result
  },

  // Get user contracts
  getContracts: async () => {
    const result = await fetchAPI("/users/me/contracts")

    if (result.error) {
      console.error("Error fetching user contracts:", result.message)
      return []
    }

    return result
  },

  // Get user transactions
  getTransactions: async () => {
    const result = await fetchAPI("/users/me/transactions")

    if (result.error) {
      console.error("Error fetching user transactions:", result.message)
      return []
    }

    return result
  },

  // Get user wallet
  getWallet: async () => {
    const result = await fetchAPI("/users/wallet")

    if (result.error) {
      console.error("Error fetching user wallet:", result.message)
      return null
    }

    return result
  },
}

// Bids API
export const bidsAPI = {
  // Get bids for a service
  getServiceBids: async (serviceId) => {
    const result = await fetchAPI(`/services/${serviceId}/bids`)

    if (result.error) {
      console.error(`Error fetching bids for service ${serviceId}:`, result.message)
      return []
    }

    return result
  },

  // Create a bid
  createBid: async (serviceId, data) => {
    const result = await fetchAPI(`/services/${serviceId}/bids`, {
      method: "POST",
      body: JSON.stringify(data),
    })

    if (result.error) {
      throw new Error(result.message)
    }

    return result
  },

  // Accept a bid
  acceptBid: async (serviceId, bidId) => {
    const result = await fetchAPI(`/services/${serviceId}/bids/${bidId}/accept`, {
      method: "POST",
    })

    if (result.error) {
      throw new Error(result.message)
    }

    return result
  },
}

// Authentication API
export const authAPI = {
  // Register a new user
  register: async (data) => {
    const result = await fetchAPI("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    })

    if (result.error) {
      throw new Error(result.message)
    }

    return result
  },

  // Login
  login: async (data) => {
    const result = await fetchAPI("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    })

    if (result.error) {
      throw new Error(result.message)
    }

    return result
  },

  // Logout
  logout: async () => {
    const result = await fetchAPI("/auth/logout", {
      method: "POST",
    })

    if (result.error) {
      throw new Error(result.message)
    }

    return result
  },
}

// Export fetchAPI for direct use if needed
export { fetchAPI }

