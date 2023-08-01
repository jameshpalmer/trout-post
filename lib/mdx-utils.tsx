import "server-only"
import fs from "fs"
import path from "path"
import Image, { ImageProps } from "next/image"
import type { MDXComponents } from "mdx/types"
import { compileMDX } from "next-mdx-remote/rsc"
import rehypeKatex from "rehype-katex"
import remarkMath from "remark-math"

import { Post } from "@/types/post"

import { cn } from "./utils"

const postsDirectory = path.join(process.cwd(), "posts")

export const mdxComponents = {
  h1: ({ children, ...props }) => (
    <h1 className={cn("font-mono", props.className)} {...props}>
      {children}
    </h1>
  ),
  Image: (props: ImageProps) => <Image {...props} />,
} as MDXComponents

export async function getPosts() {
  const fileNames = fs.readdirSync(postsDirectory)
  const posts = await Promise.all(
    fileNames.map(async (fileName) => {
      const slug = fileName.replace(/\.mdx$/, "")
      const { meta }: { meta: Post } = await import(`@/posts/${slug}.mdx`)
      return {
        ...meta,
        slug,
      }
    }) as Promise<Post>[]
  )
  return posts.sort((a, b) => (a.date > b.date ? -1 : 1))
}

export async function getPost(slug: string) {
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
}
