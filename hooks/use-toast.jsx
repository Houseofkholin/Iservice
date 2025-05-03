"use client"

// Inspired by react-hot-toast library
import { useEffect, useState } from "react"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 1000000

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

const toasts = []

const listeners = []

function emitChange() {
  listeners.forEach((listener) => {
    listener(toasts)
  })
}

function addToRemoveQueue(toastId) {
  if (toasts.length >= TOAST_LIMIT) {
    toasts.shift()
  }

  const timeout = setTimeout(() => {
    removeToast(toastId)
  }, TOAST_REMOVE_DELAY)

  return timeout
}

export function toast(props) {
  const id = props.id || genId()

  const update = (props) => {
    if (toasts.find((t) => t.id === id)) {
      toasts.forEach((t) => {
        if (t.id === id) {
          t.title = props.title ?? t.title
          t.description = props.description ?? t.description
          t.action = props.action ?? t.action
          t.variant = props.variant ?? t.variant
        }
      })
      emitChange()
    }
  }

  const dismiss = () => {
    removeToast(id)
  }

  const timeout = addToRemoveQueue(id)

  const newToast = {
    id,
    title: props.title,
    description: props.description,
    variant: props.variant,
    action: props.action,
    timeout,
    onDismiss: dismiss,
    update,
  }

  toasts.push(newToast)
  emitChange()

  return {
    id,
    dismiss,
    update,
  }
}

export function removeToast(id) {
  const toastIndex = toasts.findIndex((t) => t.id === id)

  if (toastIndex !== -1) {
    const toast = toasts[toastIndex]
    clearTimeout(toast.timeout)
    toasts.splice(toastIndex, 1)
    emitChange()
  }
}

export function useToast() {
  const [state, setState] = useState(toasts)

  useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    toast,
    dismiss: (id) => removeToast(id),
    toasts: state,
  }
}

