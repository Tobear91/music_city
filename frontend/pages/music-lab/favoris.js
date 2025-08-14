
import Favoris from '../../components/MusicLab/Favoris';
import { useSelector } from 'react-redux';

function FavorisPage() {

    const user = useSelector((state) => state.user.user);
  if (!user) return;
  return <Favoris />;
}

export default FavorisPage;