import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../Utils/firebase";
import api from "../Utils/axios";

function App() {
  const handleLogin = async (token) => {
    try {
      const { data } = await api.post("/auth/login", {token});

      console.log(data);
    } catch (err) {
      console.log(`error : ${err}`);
    }
  };

  const googleLogin = async () => {
    const data = await signInWithPopup(auth, googleProvider);
    const token = await data.user.getIdToken();
    console.log(token);
    await handleLogin(token);
  };

  return (
    <>
      <div className="w-full h-screen bg-black">
        <button className="w-50 h-24 bg-amber-400" onClick={googleLogin}>
          Continue with Google
        </button>
      </div>
    </>
  );
}

export default App;
