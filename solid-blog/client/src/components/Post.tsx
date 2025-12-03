import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import BlogController from '../conrollers/BlogController';


import Header from "./Header";

 function Post () {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const params = useParams();

    useEffect(() => {
        const data = BlogController.getPostData(params.id as string);
        setTitle(data.title);
        setContent(data.content);
    }, []);

    return (
        <div>
            <Header />
            <h1>{title}</h1>
            <div className="post-content">
                {content}
            </div>
        </div>
    )
}

export default Post;