import { useEffect } from "react";
import Home from "./Pages/Home";
import getCurrentUser from "./Features/getCurrent.User";

function App() {

  useEffect(() => {
    const getUser = async () => await getCurrentUser();

    getUser();
  }, []);
  

  return (
    <>
      <Home />
    </>
  );
}

export default App;
