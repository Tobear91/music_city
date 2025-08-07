import React from "react";
import styles from "../assets/scss/Launch.module.scss";
import Link from "next/link";


export default function Launch (){

    return (
        <div className={styles.main}>
            <h1 className={styles.titlePage}>Music City</h1>
            <Link href="/connexion">
                    <button>
                        Launch Game
                    </button>
            </Link>
        </div>
    )
}