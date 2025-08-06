import { useSelector } from "react-redux";
import spotify from "../modules/spotify";
import dynamic from "next/dynamic";
import { useState } from "react";

// Ce composant sera uniquement rendu côté client, permet de bouger sur la map et ne pas laisser la carte en static
// et permet d'enelver l'erreur ReferenceError: window is not defined car Phaser utilise utilise des objets liés au DOM qui n'existent aps côté server
const PhaserGame = dynamic(() => import("./PhaserGame"), {
  ssr: false, // Server-Side Rendering - Il ne sera rendu que dans le navigateur
});

function Home() {
  const user = useSelector((state) => state.user.user);

  const handleClick = async () => {
    const me = await spotify.getMe();
    console.log(me);
  };

  return (
    <>
    
      {user && <PhaserGame/>}

    </>
  );
}

export default Home;
