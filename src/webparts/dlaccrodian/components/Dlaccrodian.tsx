import * as React from "react";
import {
  useEffect,
  useState,
  useRef,
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
import { ICamlQuery } from "@pnp/sp/lists";
import {
  IPickerTerms,
  TaxonomyPicker,
} from "@pnp/spfx-controls-react/lib/TaxonomyPicker";

import { IData } from "./types";
import Accordian from "./Accordian";
import Card from "./Card";

const Dlaccrodian: React.FunctionComponent<IDlaccrodianProps> = (props) => {
  const [items, setitems] = useState([]);
  const [accordiansOpened, setAccordiansOpened] = useState<string[]>([]);
  const [searchKeyWords, setSearchKeyWords] = useState<{
    search: string;
    termstore: IPickerTerms;
  }>({
    search: "",
    termstore: [],
  });
  const imageref: any = useRef();
  const sp = spfi().using(SPFx(props.context));
  //data from sp list
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async function getlistitems() {
    const response: [] = await sp.web.lists
      .getById(props.listId)
      .items.select("*", "FileRef", "FileLeafRef", "EncodedAbsUrl")();
    setitems(response);
  }

  async function inputOnchangeGetListItems() {
    if (
      searchKeyWords?.search.length < 0 &&
      searchKeyWords?.termstore.length < 0
    ) {
      // eslint-disable-next-line no-void
      void getlistitems();
    }
    if (searchKeyWords?.search.length > 0) {
      imageref.current.style.display = "none";
    } else {
      imageref.current.style.display = "initial";
    }
    let termStoreTagQuery = "";
    searchKeyWords.termstore.map((value, key) => {
      termStoreTagQuery += `<Eq>
         <FieldRef Name='Tag' />
         <Value Type='TaxonomyFieldType'>${value?.name}</Value>
      </Eq>`;
    });
    const secrchFileNameQuery = `${
      searchKeyWords?.search.length > 0 ||
      (searchKeyWords?.termstore.length > 0 &&
        searchKeyWords?.search.length > 0)
        ? "<And>"
        : ""
    }
    ${
      searchKeyWords?.search.length > 0
        ? `  <Contains>
         <FieldRef Name='FileLeafRef' />
         <Value Type='File'>${searchKeyWords?.search}</Value>
      </Contains>`
        : ""
    }
      ${searchKeyWords?.termstore.length > 0 ? "<Or>" : ""}
      ${termStoreTagQuery}
      ${searchKeyWords?.termstore.length > 0 ? "</Or>" : ""}
      ${
        searchKeyWords?.search.length > 0 ||
        (searchKeyWords?.termstore.length > 0 &&
          searchKeyWords?.search.length > 0)
          ? "</And>"
          : ""
      }`;
    const caml: ICamlQuery = {
      ViewXml: `<View>
        <Query>
   <Where>
   ${secrchFileNameQuery}
   </Where>
   <OrderBy>
      <FieldRef Name='FileLeafRef' Ascending='False' />
   </OrderBy>
</Query>
</View>`,
    };

    console.log("camel query", caml);

    let result: any = await sp.web.lists
      .getById(props.listId)
      .getItemsByCAMLQuery(caml);
    setitems(result);
    console.log("result from cample", result);
  }

  const groupBy = (data: IData[], key: string) => {
    return data.reduce((acc, item) => {
      const groupKey = item[key as keyof IData] as string;

      if (!acc[groupKey]) {
        acc[groupKey] = { item: [], uniqueKey: "" };
      }

      acc[groupKey].item.push(item);
      acc[groupKey].uniqueKey = item.GUID;

      return acc;
    }, {} as Record<string, { item: IData[]; uniqueKey: string }>);
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
    (data: IData[], keys: string[], level = 0) => {
      if (level >= keys.length) {
        return <Card content={data} />;
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
          >
            {renderAccordian(groupedData[key].item, keys, level + 1)}
          </Accordian>
        ) : (
          <Card content={data} />
        );
      });
    },
    [accordiansOpened, handleToggle]
  );
  useEffect(() => {
    // eslint-disable-next-line no-void
    console.log("Terms", props.terms);

    // eslint-disable-next-line no-void
    void getlistitems();
  }, []);
  useEffect(() => {
    void inputOnchangeGetListItems();
  }, [searchKeyWords]);
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
                  if (e.target.value.length > 0) {
                    setSearchKeyWords((prevState) => ({
                      ...prevState,
                      search: e.target.value,
                    }));
                  }
                }}
              />
              <img
                src={require("../assets/search.svg")}
                ref={imageref}
                alt=""
                width={20}
                height={20}
                className={styles.searchIcon}
              />
            </div>
            <div className={styles.termstoreInput}>
              <TaxonomyPicker
                allowMultipleSelections={true}
                termsetNameOrID={props.terms[0]?.key}
                placeholder="Select Term"
                panelTitle="Select Term"
                label=""
                context={props.context as any}
                onChange={(e: IPickerTerms) => {
                  console.log("TermStore ", e);
                  setSearchKeyWords((prevState) => ({
                    ...prevState,
                    termstore: e,
                  }));
                }}
                isTermSetSelectable={false}
              />
            </div>
          </div>
          <div className={styles.accordianContent}>
            {renderAccordian(items as IData[], props.listAccordianColumns)}
          </div>
        </div>
      )}
    </>
  );
};
export default Dlaccrodian;
