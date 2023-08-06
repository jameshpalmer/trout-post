import { HTMLAttributes, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

const dateOptions = {
  hour: "numeric",
  minute: "numeric",
  hour12: true,
  month: "short",
  day: "numeric",
  year: "numeric",
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "numeric",
  hour12: true,
  month: "short",
  day: "numeric",
  year: "numeric",
} as Intl.DateTimeFormatOptions)

function LikeIcon({ className, ...props }: HTMLAttributes<SVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-6 w-6 select-none text-red-500", className)}
      {...props}
    >
      <g>
        <path d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path>
      </g>
    </svg>
  )
}

function ReplyIcon({ className, ...props }: HTMLAttributes<SVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-6 w-6 select-none text-blue-400", className)}
      {...props}
    >
      <g>
        <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01z" />
      </g>
    </svg>
  )
}

export interface TweetData {
  text: string
  user: string
  handle: string
  avatar: string
  likes: number
  date: string
}

export function FakeTweet({
  className,
  ...props
}: TweetData & HTMLAttributes<HTMLDivElement>) {
  const formattedDateWithInterpunct = useMemo(() => {
    const date = new Date(props.date)
    const formattedDate = dateFormatter.format(date)
    const [day, year, time] = formattedDate.split(", ")
    return `${time} · ${day}, ${year}`
  }, [props.date])

  const displayLikes = useMemo(() => {
    if (props.likes >= 1000) {
      return `${(props.likes / 1000).toFixed(1)}K`
    }
    return props.likes
  }, [props.likes])

  const displayText = useMemo(
    () =>
      props.text.replace(/#(\w+)/g, `<span class="tweet-hashtag">#$1</span>`),
    [props.text]
  )

  return (
    <Link href={siteConfig.links.twitter} className="not-prose no-underline">
      <div
        className={cn(
          className,
          "not-prose w-full cursor-default rounded-2xl p-4 outline outline-1 outline-gray-200 transition-[background-color] hover:bg-gray-50 dark:bg-gray-900 dark:outline-gray-700 dark:hover:bg-gray-800"
        )}
        {...props}
      >
        <div className="flex flex-col gap-2">
          <div className="flex h-10 gap-2 sm:h-12">
            <div className="h-10 w-10 cursor-pointer overflow-hidden rounded-full sm:h-12 sm:w-12">
              <Image
                src={props.avatar}
                alt={props.user}
                className="h-full w-full object-cover"
                width={48}
                height={48}
              />
            </div>
            <div className="flex flex-col justify-center">
              <p className="cursor-pointer whitespace-nowrap text-sm font-semibold sm:text-base">
                {props.user}
              </p>
              <p className="cursor-pointer whitespace-nowrap text-xs font-light text-gray-500 dark:text-gray-400  sm:text-sm">
                @{props.handle}
              </p>
            </div>
          </div>
          <p
            className="not-prose text-base font-normal"
            dangerouslySetInnerHTML={{ __html: displayText }}
          />
          <span className="cursor-pointer whitespace-nowrap text-xs font-light text-gray-500 dark:text-gray-400  sm:text-sm">
            {formattedDateWithInterpunct}
          </span>
          <div className="w-full border-b border-gray-200 dark:border-gray-700" />
          <div className="flex gap-5 pt-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 sm:text-sm">
              <LikeIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              <span>{displayLikes}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 sm:text-sm">
              <ReplyIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              <span>Reply</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
