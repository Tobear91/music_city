import { useSelector } from "react-redux";

function Home() {
  const user = useSelector((state) => state.user.user);

  return (
    <>
      <h1>{user && user.email}</h1>
    </>
  );
}

export default Home;
