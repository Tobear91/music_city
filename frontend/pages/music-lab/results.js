
import Results from '../../components/MusicLab/Results';
import { useSelector } from 'react-redux';

function ResultsPage() {
    const user = useSelector((state) => state.user.user);
  if (!user) return;
  return <Results />;
}

export default ResultsPage;
