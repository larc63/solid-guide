import { Component } from 'react';
import {Link} from 'react-router-dom';
import { BlogListState } from "../types";
import BlogCard from "./BlogCard";
import testData from "../data/blogData.json";

import '../App.css'

const cardsPerPage = 6;
class BlogList extends Component {
    state: BlogListState = {
        blogs: [],
        page: 1
    }
    
    componentDidMount(): void {
        this.setState({ blogs: testData.slice(0,cardsPerPage) });
    }

    render() {
        return (
            <article className="blog-list">
                {this.state.blogs.map((blog) => (
                    <Link to={`posts/${blog.id}`}>
                        <BlogCard key={blog.id} id={blog.id} title={blog.title} />
                    </Link>
                ))}
            </article>
        )
    }
}

export default BlogList;