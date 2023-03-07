import "./App.css";
import Login from "./components.js/Login";
import Register from "./components.js/Register";
import { Routes, Route } from "react-router-dom";
import Middleware from "./components.js/Middleware";
import Main from "./components.js/Main";
import Notfound from "./components.js/Notfound";
import Nolaptop from "./components.js/Nolaptop";
import { MyContext } from "./components.js/Context";
import { useState } from "react";

function App() {
  const [value, setvalue] = useState();

  const updatevalue = (updated_value) => {
    setvalue(updated_value);
  };

  return (
    <div>
      <MyContext.Provider value={{ value, updatevalue }}>
        <Routes>
          <Route path="/" element={<Nolaptop Comp={Register} />}></Route>
          <Route path="/login" element={<Nolaptop Comp={Login} />} />
          <Route
            path="/chats"
            element={<Nolaptop Comp={Middleware} Child={Main} />}
          />
          <Route path="*" element={<Notfound />} />
        </Routes>
      </MyContext.Provider>
    </div>
  );
}

export default App;
