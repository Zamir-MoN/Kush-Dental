import { matchRoutes } from "react-router-dom";
const routes = [
  { path: "/blog", element: "Blog" },
  { path: "/blog/:id", element: "BlogPostDetail" },
  { path: "/staff", children: [
      { path: "blog", element: "BlogList" },
      { path: "blog/new", element: "BlogCreate" },
      { path: "blog/:id/edit", element: "BlogEdit" }
    ]
  }
];
console.log(matchRoutes(routes, "/staff/blog"));
