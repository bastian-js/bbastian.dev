import { Routes, Route } from "react-router-dom";
import routes from "./routes";
import NavBar from "./components/NavBar";
import Snowfall from "react-snowfall";
import Footer from "./components/Footer";

function App() {
  const date = new Date();
  const month = date.getMonth();

  const condition = month === 11 || month === 0; // December, January, February
  //|| month === 1
  return (
    <>
      {condition && (
        <Snowfall
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 9999,
            pointerEvents: "none",
          }}
        />
      )}
      <div className="min-h-screen flex flex-col">
        <NavBar />

        <main className="flex-1 flex justify-center">
          <div className="container text-center">
            <Routes>
              {routes.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
              ))}
            </Routes>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default App;
