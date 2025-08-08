import React, { useEffect } from 'react';
import styles from "../../assets/scss/blindtest/Questions.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import QuestionElement from './QuestionElement';
import Image from 'next/image';
import ResponseElement from './ResponseElement';
import { useState } from 'react';
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { openModal,closeModal,nextQuestion,addAnswerToStore  } from "../../reducers/blindtest";
import Results from './Results';

export default function Questions({ restartQuiz }) {
    
    const [currentAnswer, setCurrentAnswer] = useState({
    answer: '',
    showActor: false,
    showPoster: false
});
    const blindtestInfo = useSelector((state)=>state.blindtest)
    const [dispEndQuizz,setDispEndQuiz] = useState(false);
    const [dispResults,setDispResults] = useState(false)
    const [dispCorrection,setDispCorrection] = useState(false)


    const saveCurrentAnswer = () => {
        dispatch(addAnswerToStore(currentAnswer));
        setCurrentAnswer({ answer: '', showActor: false, showPoster: false });
};


        const handleFinishQuiz = () => {
            saveCurrentAnswer();          
            setDispResults(true);         
        };

    const dispatch = useDispatch()
    const handleCloseModal = ()=>{
    dispatch(closeModal())
    }

    const handleNextQuestion = ()=>{
            saveCurrentAnswer();
            dispatch(nextQuestion())}

    useEffect(() => {
    if (blindtestInfo.questionNbr + 1 >= blindtestInfo.questionList.length) {
        setDispEndQuiz(true);
    }
    }, [blindtestInfo.questionNbr]);


    return (
    
    <div className={styles.modalOverlay}>
    <div className={styles.menuBar}>
         <FontAwesomeIcon icon={faCircleXmark}  className={styles.crossClose}  style={{ width: "40px", height: "40px" }} onClick={()=>setDispCorrection(true)}/>
    </div>
        <div className={styles.mainContainer}> 
            <Image src="/img/cloudy_moon.jpg" alt="Cloudy Moon" width={707} height={194} priority />
            <div className={styles.overlaySection}>
        <>
        {dispResults ? (<>

        <Results />
        <div className={styles.buttonTriple} >
            <button className={styles.nextButton}>
                Voir la correction <FontAwesomeIcon icon={faArrowRight} className={styles.nextFa} onClick={restartQuiz}/>
            </button>
    
            <button className={styles.nextButton} onClick={restartQuiz}>
                Relancer le quizz <FontAwesomeIcon icon={faArrowRight} className={styles.nextFa} />
            </button>
            <button className={styles.nextButton} onClick={handleCloseModal}>
                Sortir du batiment <FontAwesomeIcon icon={faArrowRight} className={styles.nextFa} />
            </button>
        </div>
        </>
      ) :( <>
                <QuestionElement previewUrl={blindtestInfo.questionList[blindtestInfo.questionNbr].previewURL} totalQuestion={blindtestInfo.questionList.length} questioNumber={blindtestInfo.questionNbr + 1} isCertain={blindtestInfo.questionList[blindtestInfo.questionNbr].isTrackMatchCertain}></QuestionElement>
                <ResponseElement mainActor={blindtestInfo.questionList[blindtestInfo.questionNbr].mainActor} posterUrl= {blindtestInfo.questionList[blindtestInfo.questionNbr].posterUrl}     currentAnswer={currentAnswer}
                setCurrentAnswer={setCurrentAnswer}></ResponseElement>

                {!dispEndQuizz && <div className={styles.buttonContainer}>
                    <button className={styles.nextButton} onClick={handleNextQuestion}>
                        Question suivante <FontAwesomeIcon icon={faArrowRight} className={styles.nextFa} />
                    </button>
                </div>}

                {dispEndQuizz && <div className={styles.buttonContainer} onClick={handleFinishQuiz}>
                    <button className={styles.nextButton}>
                        Terminer le quizz <FontAwesomeIcon icon={faArrowRight} className={styles.nextFa} />
                    </button>
                </div>}
                </>
                )}
</>
            </div>
        </div>  
    </div>
    );
}