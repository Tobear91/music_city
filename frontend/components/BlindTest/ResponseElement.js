import React, { useState,useEffect } from 'react';
import styles from "../../assets/scss/blindtest/ReponseElement.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestion} from "@fortawesome/free-solid-svg-icons";
import Image from 'next/image';



export default function ReponseElement({mainActor,posterUrl, currentAnswer, setCurrentAnswer }){
    

        const handleActorClick = () => {
            setCurrentAnswer(prev => ({ ...prev, showActor: true }));
        };

        const handlePosterClick = () => {
            setCurrentAnswer(prev => ({ ...prev, showPoster: true }));
        };

        const handleAnswerChange = (e) => {
            setCurrentAnswer(prev => ({ ...prev, answer: e.target.value }));
        };
    return (
        <div>
            <div className={styles.question}>
                <div className={styles.questionTxt}>
                    <h2 className={styles.subtitle}> Indices </h2>
                    <div className={styles.indicesContainer}>
                        <div className={styles.indiceElement}>
                            <button className={`form-button secondary ${styles.button}`} onClick={handleActorClick}>
                                Acteur principal <FontAwesomeIcon icon={faQuestion} />
                            </button>
                            <p className={styles.indiceActor}>
                                L'acteur principal est : {currentAnswer.showActor ? mainActor : "..."}
                            </p>
                        </div>

                        <div className={styles.indiceElement}>
                            <button className={`form-button secondary ${styles.button}`} onClick={handlePosterClick}>
                                Morceau Poster <FontAwesomeIcon icon={faQuestion} />
                            </button>
                            {currentAnswer.showPoster && (
                                <Image
                                    src={posterUrl}
                                    alt="Poster"
                                    width={100}
                                    height={150}
                                />
                            )}
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className={styles.subtitle}> Réponse </h2>
                    <input
                        className="form-input"
                        placeholder="Nom de la série...."
                        onChange={handleAnswerChange}
                        value={currentAnswer.answer}
                    />
                </div>
            </div>
        </div>
    );

}