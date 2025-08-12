import React, { useEffect,useState } from 'react';
import styles from "../../assets/scss/blindtest/Correction.module.scss";
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faCircleXmark, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from 'next/router';
import {leaveApplication} from '../../modules/appinteraction'
import Image from 'next/image';
import CorrectionElement from './CorrectionElement';
import Header from './Header';

export default function Correction (){
    const router = useRouter();   

    const blindtestInfo = useSelector((state)=>state.blindtest);
    
    const handleBack = () => {
        router.push('./results');       
        };
    const handleLeaveBuilding = () => {
        leaveApplication(router)
    };

    const correction = blindtestInfo.questionList.map((data,i)=>{

        let isAnswerCorrect = blindtestInfo.correction[i].isCorrect;
        return (<CorrectionElement previewUrl={data.previewURL} questionNbr={i+1} key={i} serieName={data.serieName} userAnswer={blindtestInfo.answerList[i].answer} totalQuestion={blindtestInfo.answerList.length} isCorrect={isAnswerCorrect}></CorrectionElement>)
    })
    
    return (
        <div className={styles.modalOverlay}>
            <Header></Header>
        <div className={styles.mainContainer}> 
                        <Image src="/img/cloudy_moon.jpg" alt="Cloudy Moon" width={707} height={194} priority />
            <div className={styles.overlaySection}>
                <div className={styles.containerTitle}>
                    <h1 className={styles.title}> Correction </h1>

                </div>
        <div className={styles.correctionContainer}>
            {correction}
            </div>        
        <div className={styles.buttonTriple} >
            <button className={styles.button} onClick={handleBack}>
                Revenir en arrière <FontAwesomeIcon icon={faArrowLeft} className={styles.previousFa} />
            </button>

            <button className={styles.button}  onClick={handleLeaveBuilding}>
                Sortir du batiment <FontAwesomeIcon icon={faArrowRight} className={styles.nextFa}/>
            </button>
        </div>
        </div>
        </div>
         </div>
    )
}
