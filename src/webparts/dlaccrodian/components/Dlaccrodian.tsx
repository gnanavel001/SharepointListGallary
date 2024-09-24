import * as React from "react";
import {
  useEffect,
  useState,
  SyntheticEvent,
  useCallback,
} from "react";
import type { IDlaccrodianProps } from "./IDlaccrodianProps";
import styles from "./Dlaccrodian.module.scss";
import "@pnp/sp/lists";
import "@pnp/sp/webs";
import "@pnp/sp/files";
import "@pnp/sp/folders";
import "@pnp/sp/fields";
import "@pnp/sp/items";
import "@pnp/sp/site-users/web";
import { spfi, SPFx } from "@pnp/sp";
// import { IData } from "./types";
import Accordian from "./Accordian";
import Cards from "./Cards";

const Dlaccrodian: React.FunctionComponent<IDlaccrodianProps> = (props) => {
  const [items, setitems] = useState([]);
  const [accordiansOpened, setAccordiansOpened] = useState<string[]>([]);
  const [imageref, setImagevisble] = useState<number>(0);
  const sp = spfi().using(SPFx(props.context));
  //data from sp list
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async function getlistitems() {
    const response: [] = await sp.web.lists
      .getById(props.listId)
      .items.select("*", "FileRef", "FileLeafRef", "EncodedAbsUrl")();
    setitems(response);
    console.log("result ", response);
    console.log("selected columns", props.listAccordianColumns);


  }
  async function getListItemsWithFilter(e: string) {

    try {
      const response: [] = await sp.web.lists
        .getById(props.listId)
        .items
        .select("*", "FileRef", "FileLeafRef", "EncodedAbsUrl")
        .filter(`substringof('${e}',FileLeafRef)`)()
      setitems(response);
    } catch (error) {
      console.error("Error fetching list items:", error);
    }
  }



  const groupBy = (data: any[], key: string) => {
    return data.reduce((acc, item) => {
      const groupKey = item[key as keyof any] as string;

      if (!acc[groupKey]) {
        acc[groupKey] = { item: [], uniqueKey: "" };
      }

      acc[groupKey].item.push(item);
      acc[groupKey].uniqueKey = item?.GUID;

      return acc;
    }, {} as Record<string, { item: any[]; uniqueKey: string }>);
  };

  const handleToggle = useCallback(
    (e: SyntheticEvent<HTMLDetailsElement>, uniqueKey: string) => {
      if (e.currentTarget.open) {
        setAccordiansOpened((prev) => [...prev, uniqueKey]);
      } else {
        setAccordiansOpened(accordiansOpened.filter((e) => e !== uniqueKey));
      }
    },
    [accordiansOpened]
  );

  const renderAccordian = useCallback(
    (data: any[], keys: string[], level = 0) => {
      if (level >= keys.length) {
        return <Cards content={data} column1={props.columnsToShow1} column2={props.columnsToShow2} column3={props.columnsToShow3} />;
      }

      const groupedData = groupBy(data, keys[level]);

      return Object.keys(groupedData).map((key) => {
        const uniqueKey = groupedData[key].uniqueKey + " " + key;

        return key !== "undefined" ? (
          <Accordian
            key={uniqueKey}
            title={`${key} (${groupedData[key].item.length})`}
            isOpen={accordiansOpened.includes(uniqueKey)}
            onToggle={(e) => handleToggle(e, uniqueKey)}
            isParent={level === 0}
          >
            {renderAccordian(groupedData[key].item, keys, level + 1)}
          </Accordian>
        ) : (
          <Cards content={data} column1={props.columnsToShow1} column2={props.columnsToShow2} column3={props.columnsToShow3} />
        );
      });
    },
    [accordiansOpened, handleToggle]
  );
  useEffect(() => {
    // eslint-disable-next-line no-void
    void getlistitems();
  }, []);
  return (
    <>
      {items && (
        <div className={styles.accordion}>
          <div className={styles.header}>
            <div className={styles.search}>
              <input
                type="text"
                name=""
                id=""
                placeholder="Search"
                onChange={(e) => {
                  setImagevisble(e.target.value.length)
                  e.target.value.length > 0 ? getListItemsWithFilter(e.target.value) : getlistitems();
                }}
                className=""
              />
              <img
                src={require("../assets/search.svg")}
                alt=""
                width={20}
                height={20}
                className={`{${styles.searchIcon}  ${imageref > 0 ? styles.searchInputDisable : styles.searchInputShow}`}
              />
            </div>
          </div>
          <div className={styles.accordianContent}>
            {renderAccordian(items as any[], props.listAccordianColumns)}
          </div>
        </div>
      )}
    </>
  );
};
export default Dlaccrodian;
