import "server-only"
import fs from "fs"
import path from "path"
import Image, { ImageProps } from "next/image"
import type { MDXComponents } from "mdx/types"
import { compileMDX } from "next-mdx-remote/rsc"
import { Balancer } from "react-wrap-balancer"
import rehypeKatex from "rehype-katex"
import remarkMath from "remark-math"

import { Post } from "@/types/post"

import { cn } from "./utils"

const postsDirectory = path.join(process.cwd(), "content")

export const mdxComponents = {
  h1: ({ children, ...props }) => (
    <h1
      className={cn(
        "font-mono text-2xl sm:text-3xl md:text-4xl",
        props.className
      )}
      {...props}
    >
      <Balancer>{children}</Balancer>
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2
      className={cn(
        "font-mono text-lg sm:text-xl md:text-2xl",
        props.className
      )}
      {...props}
    >
      <Balancer>{children}</Balancer>
    </h2>
  ),
  p: ({ children, ...props }) => (
    <p className={cn("text-sm/5 sm:text-base", props.className)} {...props}>
      {children}
    </p>
  ),
  Image: (props: ImageProps) => <Image {...props} />,
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
