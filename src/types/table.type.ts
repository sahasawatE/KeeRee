type Header = {
  title: string;
  key: string;
  sortable?: false;
  width?: number | string;
  removable?: false;
  align?: "center" | "start" | "end";
};

type HeaderProp = Header[];

type TableProps = {
  headers: HeaderProp;
  data: any[];
};

export type { Header, HeaderProp, TableProps };
