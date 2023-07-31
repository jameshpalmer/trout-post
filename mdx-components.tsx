import Image from "next/image"
import type { MDXComponents } from "mdx/types"

function HelloWorld() {
  return <h1>Hello World</h1>
}

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including components from
// other libraries.

// This file is required to use MDX in `app` directory.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => <h1 className="font-mono">{children}</h1>,
    Image: (props) => <Image {...props} />,
    ...components,
  }
}
