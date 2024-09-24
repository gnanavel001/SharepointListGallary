import * as React from "react";
// import { IData } from "./types";
import Card from "../components/Card";
import styles from './Dlaccrodian.module.scss';


function Cards({ content, column1, column2, column3 }: { content: any[], column1: string, column2: string, column3: string }) {
    return (
        <div className={styles['cards-container']}>
            {content.map((e) => (
                <Card key={e.ID} data={e} Column1={column1} Column2={column2} Column3={column3} />
            ))}
        </div>
    );
}

export default Cards;
