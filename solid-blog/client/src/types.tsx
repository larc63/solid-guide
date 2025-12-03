export type BlogData = {
    id: string,
    title: string
}

export type BlogListState = {
    blogs: Array<BlogData>,
    page: number
}