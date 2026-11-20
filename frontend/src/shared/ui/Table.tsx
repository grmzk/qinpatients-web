import { Fragment, ReactElement, useEffect, useState } from "react";

import formatToLocaleDate from "../lib/formatToLocaleDate";
import { isISODate, isISODateTime } from "../types/ISODateStrings";
import { TableContent } from "../types/TableContent";

import Loader from "./Loader";

import styles from "./Table.module.css";

type TableProps = {
  title: string;
  // eslint-disable-next-line
  tableContent: TableContent<any>;
  helpMessage: string;
  noDataMessage: string;
  isLoading: boolean;
};

function Table({ title, tableContent, helpMessage, noDataMessage, isLoading = false }: TableProps): ReactElement {
  const [content, setContent] = useState<typeof tableContent.content>(tableContent.content);
  const [orderBy, setOrderBy] = useState<keyof typeof tableContent.head>("");
  const [ascending, setAscending] = useState<boolean>(true);
  const [extraInfoIndex, setExtraInfoIndex] = useState<number>(0);

  useEffect(() => {
    setContent(tableContent.content);
    if (Object.keys(tableContent.head).length && !orderBy) {
      setOrderBy(Object.keys(tableContent.head)[0]);
    }
    if (!tableContent.content.length) {
      return;
    }
    const content = [...tableContent.content];
    const key = tableContent.head[orderBy];
    content.sort((a, b) => {
      if (typeof a.data[key] === "string") {
        if (a.data[key].match(/^\d+ (лет)?(года?)?$/)) {
          return parseInt(a.data[key]) - parseInt(b.data[key]);
        }
        return a.data[key].localeCompare(b.data[key]);
      }
      return a.data[key] - b.data[key];
    });
    ascending ? setContent(content) : setContent(content.reverse());
  }, [tableContent, orderBy, ascending]);

  useEffect(() => {
    isLoading && setExtraInfoIndex(0);
  }, [isLoading]);

  function handleSort(newOrderBy: keyof typeof tableContent.head) {
    if (orderBy === newOrderBy) {
      setAscending(!ascending);
      return;
    }
    setOrderBy(newOrderBy);
    setAscending(true);
    setExtraInfoIndex(0);
  }

  return (
    <div>
      <div className={styles.title}>{title}</div>
      {isLoading ? (
        <div className={styles.loading}>
          <Loader />
        </div>
      ) : content.length ? (
        <table>
          <thead>
            <tr>
              <th>№</th>
              {Object.keys(tableContent.head).map((title, index) => (
                <th className={styles.sortTh} key={index} onClick={() => handleSort(title)}>
                  {title}
                  {orderBy === title ? (ascending ? " ⇧" : " ⇩") : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody title={helpMessage}>
            {content.map((contentItem, index) => (
              <Fragment key={index}>
                <tr
                  className={
                    (contentItem.classList ? contentItem.classList.join(" ") + " " : "") +
                    (index + 1 === extraInfoIndex ? styles.extraInfoSelectedRow : "")
                  }
                  onClick={() => (extraInfoIndex === index + 1 ? setExtraInfoIndex(0) : setExtraInfoIndex(index + 1))}
                  onDoubleClick={contentItem.action}
                >
                  <td>{index + 1}</td>
                  {Object.entries(tableContent.head).map(([title, key]) => (
                    <td key={title}>
                      {isISODate(contentItem.data[key]) || isISODateTime(contentItem.data[key])
                        ? formatToLocaleDate(contentItem.data[key])
                        : contentItem.data[key]}
                    </td>
                  ))}
                </tr>
                {!!(contentItem?.extraInfoCol1 || contentItem?.extraInfoCol2 || contentItem?.extraInfoCol3) &&
                  index + 1 === extraInfoIndex && (
                    <tr className={contentItem.classList ? contentItem.classList.join(" ") : ""}>
                      <td className={styles.extraInfo} colSpan={Object.keys(tableContent.head).length + 1}>
                        <div className={styles.extraInfoHeader}>
                          {!!contentItem?.actionTitle && (
                            <button onClick={contentItem?.action}>{contentItem?.actionTitle}</button>
                          )}
                          <button onClick={() => setExtraInfoIndex(0)}>Закрыть</button>
                        </div>
                        <div className={styles.extraInfoContent}>
                          <div>{contentItem?.extraInfoCol1}</div>
                          <div>{contentItem?.extraInfoCol2}</div>
                          <div>{contentItem?.extraInfoCol3}</div>
                        </div>
                      </td>
                    </tr>
                  )}
              </Fragment>
            ))}
          </tbody>
        </table>
      ) : (
        <div className={styles.title}>{noDataMessage}</div>
      )}
    </div>
  );
}

export default Table;
