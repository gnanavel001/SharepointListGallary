import * as React from "react";
// import { IData } from "./types";
import styles from './Dlaccrodian.module.scss';
import { FileIcon, defaultStyles } from "react-file-icon";


function Card({ data, Column1, Column2, Column3 }: Readonly<{ data: any, Column1: string, Column2: string, Column3: string }>) {
    const ext = getFileExtension(data.FileLeafRef);
    console.log("column names", Column1, Column2, Column3);

    return (
        <div className={styles.card}>
            <div className={styles.icon} onClick={() => window.open(data.ServerRedirectedEmbedUrl)}>
                <FileIcon extension={ext} {...defaultStyles[ext]} />
                <h3 className={styles.title}>{data?.FileLeafRef}</h3>
            </div>

            <div className={styles.content}>
                <p className={styles.sopRefrence}>{data?.[Column1]}</p>
                <p className={styles.location}>{data?.[Column2]}</p>
            </div>
            <p>Last updated : {new Date(data?.[Column3]).toLocaleDateString("en-US")}</p>
        </div>
    );
}
function getFileExtension(filename: string) {
    return filename.substring(filename.lastIndexOf(".") + 1);
}


export default Card;
