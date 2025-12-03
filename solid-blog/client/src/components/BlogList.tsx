import { Component } from 'react';
import {Link} from 'react-router-dom';
import { BlogListState } from "../types";
import BlogCard from "./BlogCard";
import BlogController from '../conrollers/BlogController';

import '../App.css'

class BlogList extends Component {
    state: BlogListState = {
        blogs: [],
        page: 1
    }
    
    componentDidMount(): void {
        this.setState({ blogs: BlogController.getPostList(this.state.page) });
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