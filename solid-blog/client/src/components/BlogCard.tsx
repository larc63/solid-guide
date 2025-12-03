import { Component } from 'react';
import { BlogData } from "../types";

import '../App.css'

class BlogCard extends Component<BlogData> {
    constructor(props: BlogData) {
        super(props);
    }

    render() {
        return (
            <div className="blog-card">
                <div className="title">{this.props.title}</div>
            </div>
        )
    }
}

export default BlogCard;