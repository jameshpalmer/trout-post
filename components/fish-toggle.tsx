"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"

import { Icons } from "./icons"

export function FishToggle(props: {
  showFish: boolean
  setShowFish: (showFish: boolean) => void
  className?: string
}) {
  const { showFish, setShowFish } = props
  const Icon = React.useMemo(
    () => (showFish ? Icons.fish : Icons.noFish),
    [showFish]
  )

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setShowFish(!showFish)}
      className={props.className}
    >
      <Icon className="h-[1.5rem] w-[1.3rem]" strokeWidth={1.5} />
      <span className="sr-only">Toggle Fish</span>
    </Button>
  )
}
