import { Buffer } from "buffer";
import moment from "moment";

export const utils = {
  numOnly(data: string) {
    return data.replace(/[^0-9]+/g, "");
  },

  phone(value: string) {
    const num = this.numOnly(value);

    let val = "";
    if (num.length >= 0 && num.length <= 1) {
      val = num;
    } else if (num.length > 1 && num.length <= 3) {
      val = num.replace(/(\d{3})/, "$1-");
    } else if (num.length > 3 && num.length <= 7) {
      val = num.replace(/(\d{3})(\d{4})/, "$1-$2-");
    } else if (num.length > 7 && num.length <= 10) {
      val = num.replace(/(\d{3})(\d{4})(\d{3})/, "$1-$2-$3");
    }

    return val;
  },

  NumOnly: (data: string) => {
    return data.replace(/[^0-9]+/g, "");
  },

  dateInput(date: string) {
    if (!date || date === "") return "";

    const num = this.NumOnly(date);
    const l_num = num.length;
    let return_date = "";

    if (l_num >= 0 && l_num <= 2) {
      return_date = num;
    } else if (l_num >= 2 && l_num <= 4) {
      return_date = num.replace(/(\d{2})/, "$1/");
    } else if (l_num >= 4 && l_num <= 8) {
      return_date = num.replace(/(\d{2})(\d{2})/, "$1/$2/");
    }

    return return_date;
  },

  sum(temp: number[]) {
    return temp.reduce(
      (accumulator, current_value) => accumulator + current_value,
      0,
    );
  },

  enCvUrlParam(val: any) {
    const txt = typeof val === "object" ? JSON.stringify(val) : val;
    const b64 = Buffer.from(txt).toString("base64");
    const data = encodeURIComponent(btoa(b64));

    return data;
  },

  deCvUrlParam(val: any) {
    const data = Buffer.from(atob(decodeURIComponent(val)), "base64").toString(
      "utf8",
    );
    return data;
  },

  dateSort(key: string, arr: any[], format = "DD/MM/YYYY") {
    const data = arr.map((e) => ({
      ...e,
      [key]: moment(e[key] as string, format),
    }));

    const result = data.sort((a, b) => a[key].diff(b[key]));

    return result.map((e) => ({
      ...e,
      [key]: moment(e[key]).format(format),
    }));
  },
};
