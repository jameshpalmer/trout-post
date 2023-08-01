"use client"

import { createContext, useContext, useMemo, useState } from "react"

import { Button } from "@/components/ui/button"

import { Icons } from "./icons"

export const FishContext = createContext<{
  showFish: boolean
  setShowFish: (showFish: boolean) => void
}>({
  showFish: false,
  setShowFish: () => {},
})

export const FishProvider = ({ children }: { children: React.ReactNode }) => {
  const [showFish, setShowFish] = useState(true)

  const value = useMemo(() => ({ showFish, setShowFish }), [showFish])

  return <FishContext.Provider value={value}>{children}</FishContext.Provider>
}

export function FishToggle(props: { className?: string }) {
  const { showFish, setShowFish } = useContext(FishContext)
  const Icon = useMemo(() => (showFish ? Icons.fish : Icons.noFish), [showFish])

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setShowFish(!showFish)}
      className={props.className}
    >
      <Icon
        className="h-[1.7em] w-[1.7em] md:h-[2em] md:w-[2rem]"
        strokeWidth={1.5}
      />
      <span className="sr-only">Toggle Fish</span>
    </Button>
  )
}
