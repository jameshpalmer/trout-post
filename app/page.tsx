import Link from "next/link"
import { Balancer } from "react-wrap-balancer"

import { siteConfig } from "@/config/site"
import { getPosts } from "@/lib/mdx-utils"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { FishToggle } from "@/components/fish-toggle"
import { Icons } from "@/components/icons"

export default async function IndexPage() {
  const posts = await getPosts()

  return (
    <section className="container flex flex-col items-center justify-between gap-6 pb-8 pt-6 md:w-[60%] md:py-10">
      <div className="flex w-full flex-col items-start gap-2">
        <h1 className="text-3xl tracking-tighter md:text-4xl">
          Hello! <FishToggle className="translate-y-[2px]" />
        </h1>
        <p className="w-full text-sm text-muted-foreground md:text-base">
          <Balancer>
            This is a space to put my thoughts about FPL and related topics
            before I forget them.
          </Balancer>
        </p>
        <div className="h-4" />
        <div className="w-full font-mono">
          <header className="flex w-full py-1 text-sm lowercase text-muted-foreground">
            <span className="w-20 pl-1">Date</span>
            <span className="flex-1 pl-2">Title</span>
            <span className="inline-block w-20">Shitpost?</span>
          </header>
          {posts.map((post) => (
            <Link key={post.slug} href={`/${post.slug}`}>
              <div className="flex w-full items-center border-y border-b-0 border-gray-200 py-3 text-xs transition-[background-color] hover:bg-muted active:bg-gray-200 dark:border-gray-800 dark:active:bg-gray-800 sm:text-sm">
                <span className="w-20 pl-1">{post.date}</span>
                <span className="flex-1 px-2">
                  <Balancer>{post.title}</Balancer>
                </span>
                <span className="flex w-20 justify-end pr-2">
                  {post.shitpost && (
                    <Icons.check strokeWidth={1.5} className="h-5 w-5" />
                  )}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="flex gap-4">
        <Link
          href={siteConfig.links.twitter}
          aria-label="Twitter"
          className={buttonVariants({ variant: "outline" })}
        >
          <Icons.twitter strokeWidth={1.5} />
        </Link>
        <Link
          href={siteConfig.links.fpl}
          aria-label="FPL"
          className={buttonVariants({ variant: "outline" })}
        >
          <p className="font-mono text-lg">FPL</p>
        </Link>
        <Link
          href={siteConfig.links.github}
          aria-label="GitHub"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "hidden md:block"
          )}
        >
          <Icons.github strokeWidth={1.5} />
        </Link>
      </div>
    </section>
  )
}
