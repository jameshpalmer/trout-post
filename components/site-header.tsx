"use client"

import { useContext, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  MotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTime,
  useTransform,
} from "framer-motion"

import * as motion from "@/lib/motion"
import { cn } from "@/lib/utils"
import Trout1 from "@/public/images/trout-1.svg"
import Trout2 from "@/public/images/trout-2.svg"
import WaterTexture from "@/public/images/water-texture.webp"

import { FishContext } from "./fish-toggle"
import { ThemeToggle } from "./theme-toggle"

interface HeaderBackgroundProps {
  image: string
  scroll: MotionValue<number>
  className?: string
}

function HeaderBackground(props: HeaderBackgroundProps) {
  const { image, scroll, className } = props
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      className={cn(
        "absolute left-[-16px] h-full min-w-[calc(100vw+125rem)] bg-repeat-x",
        `translate-x-[${scroll}px]`,
        className
      )}
      style={{
        backgroundImage: `url(${image})`,
        x: shouldReduceMotion ? 0 : scroll,
      }}
    />
  )
}

function Trout(props: {
  frame: 0 | 1 | 2 | 3 | 4 | 5
  reversing: boolean
  className?: string
}) {
  const { frame, reversing, className } = props

  const transform = `${reversing ? "scaleX(-1)" : ""} ${
    2 <= frame && frame <= 4 ? "" : "scaleY(-1)"
  }`

  return (
    <>
      <Image
        src={Trout1}
        alt="Trout"
        width={78}
        height={32}
        className={cn(
          "h-8 rounded-full opacity-20 dark:opacity-100",
          frame % 3 === 0 ? "" : "hidden",
          className
        )}
        style={{ transform }}
      />
      <Image
        src={Trout2}
        alt="Trout"
        width={78}
        height={32}
        className={cn(
          "h-8 rounded-full opacity-20 dark:opacity-100",
          frame % 3 === 0 ? "hidden" : "",
          className
        )}
        style={{ transform }}
      />
    </>
  )
}

export function SiteHeader() {
  const { showFish } = useContext(FishContext)
  const [reversing, setReversing] = useState(false)
  const [frame, setFrame] = useState<0 | 1 | 2 | 3 | 4 | 5>(0)

  const time = useTime()
  const { scrollY } = useScroll()
  const smoothScroll = useSpring(scrollY, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })
  const totalScroll = useTransform(
    [smoothScroll, time],
    ([latestScrollY, latestTime]: number[]) =>
      latestScrollY / 50 + latestTime / 200
  )

  useMotionValueEvent(
    totalScroll,
    "velocityChange",
    (latestVelocity: number) => {
      if (latestVelocity < -1 && !reversing) {
        setReversing(true)
      } else if (latestVelocity > 0 && reversing) {
        setReversing(false)
      }
    }
  )

  useMotionValueEvent(totalScroll, "change", (latest: number) => {
    const currentFrame = (Math.floor(latest / 4) % 6) as 0 | 1 | 2 | 3 | 4 | 5
    if (currentFrame !== frame) {
      setFrame(currentFrame)
    }
  })

  const foregroundScroll = useTransform(
    totalScroll,
    (latest) => `${latest % 100}%`
  )

  const backgroundScroll = useTransform(
    totalScroll,
    (latest) => -(latest % 1000)
  )

  return (
    <header className="sticky top-0 z-40 w-full overflow-hidden bg-gradient-to-b from-background via-background to-transparent">
      <div className="flex h-16 items-start">
        <HeaderBackground
          image={WaterTexture.src}
          scroll={backgroundScroll}
          className="z-10 dark:-z-10 dark:opacity-30"
        />
        <div className="absolute ml-[-125px] h-14 w-[calc(100%+125px)] select-none">
          <motion.div
            className="relative h-full motion-reduce:hidden"
            style={{ x: foregroundScroll }}
            animate={{
              opacity: showFish ? 1 : 0,
            }}
            transition={{
              duration: 0.1,
            }}
          >
            <div className="absolute flex h-full items-center justify-center text-white">
              <Trout frame={frame} reversing={reversing} />
            </div>
          </motion.div>{" "}
        </div>
        <div className="z-20 flex h-14 flex-1 items-center justify-around">
          <Link href="/" aria-label="Home">
            <p className="select-none font-mono">trout-post</p>
          </Link>
          <div className="flex items-center justify-center gap-5">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}
