
export type BlogData = {
    id: string,
    title: string,
    content: string
}

export type BlogListState = {
    blogs: Array<BlogData>,
    page: number
}