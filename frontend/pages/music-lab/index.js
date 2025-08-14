
import Launch from '../../components/MusicLab/Launch';
import { useSelector } from 'react-redux';
function Index() {
    const user = useSelector((state) => state.user.user);
  if (!user) return;
  return <Launch />;
}

export default Index;
