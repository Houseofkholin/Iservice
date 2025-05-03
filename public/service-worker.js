// Service Worker for I-Service Marketplace
const CACHE_NAME = "i-service-cache-v1"
const OFFLINE_PAGE = "/offline.html"

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
  "/",
  "/offline.html",
  "/placeholder.svg",
  "/metamask.svg",
  "/coinbase.svg",
  "/walletconnect.svg",
  "/phantom.svg",
  "/favicon.ico",
]

// Install event - precache assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_ASSETS)
      })
      .then(() => {
        return self.skipWaiting()
      }),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => {
        return self.clients.claim()
      }),
  )
})

// Fetch event - network first, fallback to cache, then offline page
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests and browser extensions
  if (
    event.request.method !== "GET" ||
    event.request.url.startsWith("chrome-extension") ||
    event.request.url.includes("extension") ||
    event.request.url.includes("__nextjs")
  ) {
    return
  }

  // For API requests, use network only
  if (event.request.url.includes("/api/")) {
    return
  }

  // For HTML pages, use network first, then cache, then offline page
  if (event.request.headers.get("Accept").includes("text/html")) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache the latest version
          const responseClone = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone)
          })
          return response
        })
        .catch(() => {
          // If network fails, try the cache
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse
            }
            // If not in cache, show offline page
            return caches.match(OFFLINE_PAGE)
          })
        }),
    )
    return
  }

  // For other assets, use cache first, then network
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached response and update cache in background
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone())
            })
            return networkResponse
          })
          .catch(() => cachedResponse)

        return cachedResponse
      }

      // If not in cache, fetch from network
      return fetch(event.request)
        .then((response) => {
          // Cache the response
          const responseClone = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone)
          })
          return response
        })
        .catch(() => {
          // For image requests, return a placeholder
          if (event.request.url.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
            return caches.match("/placeholder.svg")
          }

          // For other assets, return nothing (will trigger error in app)
          return new Response("", {
            status: 408,
            statusText: "Request timed out",
          })
        })
    }),
  )
})

// Background sync for offline form submissions
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-bids") {
    event.waitUntil(syncBids())
  } else if (event.tag === "sync-messages") {
    event.waitUntil(syncMessages())
  }
})

// Push notification event
self.addEventListener("push", (event) => {
  if (!event.data) return

  try {
    const data = event.data.json()

    const options = {
      body: data.body,
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      data: {
        url: data.url || "/",
      },
    }

    event.waitUntil(self.registration.showNotification(data.title, options))
  } catch (error) {
    console.error("Error showing notification:", error)
  }
})

// Notification click event
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      const url = event.notification.data.url

      // If a window is already open, focus it and navigate
      for (const client of clientList) {
        if (client.url === url && "focus" in client) {
          return client.focus()
        }
      }

      // Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow(url)
      }
    }),
  )
})

// Helper function to sync offline bids
async function syncBids() {
  try {
    const db = await openDB()
    const offlineBids = await db.getAll("offlineBids")

    for (const bid of offlineBids) {
      try {
        const response = await fetch(`/api/services/${bid.serviceId}/bids`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: bid.amount,
            message: bid.message,
          }),
        })

        if (response.ok) {
          await db.delete("offlineBids", bid.id)
        }
      } catch (error) {
        console.error("Error syncing bid:", error)
      }
    }
  } catch (error) {
    console.error("Error in syncBids:", error)
  }
}

// Helper function to sync offline messages
async function syncMessages() {
  try {
    const db = await openDB()
    const offlineMessages = await db.getAll("offlineMessages")

    for (const message of offlineMessages) {
      try {
        const response = await fetch(`/api/messages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recipientId: message.recipientId,
            content: message.content,
          }),
        })

        if (response.ok) {
          await db.delete("offlineMessages", message.id)
        }
      } catch (error) {
        console.error("Error syncing message:", error)
      }
    }
  } catch (error) {
    console.error("Error in syncMessages:", error)
  }
}

// Helper function to open IndexedDB
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("IServiceDB", 1)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = event.target.result

      if (!db.objectStoreNames.contains("offlineBids")) {
        db.createObjectStore("offlineBids", { keyPath: "id", autoIncrement: true })
      }

      if (!db.objectStoreNames.contains("offlineMessages")) {
        db.createObjectStore("offlineMessages", { keyPath: "id", autoIncrement: true })
      }
    }
  })
}

