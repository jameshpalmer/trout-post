import { redirect } from "next/navigation"

import { getPost, getPosts } from "@/lib/mdx-utils"
import { cn } from "@/lib/utils"

// Syntax highlighting
import "@/styles/highlight.css"
// Math typesetting
import "katex/dist/katex.min.css"

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((post) => ({ slug: post.slug }))
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
      {/* [&>*]:mb-5 to be removed when Firefox natively supports :has() */}
      <article className="flex w-full max-w-[70ch] flex-col [&>:not(:last-child)]:mb-5">
        {content}
      </article>
    </section>
  )
}
