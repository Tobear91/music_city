
import Loadingpage from '../../components/MusicLab/Loadingpage';
import { useSelector } from 'react-redux';
function LoadingFunction() {
    const user = useSelector((state) => state.user.user);
  if (!user) return;
  return <Loadingpage />;
}

export default LoadingFunction;
