import { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../reducers/user";
import spotify from "../modules/spotify";

function Home() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    if (!router.isReady) return;

    if (router.query.user) {
      const jsonString = atob(router.query.user);
      const datas = JSON.parse(jsonString);
      dispatch(setUser(datas));
    }
  }, [router.isReady]);

  useEffect(() => {
    (async () => {
      if (user?.email) router.push("/");

      if (user) {
        const datas = await spotify.getFollowedArtists(user.spotify.access_token);
        console.log(datas);
      }
    })();
  }, [user]);

  const handleLogin = async () => {
    const response = await fetch("http://127.0.0.1:3000/spotify/login");
    const datas = await response.json();
    window.location.href = datas.redirect_url;
  };

  return (
    <>
      {!user && <button onClick={() => handleLogin()}>Login</button>}
      <h1>{user && user.email}</h1>
    </>
  );
}

export default Home;
