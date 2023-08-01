import { redirect } from "next/navigation"

import { getPost, getPosts } from "@/lib/mdx-utils"
import { cn } from "@/lib/utils"

import "katex/dist/katex.min.css"

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((post) => ({ params: { slug: post.slug } }))
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params
  const { content } = await getPost(slug)

  if (!content) {
    return redirect("/")
  }

  return (
    <section
      className={cn(
        "container flex flex-col items-center justify-between gap-6 pb-8 pt-6 md:py-10"
      )}
    >
      <article className="prose w-full dark:prose-invert">{content}</article>
    </section>
  )
}
