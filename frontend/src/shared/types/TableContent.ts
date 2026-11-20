import { ReactNode } from "react";

type TableColumnKey<ContentData extends object> = {
  [Key in keyof ContentData]-?: ContentData[Key] extends string | number | boolean ? Key : never;
}[keyof ContentData];

export type ContentOfTableContent<ContentData extends object> = {
  data: ContentData;
  classList?: string[];
  action?: () => void;
  actionTitle?: string;
  extraInfoCol1?: ReactNode;
  extraInfoCol2?: ReactNode;
  extraInfoCol3?: ReactNode;
};

export type TableContent<ContentData extends object> = {
  head: Record<string, TableColumnKey<ContentData>>;
  content: ContentOfTableContent<ContentData>[];
};
