"use client"

import * as React from "react"
import { toast } from "sonner"

export function StudentToasts({ attached, error, paid }: { attached?: string; error?: string; paid?: string }) {
  React.useEffect(() => {
    if (attached === "success") toast.success("Session enrolled successfully")
    if (error === "not_yours") toast.error("This session is not yours")
    if (error === "already_enrolled") toast.error("You are already enrolled in this session")
    if (error === "not_found") toast.error("Session not found")
    if (error === "invalid") toast.error("Invalid link")
    if (error === "enrollment_failed") toast.error("Failed to enroll in session. Please try again.")
    if (paid === "1") toast.success("Payment successful. Session unlocked")
  }, [attached, error, paid])
  return null
}
