const { useEffect } = require("react");
const { useSelector } = require("react-redux");
import {
  getFavorites,
  removeFromFavorites,
} from "../../modules/listedefavoris";

const [favList, setFavList] = useState([]);
const useremail = useSelector((state) => state.user.user.email);

function Favoris() {
  useEffect(() => {
    async function getFavoritesList(email) {
      const favs = await getFavorites(email);
      setFavList(favs);
    }
    getFavoritesList(useremail);
  }, [favList]);

  function handleRemoveFav(track_id) {
    const newList = favList.filter(
      (track) => track.track_spotify_id !== track_id
    );
    removeFromFavorites(track_id, useremail).then(() => setFavList(newList));
  }

  const liste = favList.map((track, index) => (
     <Favtrack key={index} handleRemoveFav={() => handleRemoveFav(track.track_spotify_id)} track={track.title} artist={track.artist}/>
  ) 
  )


  return(
    <>
    <div>
      {liste} 
    </div>
    </>
  )
}


