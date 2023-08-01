type Post = import("./post").Post

declare module "*.mdx" {
  export const meta: Post
}
