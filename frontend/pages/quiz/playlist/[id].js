import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import Quiz from "../../../components/quiz/Quiz";
import { getPlaylistTracks } from "../../../modules/spotify";
import { getQuestions } from "../../../components/quiz/Questions";

export default function QuizFromPlaylistPage() {
  const user = useSelector((state) => state.user.user);
  if (!user) return;

  const router = useRouter();
  const { id } = router.query; // playlist id
  const [initialQuestions, setInitialQuestions] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getPlaylistTracks(id);
        const tracks = (data.items)
          .map((item) => item.track)
          .filter((t) => t && t.name && t.artists?.[0]?.name && t.album?.name);
        const questions = getQuestions(tracks);
        setInitialQuestions(questions);
      } catch (err) {
        console.error("Erreur chargement playlist:", err);
      }
    })();
  }, [id]);

  return <Quiz initialQuestions={initialQuestions} />;
}
