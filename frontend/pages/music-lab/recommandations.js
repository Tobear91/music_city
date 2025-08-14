
import Recommandations from '../../components/MusicLab/Recommandations';
import { useSelector } from 'react-redux';
function RecommandationsPage() {
    const user = useSelector((state) => state.user.user);
  if (!user) return;
  return <Recommandations />;
}

export default RecommandationsPage;
