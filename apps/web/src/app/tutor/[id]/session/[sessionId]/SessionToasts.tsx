"use client"

import * as React from "react"
import { toast } from "sonner"

export function SessionToasts({ created }: { created?: string }) {
  React.useEffect(() => {
    if (created === "success") {
      toast.success("Session created successfully! You can now edit the content below.")
    }
  }, [created])
  
  return null
}
