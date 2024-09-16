import * as React from "react";
import { IData } from "./types";
import styles from './Dlaccrodian.module.scss';
function Card({ content }: Readonly<{ content: IData[] }>) {
    return (
        <>
            {content.map((e) => (
                <div key={e.ID} className={styles.card}>
                    <a href={e.ServerRedirectedEmbedUrl} style={{ paddingRight: "10px" }}>{e.FileLeafRef}</a>
                    <p style={{ paddingRight: "10px" }}>{e.Category}</p>
                    <p style={{ paddingRight: "10px" }}>{e.Subcategory}</p>
                    <button onClick={() => window.open(e.ServerRedirectedEmbedUrl)} className={styles.vewbutton}>View</button>
                </div>
            ))}
        </>
    );
}


export default Card;
