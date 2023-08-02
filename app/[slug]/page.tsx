import fs from "fs"
import dynamic from "next/dynamic"
import { redirect } from "next/navigation"

import "katex/dist/katex.min.css"
import { getPosts } from "@/lib/mdx-utils"
import { cn } from "@/lib/utils"

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params

  if (!fs.existsSync(`content/${slug}.mdx`)) {
    return redirect("/")
  }

  const Post = dynamic(() => import(`@/content/${slug}.mdx`))

  return (
    <section
      className={cn(
        "container flex flex-col items-center justify-between gap-6 pb-8 pt-6 md:py-10"
      )}
    >
      <article className="prose w-full dark:prose-invert">
        <Post />
      </article>
    </section>
  )
}
