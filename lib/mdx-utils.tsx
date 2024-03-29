import "server-only"
import fs from "fs"
import path from "path"
import { HTMLAttributes } from "react"
import Image, { ImageProps } from "next/image"
import Link from "next/link"
import type { MDXComponents } from "mdx/types"
import { compileMDX } from "next-mdx-remote/rsc"
import { Tweet } from "react-tweet"
import { Balancer } from "react-wrap-balancer"
import rehypeHighlight from "rehype-highlight"
import rehypeKatex from "rehype-katex"
import rehypeSlug from "rehype-slug"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"

import { Post } from "@/types/post"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { FakeTweet, TweetData } from "@/components/fake-tweet"
import { Icons } from "@/components/icons"

import { cn } from "./utils"

const postsDirectory = path.join(process.cwd(), "content")

export const mdxComponents = {
  h1: ({ children, id, className, ...props }) => (
    <h1
      className={cn(
        "prose scroll-m-14 font-mono text-2xl dark:prose-invert sm:text-3xl md:text-4xl",
        className
      )}
      id={id}
      {...props}
    >
      <Balancer>{children}</Balancer>
    </h1>
  ),
  h2: ({ children, id, className, ...props }) => (
    <h2
      className={cn(
        "group prose relative scroll-m-14 font-mono text-lg dark:prose-invert sm:text-xl sm:hover:underline md:text-2xl",
        className
      )}
      id={id}
      {...props}
    >
      <Link href={`#${id}`} className="no-prose" aria-label="Anchor">
        <span className="absolute -left-5 inline-block w-full text-gray-300 no-underline opacity-0 transition-opacity group-hover:opacity-100 group-focus:opacity-100 group-active:opacity-100 dark:text-gray-700 sm:-left-8">
          #
        </span>
      </Link>
      <Balancer>{children}</Balancer>
    </h2>
  ),
  h3: ({ children, id, className, ...props }) => (
    <h3
      className={cn(
        "md:text-x group prose relative scroll-m-14 font-mono text-base dark:prose-invert sm:text-lg sm:hover:underline",
        className
      )}
      id={id}
      {...props}
    >
      <Link href={`#${id}`} className="no-prose" aria-label="Anchor">
        <span className="absolute -left-5 inline-block w-full text-gray-300 no-underline opacity-0 transition-opacity group-hover:opacity-100 group-focus:opacity-100 group-active:opacity-100 dark:text-gray-700 sm:-left-8">
          #
        </span>
      </Link>
      <Balancer>{children}</Balancer>
    </h3>
  ),
  p: ({ children, className, ...props }) => (
    <p
      className={cn(
        "prose inline text-sm/5 dark:prose-invert sm:text-base",
        className
      )}
      {...props}
    >
      {children}
    </p>
  ),
  a: ({ children, className, ...props }) => (
    <a className={cn("scroll-m-14", className)} {...props}>
      {className?.includes("data-footnote-backref") ? (
        <Icons.cornerDownLeft
          strokeWidth={1.5}
          className="mb-1 inline-block h-5 w-5"
        />
      ) : (
        children
      )}
    </a>
  ),
  ul: ({ children, className, ...props }) => (
    <ul
      className={cn(
        "prose list-inside list-disc text-sm/5 dark:prose-invert sm:text-base",
        className
      )}
      {...props}
    >
      {children}
    </ul>
  ),
  ol: ({ children, className, ...props }) => (
    <ol
      className={cn(
        "prose list-inside list-decimal text-sm/5 dark:prose-invert sm:text-base",
        className
      )}
      {...props}
    >
      {children}
    </ol>
  ),
  section: ({ children, className, ...props }) => (
    <>
      {className?.includes("footnotes") && (
        <div className="mt-7 h-px bg-gray-300 dark:bg-gray-800" />
      )}
      <section className={className} {...props}>
        {children}
      </section>
    </>
  ),
  Link,
  Image,
  Tweet,
  FakeTweet: ({
    className,
    ...props
  }: TweetData & HTMLAttributes<HTMLDivElement>) => (
    <FakeTweet className={cn("not-prose", className)} {...props} />
  ),
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} as MDXComponents

export async function getPosts() {
  const fileNames = fs.readdirSync(postsDirectory)
  const posts = await Promise.all(
    fileNames
      .filter((fileName) => /\.mdx$/.test(fileName))
      .map(async (fileName) => {
        const slug = fileName.replace(/\.mdx$/, "")
        const { meta }: { meta: Post } = await import(`@/content/${slug}.mdx`)
        return {
          ...meta,
          slug,
        }
      })
  )
  const publishedPosts = posts.filter((post) => !post.draft)
  return publishedPosts.sort((a, b) => (a.date > b.date ? -1 : 1))
}

export async function getPost(slug: string) {
  try {
    const fileContent = fs.readFileSync(
      path.join(postsDirectory, `${slug}.mdx`),
      "utf8"
    )

    return await compileMDX({
      source: fileContent,
      components: mdxComponents,
      options: {
        mdxOptions: {
          remarkPlugins: [remarkMath, remarkGfm],
          rehypePlugins: [rehypeKatex, rehypeHighlight, rehypeSlug],
        },
      },
    })
  } catch (error) {
    return { content: null }
  }
}
