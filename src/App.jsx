import { publicRoutes } from "./routers/router";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Fragment } from "react";
function App() {
  return (
    <Router>
      <Routes>
        {publicRoutes.map((route, index) => {
          const Page = route.component;
          let Layout;
          route.layout ? (Layout = route.layout) : (Layout = Fragment);
          return (
            <Route
              key={index}
              path={route.path}
              element={
                <Layout>
                  <Page />
                </Layout>
              }
            />
          );
        })}
      </Routes>
    </Router>
  );
}

export default App;
