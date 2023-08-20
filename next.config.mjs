import createMDX from "@next/mdx"
import rehypeHighlight from "rehype-highlight"
import rehypeKatex from "rehype-katex"
import remarkMath from "remark-math"

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
}

const withMDX = createMDX({
  options: {
    extension: /\.mdx?$/,
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex, rehypeHighlight],
  },
})

export default withMDX(nextConfig)
