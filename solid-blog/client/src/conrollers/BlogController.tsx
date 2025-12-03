import postData from "../data/blogData.json";
import { BlogData } from "../types";

const cardsPerPage = 6;
class BlogController {
    static getPostList(page: number): Array<BlogData> {
        return postData.slice((page-1), cardsPerPage);
    }
    static getPostData(id: string): BlogData {
        return postData.filter(p => p.id === id)[0];
    }
}

export default BlogController;