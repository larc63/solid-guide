import React from 'react';
import Header from './Header'
// const TODOList = React.lazy(() => import("todo/TODOList"));
import TODOList from 'todo/TODOList'

import './App.css'

const App = () => {
    return (
        <>
            <div className="container">
                <Header></Header>
                <div className="content" >
                <TODOList></TODOList>
                <div>This is the content</div>
                </div>
            </div>
        </>
    );
};

export default App;