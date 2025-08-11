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
import {nextQuestion,addAnswerToStore  } from "../../reducers/blindtest";
import { useRouter } from 'next/router';
import {leaveApplication} from '../../modules/appinteraction'

export default function Questions({ restartQuiz }) {
     const router = useRouter();   
    const [currentAnswer, setCurrentAnswer] = useState({
    answer: '',
    showActor: false,
    showPoster: false
});
    const blindtestInfo = useSelector((state)=>state.blindtest)
    const [dispEndQuizz,setDispEndQuiz] = useState(false);


    const saveCurrentAnswer = () => {
        dispatch(addAnswerToStore(currentAnswer));
        setCurrentAnswer({ answer: '', showActor: false, showPoster: false });
    };


      const handleLeaveBuilding = () => {
          leaveApplication(router)
      };

    const handleFinishQuiz = () => {
        saveCurrentAnswer();          
        router.push('./results');       
    };

    const dispatch = useDispatch()

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
         <FontAwesomeIcon icon={faCircleXmark}  className={styles.crossClose}  style={{ width: "40px", height: "40px" }} onClick={handleLeaveBuilding}/>
    </div>
        <div className={styles.mainContainer}> 
            <Image src="/img/cloudy_moon.jpg" alt="Cloudy Moon" width={707} height={194} priority />
            <div className={styles.overlaySection}>

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
               

            </div>
        </div>  
        </div> 
    );
}