import { useSelector } from "react-redux";
import spotify from "../modules/spotify";

function Home() {
  const user = useSelector((state) => state.user.user);

  const handleClick = async () => {
    const me = await spotify.getMe();
    console.log(me);
  };

  return (
    <>
      <h1>{user && user.email}</h1>
      <button onClick={() => handleClick()}>Show User Info</button>
    </>
  );
}

export default Home;
