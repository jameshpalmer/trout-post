import type { MDXComponents } from "mdx/types"

import { mdxComponents } from "./lib/mdx-utils"

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...mdxComponents,
    ...components,
  }
}
