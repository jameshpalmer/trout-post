import Image from "next/image"
import type { MDXComponents } from "mdx/types"

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => <h1 className="font-mono">{children}</h1>,
    Image: (props) => <Image alt={props.alt} {...props} />,
    ...components,
  }
}
