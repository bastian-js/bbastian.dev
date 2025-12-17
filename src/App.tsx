import { Routes, Route } from "react-router-dom";
import routes from "./routes";
import NavBar from "./components/NavBar";

function App() {
  return (
    <div className="container text-center">
      <NavBar />
      <Routes>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
    </div>
  );
}

export default App;
