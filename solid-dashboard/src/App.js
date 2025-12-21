import React, { Suspense, lazy, useEffect, useState } from 'react';
import { init, loadRemote } from '@module-federation/enhanced/runtime';

import Header from "./Header";

import './App.css'

const App = () => {

    const [TODOList, setWidget] = useState(null);

    useEffect(() => {
        async function load() {
            // 1) Initialize share scope and register remote URL
            await init({
                name: 'dashboard',
                remotes: [{ name: 'todo', entry: window.TODO_MODULE}]
            });

            // 2) Lazy-load the exposed module
            const LazyTODOList = lazy(() =>
                loadRemote('todo/TODOList').then(mod => ({ default: mod.default }))
            );
            setWidget(() => LazyTODOList);
        }

        load();
    }, []);

    return (
        <>
            <div className="container">
                <Header></Header>
                <div className="content" >
                    {/* <TODOList></TODOList> */}
                    {TODOList ? (
                    <Suspense fallback="Loading remote..."><TODOList /></Suspense>
                    ) : (
                    <p>Initializing...</p>
                    )}
                    <div>This is the content</div>
                </div>
            </div>
        </>
    );
};

export default App;