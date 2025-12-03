import {Component} from 'react';
import Header from "./Header";
import BlogList from "./BlogList";

class Home extends Component {
    render(){
        return (
            <div>
                <Header />
                <BlogList />
            </div>
        )
    }
}

export default Home;