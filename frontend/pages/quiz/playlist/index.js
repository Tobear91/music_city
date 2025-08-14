import QuizPlaylists from "../../../components/quiz/QuizPlaylists";
import { useSelector } from "react-redux";


export default function QuizPlaylistsPage() {
  const user = useSelector((state) => state.user.user);  
  if (!user) return;
  return <QuizPlaylists />;
}
