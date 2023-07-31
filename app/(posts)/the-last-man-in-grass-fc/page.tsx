import Content from "./content.mdx"

export default function Page() {
  return (
    <section className="container flex flex-col items-center justify-between gap-6 pb-8 pt-6 md:py-10">
      <article className="prose w-full dark:prose-invert">
        <Content />
      </article>
    </section>
  )
}
