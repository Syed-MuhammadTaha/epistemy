"use client"

import * as React from "react"
import { toast } from "sonner"

export function StudentToasts({ attached, error, paid }: { attached?: string; error?: string; paid?: string }) {
  React.useEffect(() => {
    if (attached === "success") toast.success("Session linked to your account")
    if (attached === "already") toast("Session already linked")
    if (error === "already_registered") toast.error("Session belongs to another student")
    if (error === "not_found") toast.error("Session not found")
    if (error === "invalid") toast.error("Invalid link")
    if (paid === "1") toast.success("Payment successful. Session unlocked")
  }, [attached, error, paid])
  return null
}
