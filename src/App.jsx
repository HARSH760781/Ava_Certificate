import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import StudentDetails from "./StudentDetails";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <StudentDetails />
    </>
  );
}

export default App;
