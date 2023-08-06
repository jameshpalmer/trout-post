import "server-only"
import fs from "fs"
import path from "path"
import { HTMLAttributes } from "react"
import Image, { ImageProps } from "next/image"
import type { MDXComponents } from "mdx/types"
import { compileMDX } from "next-mdx-remote/rsc"
import { Balancer } from "react-wrap-balancer"
import rehypeKatex from "rehype-katex"
import remarkMath from "remark-math"

import { Post } from "@/types/post"
import { FakeTweet, TweetData } from "@/components/fake-tweet"

import { cn } from "./utils"

const postsDirectory = path.join(process.cwd(), "content")

export const mdxComponents = {
  h1: ({ children, className, ...props }) => (
    <h1
      className={cn(
        "prose font-mono text-2xl dark:prose-invert sm:text-3xl md:text-4xl",
        className
      )}
      {...props}
    >
      <Balancer>{children}</Balancer>
    </h1>
  ),
  h2: ({ children, className, ...props }) => (
    <h2
      className={cn(
        "prose font-mono text-lg dark:prose-invert sm:text-xl md:text-2xl",
        className
      )}
      {...props}
    >
      <Balancer>{children}</Balancer>
    </h2>
  ),
  p: ({ children, className, ...props }) => (
    <p
      className={cn(
        "prose text-sm/5 dark:prose-invert sm:text-base",
        className
      )}
      {...props}
    >
      {children}
    </p>
  ),
  Image: (props: ImageProps) => <Image {...props} />,
  FakeTweet: ({
    className,
    ...props
  }: TweetData & HTMLAttributes<HTMLDivElement>) => (
    <FakeTweet className={cn("not-prose", className)} {...props} />
  ),
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
      }) as Promise<Post>[]
  )
  return posts.sort((a, b) => (a.date > b.date ? -1 : 1))
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
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        },
      },
    })
  } catch (error) {
    return { content: null }
  }
}
