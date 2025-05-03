"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

// Mock recent searches and popular categories
const recentSearches = ["website design", "logo creation", "home cleaning"]
const popularCategories = [
  { name: "Web Development", slug: "web-development" },
  { name: "Graphic Design", slug: "graphic-design" },
  { name: "Home Services", slug: "home-services" },
  { name: "Digital Marketing", slug: "digital-marketing" },
]

export function SearchBar() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")

  // Handle keyboard shortcut to open search
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const handleSearch = (searchTerm: string) => {
    // Save to recent searches in localStorage
    const searches = JSON.parse(localStorage.getItem("recentSearches") || "[]")
    if (!searches.includes(searchTerm) && searchTerm.trim()) {
      const newSearches = [searchTerm, ...searches].slice(0, 5)
      localStorage.setItem("recentSearches", JSON.stringify(newSearches))
    }

    // Navigate to search results
    router.push(`/marketplace?search=${encodeURIComponent(searchTerm)}`)
    setOpen(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(query)
  }

  return (
    <>
      <div className="relative w-full md:w-auto">
        <form onSubmit={handleSubmit} className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search services..."
            className="w-full md:w-[300px] pl-8 pr-10"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClick={() => setOpen(true)}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-9 w-9 px-0"
            onClick={() => setOpen(true)}
          >
            <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
        </form>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search for any service..." value={query} onValueChange={setQuery} />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Recent Searches">
            {recentSearches.map((search) => (
              <CommandItem key={search} onSelect={() => handleSearch(search)}>
                <Search className="mr-2 h-4 w-4" />
                {search}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Popular Categories">
            {popularCategories.map((category) => (
              <CommandItem key={category.slug} onSelect={() => router.push(`/marketplace?category=${category.slug}`)}>
                {category.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}

