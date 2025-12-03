import Home from "../components/Home";
import Post from "../components/Post";
// import Page1 from "../../components/Page1";
// import Page2 from "../../components/Page2";
// import Page3 from "../../components/Page3";

export const ROUTES = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/posts/:id",
    element: <Post />,
  },
//   {
//     path: "/page2",
//     element: <Page2 />,
//   },
//   {
//     path: "/page3",
//     element: <Page3 />,
//   },
];
