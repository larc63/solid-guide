
hi so basically I have been using express generator to make new express apps. I can make servers and then endpoint routes and then I then render html files for each of the routes visited and i use PUG as the view engine.

`app.set("views", path.join(__dirname, "../views"));app.set("view engine", "pug");`

Pug is nice but I am trying to figure out how to use react instead of making views for every route. Also as far as styling, using express generator I seem to only be able to edit styles.css to write vanilla css and then I have to serve the static path.

    app.use(express.static(path.join(__dirname, "../public")));

In a nutshell, I am just trying to figure out how to use react with nodejs and express. I read a couple of guides so I think I have the directory structure correct (client and server, each with their own node modules), but not sure on how to proceed. any advice? I've attached my repo. thanks.

[https://github.com/ForkEyeee/blog-api](https://github.com/ForkEyeee/blog-api)

&#x200B;


The above comments didn't mention the core of this post.

OP is coming from the templating world (PUG, etc). This is essentially, technically, traditionally server-side rendering. The server handles the request, determines what to render, then sends out a bunch of HTML to the browser.

Since 2010s, client side frameworks (like AngluarJS, React, Vue) emerged. In simple words they use pure Javascript to generate the DOM (more or less equivalent to HTML in JS world). The HTML (index.html) is just a blank shell pointing to a script to render UI. This is called Client Side Rendering (CSR). JS can also handle client side routing by mimicking URL changes but under the hood it's just showing and hiding stuff with JS. This is Single Page App (SPA). These files can be served statically with any server/service (like nginx, caddy, S3), and probably not ExpressJS most of the time. So, the first answer to this post is: No you don't need to use Express if you just want a simple SPA, follow the Vite Tutorial till "Deploying" (https://vitejs.dev/guide/static-deploy.html).

Then, your app probably needs data. The browser has a function called `fetch()` to fetch data from URL. If you fetch `https://www.google.com` you will get some HTML strings because it is serving a website directly. If you fetch `https://reqres.in/api/users` you will get a JSON containing some JSON data. When you build an SPA, all dynamic data will be coming from some API. Express usually works with any SPA as a REST api server, rather than serving the HTML directly.

But, SPA is not Search engine friendly because the index.html does not contain any data at all (IDK, thats what people said 5 years ago :/). People started to want SSR again, but still wanted to use React. We then have [https://react.dev/reference/react-dom/server](some server API from react). It is used by frameworks like Next.js to render complete HTML with the react rendering, on the server, send it to browser, then "hydrating" the website to be a complete react app. OK, I have gone too far. Anyway, it's still react and your data can still come from a separate Express server no matter what framework you're using.

Someone said "Fetching from server A to server B then render HTML to browser is too slow". Then Next.JS and the react team now advocates "React Server Components" (RSC), (not to be confused as SSR) (not to be discussed here). They encourage putting backend logic directly in your Next.js app without an extra API server. So the Express server is not necessary too.

As long as you chose react, the express server will never be a templating engine anymore. It's a REST API server that provides data for your react app.


One important point: for development you will run _two_ Nodejs instances/servers.  One for Express and one for serving up your React client.

Those two apps should be in separate directories (possibly within the same repo if you want to do a monorepo).

They connect to each other by the react client making calls to the API exposed by the express app (probably REST using axios on the client to fetch and put data to the express server).

For production there are several options, but a simple one is to build/bundle your client app and serve it from a regular web server (apache, nginx, etc) while your express server still runs using nodejs.