import React from "react";
import Login from "./components/Login";
import Meetings from "./components/Meetings";

function App() {
  const [user, setUser] = React.useState<string | null>(null);

  return user ? <Meetings /> : <Login onLogin={setUser} />;
}

export default App;