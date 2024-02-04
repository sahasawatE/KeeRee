import moment from "moment-with-locales-es6";

import type { Moment } from "moment";

import type { Response } from "~/types/query.type";
import type { ResponseAcc } from "~/types/accounting.type";
import type { EggSchema } from "~/types/egg.type";
import type { SellingSchema, SumSchema } from "~/types/selling.type";
import type { FoodSchema } from "~/types/food.type";
import type {
  CollectEggsCSV,
  SellEggsCSV,
  AccountingCSV,
} from "~/types/export.type";

export default defineNuxtPlugin(() => {
  function createHeader() {
    const collectEggs = {
      "วัน เดือน ปี": "",
      "น้ำหนักอาหารแถว A (กก.)": "",
      "น้ำหนักอาหารแถว B (กก.)": "",
      "น้ำหนักอาหารแถว C (กก.)": "",
      "น้ำหนักอาหารแถว D (กก.)": "",
      "น้ำหนักอาหารรวม (กก.)": "",
      "จำนวนไข่แถว A (ฟอง)": "",
      "จำนวนไข่แถว B (ฟอง)": "",
      "จำนวนไข่แถว C (ฟอง)": "",
      "จำนวนไข่แถว D (ฟอง)": "",
      "จำนวนไข่รวม (ฟอง)": "",
      "น้ำหนักไข่รวม (กรัม)": "",
      "น้ำหนักไข่เฉลี่ยต่อฟอง (กรัม)": "",
      "จำนวนไข่เบอร์ 4 (แผง)": "",
      "จำนวนไข่เบอร์ 4 สะสม (แผง)": "",
      "จำนวนไข่เบอร์ 3 (แผง)": "",
      "จำนวนไข่เบอร์ 3 สะสม (แผง)": "",
      "จำนวนไข่เบอร์ 2 (แผง)": "",
      "จำนวนไข่เบอร์ 2 สะสม (แผง)": "",
      "จำนวนไข่เบอร์ 1 (แผง)": "",
      "จำนวนไข่เบอร์ 1 สะสม (แผง)": "",
      "จำนวนไข่เบอร์ 0 (แผง)": "",
      "จำนวนไข่เบอร์ 0 สะสม (แผง)": "",
      "จำนวนไข่รวม (แผง)": "",
      "จำนวนไข่สะสม (แผง)": "",
      "จำนวนไข่คงเหลือ (ฟอง)": "",
    } as CollectEggsCSV;

    const sellEggs = {
      "วัน เดือน ปี": "",
      "ขายไข่เบอร์ 4 (แผง)": "",
      "ขายไข่เบอร์ 4 (บาท)": "",
      "ไข่เบอร์ 4 คงเหลือ (แผง)": "",
      "ขายไข่เบอร์ 3 (แผง)": "",
      "ขายไข่เบอร์ 3 (บาท)": "",
      "ไข่เบอร์ 3 คงเหลือ (แผง)": "",
      "ขายไข่เบอร์ 2 (แผง)": "",
      "ขายไข่เบอร์ 2 (บาท)": "",
      "ไข่เบอร์ 2 คงเหลือ (แผง)": "",
      "ขายไข่เบอร์ 1 (แผง)": "",
      "ขายไข่เบอร์ 1 (บาท)": "",
      "ไข่เบอร์ 1 คงเหลือ (แผง)": "",
      "ขายไข่เบอร์ 0 (แผง)": "",
      "ขายไข่เบอร์ 0 (บาท)": "",
      "ไข่เบอร์ 0 คงเหลือ (แผง)": "",
      "ขายไข่ทั้งหมด (แผง)": "",
      "ขายไข่ทั้งหมด (บาท)": "",
      "ไข่ทั้งหมดที่เหลือ (แผง)": "",
    } as SellEggsCSV;

    const accounting = {
      "วัน เดือน ปี": "",
      รายการ: "",
      รายรับ: "",
      "รายจ่าย ": "",
      คงเหลือ: "",
    } as AccountingCSV;

    return {
      collectEggs,
      sellEggs,
      accounting,
    };
  }

  function createDateRange(range: Moment[]): string[] {
    const [start, end] = range;

    const dates: string[] = [start.format("DD/MM/YYYY")];
    const d = start;

    while (d.isBefore(end)) {
      d.add(1, "d");
      dates.push(d.format("DD/MM/YYYY"));
    }

    return dates;
  }

  function getData(res: Response[]) {
    return res.map((e) => e.data);
  }

  function filtering(data: Response[], date_key: string, range: Moment[]) {
    const filter_data = data.filter((e) => {
      const date = moment(e.data[date_key], "DD/MM/YYYY") as Moment;
      const [start, end] = range;

      return date.isBetween(start, end, undefined, "[]");
    });

    return filter_data;
  }

  function calGroup(value: number) {
    return String(Math.floor(value / 30));
  }

  function toKg(gram: number | string) {
    if (typeof gram === "number") {
      return String(gram / 1000);
    } else {
      return String(Number(gram) / 1000);
    }
  }

  function createCollectEggCsv(e: {
    date: string;
    sum_eggs: SumSchema | undefined;
    acc_data: ResponseAcc | undefined;
    collect_eggs: EggSchema | undefined;
    food: FoodSchema | undefined;
    selling: SellingSchema | undefined;
  }): CollectEggsCSV {
    return {
      ...createHeader().collectEggs,
      "วัน เดือน ปี": e.date,
      "จำนวนไข่เบอร์ 0 (แผง)": calGroup(e.collect_eggs?.egg_number[0] || 0),
      "จำนวนไข่เบอร์ 0 สะสม (แผง)": calGroup(
        utils.sum([
          e.sum_eggs?.from_yesterday[0] || 0,
          e.sum_eggs?.sum_collect[0] || 0,
          -(e.sum_eggs?.sum_sell[0] || 0),
        ]),
      ),
      "จำนวนไข่เบอร์ 1 (แผง)": calGroup(e.collect_eggs?.egg_number[1] || 0),
      "จำนวนไข่เบอร์ 1 สะสม (แผง)": calGroup(
        utils.sum([
          e.sum_eggs?.from_yesterday[1] || 0,
          e.sum_eggs?.sum_collect[1] || 0,
          -(e.sum_eggs?.sum_sell[1] || 0),
        ]),
      ),
      "จำนวนไข่เบอร์ 2 (แผง)": calGroup(e.collect_eggs?.egg_number[2] || 0),
      "จำนวนไข่เบอร์ 2 สะสม (แผง)": calGroup(
        utils.sum([
          e.sum_eggs?.from_yesterday[2] || 0,
          e.sum_eggs?.sum_collect[2] || 0,
          -(e.sum_eggs?.sum_sell[2] || 0),
        ]),
      ),
      "จำนวนไข่เบอร์ 3 (แผง)": calGroup(e.collect_eggs?.egg_number[3] || 0),
      "จำนวนไข่เบอร์ 3 สะสม (แผง)": calGroup(
        utils.sum([
          e.sum_eggs?.from_yesterday[3] || 0,
          e.sum_eggs?.sum_collect[3] || 0,
          -(e.sum_eggs?.sum_sell[3] || 0),
        ]),
      ),
      "จำนวนไข่เบอร์ 4 (แผง)": calGroup(e.collect_eggs?.egg_number[4] || 0),
      "จำนวนไข่เบอร์ 4 สะสม (แผง)": calGroup(
        utils.sum([
          e.sum_eggs?.from_yesterday[4] || 0,
          e.sum_eggs?.sum_collect[4] || 0,
          -(e.sum_eggs?.sum_sell[4] || 0),
        ]),
      ),
      "จำนวนไข่แถว A (ฟอง)": String(e.collect_eggs?.amount.a || 0),
      "จำนวนไข่แถว B (ฟอง)": String(e.collect_eggs?.amount.b || 0),
      "จำนวนไข่แถว C (ฟอง)": String(e.collect_eggs?.amount.c || 0),
      "จำนวนไข่แถว D (ฟอง)": String(e.collect_eggs?.amount.d || 0),
      "น้ำหนักอาหารแถว A (กก.)": toKg(e.food?.weight.a || 0),
      "น้ำหนักอาหารแถว B (กก.)": toKg(e.food?.weight.b || 0),
      "น้ำหนักอาหารแถว C (กก.)": toKg(e.food?.weight.c || 0),
      "น้ำหนักอาหารแถว D (กก.)": toKg(e.food?.weight.d || 0),
      "น้ำหนักอาหารรวม (กก.)": toKg(
        utils.sum([
          e.food?.weight.a || 0,
          e.food?.weight.b || 0,
          e.food?.weight.c || 0,
          e.food?.weight.d || 0,
        ]),
      ),
      "น้ำหนักไข่รวม (กรัม)": String(e.collect_eggs?.weight_sum || 0),
      "น้ำหนักไข่เฉลี่ยต่อฟอง (กรัม)": String(e.collect_eggs?.weight_avg || 0),
      "จำนวนไข่คงเหลือ (ฟอง)": String(
        utils.sum([
          e.sum_eggs?.from_yesterday[0] || 0,
          e.sum_eggs?.sum_collect[0] || 0,
          -(e.sum_eggs?.sum_sell[0] || 0),
          e.sum_eggs?.from_yesterday[1] || 0,
          e.sum_eggs?.sum_collect[1] || 0,
          -(e.sum_eggs?.sum_sell[1] || 0),
          e.sum_eggs?.from_yesterday[2] || 0,
          e.sum_eggs?.sum_collect[2] || 0,
          -(e.sum_eggs?.sum_sell[2] || 0),
          e.sum_eggs?.from_yesterday[3] || 0,
          e.sum_eggs?.sum_collect[3] || 0,
          -(e.sum_eggs?.sum_sell[3] || 0),
          e.sum_eggs?.from_yesterday[4] || 0,
          e.sum_eggs?.sum_collect[4] || 0,
          -(e.sum_eggs?.sum_sell[4] || 0),
        ]),
      ),
      "จำนวนไข่รวม (ฟอง)": String(
        utils.sum([
          e.sum_eggs?.from_yesterday[0] || 0,
          e.sum_eggs?.sum_collect[0] || 0,
          e.sum_eggs?.from_yesterday[1] || 0,
          e.sum_eggs?.sum_collect[1] || 0,
          e.sum_eggs?.from_yesterday[2] || 0,
          e.sum_eggs?.sum_collect[2] || 0,
          e.sum_eggs?.from_yesterday[3] || 0,
          e.sum_eggs?.sum_collect[3] || 0,
          e.sum_eggs?.from_yesterday[4] || 0,
          e.sum_eggs?.sum_collect[4] || 0,
        ]),
      ),
      "จำนวนไข่รวม (แผง)": String(
        utils.sum([
          Number(calGroup(e.collect_eggs?.egg_number[0] || 0)),
          Number(calGroup(e.collect_eggs?.egg_number[1] || 0)),
          Number(calGroup(e.collect_eggs?.egg_number[2] || 0)),
          Number(calGroup(e.collect_eggs?.egg_number[3] || 0)),
          Number(calGroup(e.collect_eggs?.egg_number[4] || 0)),
        ]),
      ),
      "จำนวนไข่สะสม (แผง)": String(
        utils.sum([
          Number(
            calGroup(
              utils.sum([
                e.sum_eggs?.from_yesterday[0] || 0,
                e.sum_eggs?.sum_collect[0] || 0,
                -(e.sum_eggs?.sum_sell[0] || 0),
              ]),
            ),
          ),
          Number(
            calGroup(
              utils.sum([
                e.sum_eggs?.from_yesterday[1] || 0,
                e.sum_eggs?.sum_collect[1] || 0,
                -(e.sum_eggs?.sum_sell[1] || 0),
              ]),
            ),
          ),
          Number(
            calGroup(
              utils.sum([
                e.sum_eggs?.from_yesterday[2] || 0,
                e.sum_eggs?.sum_collect[2] || 0,
                -(e.sum_eggs?.sum_sell[2] || 0),
              ]),
            ),
          ),
          Number(
            calGroup(
              utils.sum([
                e.sum_eggs?.from_yesterday[3] || 0,
                e.sum_eggs?.sum_collect[3] || 0,
                -(e.sum_eggs?.sum_sell[3] || 0),
              ]),
            ),
          ),
          Number(
            calGroup(
              utils.sum([
                e.sum_eggs?.from_yesterday[4] || 0,
                e.sum_eggs?.sum_collect[4] || 0,
                -(e.sum_eggs?.sum_sell[4] || 0),
              ]),
            ),
          ),
        ]),
      ),
    };
  }

  function createSellEggsCsv(e: {
    date: string;
    sum_eggs: SumSchema | undefined;
    acc_data: ResponseAcc | undefined;
    collect_eggs: EggSchema | undefined;
    food: FoodSchema | undefined;
    selling: SellingSchema | undefined;
  }): SellEggsCSV {
    return {
      ...createHeader().sellEggs,
      "วัน เดือน ปี": e.date,
      "ขายไข่ทั้งหมด (บาท)": String(
        utils.sum([
          e.selling?.eggs[0].price || 0,
          e.selling?.eggs[1].price || 0,
          e.selling?.eggs[2].price || 0,
          e.selling?.eggs[3].price || 0,
          e.selling?.eggs[4].price || 0,
        ]),
      ),
      "ขายไข่ทั้งหมด (แผง)": String(
        utils.sum([
          e.selling?.eggs[0].amount || 0,
          e.selling?.eggs[1].amount || 0,
          e.selling?.eggs[2].amount || 0,
          e.selling?.eggs[3].amount || 0,
          e.selling?.eggs[4].amount || 0,
        ]),
      ),
      "ไข่ทั้งหมดที่เหลือ (แผง)": String(
        utils.sum([
          Number(
            calGroup(
              utils.sum([
                e.sum_eggs?.from_yesterday[0] || 0,
                e.sum_eggs?.sum_collect[0] || 0,
                -(e.sum_eggs?.sum_sell[0] || 0),
              ]),
            ),
          ),
          Number(
            calGroup(
              utils.sum([
                e.sum_eggs?.from_yesterday[1] || 0,
                e.sum_eggs?.sum_collect[1] || 0,
                -(e.sum_eggs?.sum_sell[1] || 0),
              ]),
            ),
          ),
          Number(
            calGroup(
              utils.sum([
                e.sum_eggs?.from_yesterday[2] || 0,
                e.sum_eggs?.sum_collect[2] || 0,
                -(e.sum_eggs?.sum_sell[2] || 0),
              ]),
            ),
          ),
          Number(
            calGroup(
              utils.sum([
                e.sum_eggs?.from_yesterday[3] || 0,
                e.sum_eggs?.sum_collect[3] || 0,
                -(e.sum_eggs?.sum_sell[3] || 0),
              ]),
            ),
          ),
          Number(
            calGroup(
              utils.sum([
                e.sum_eggs?.from_yesterday[4] || 0,
                e.sum_eggs?.sum_collect[4] || 0,
                -(e.sum_eggs?.sum_sell[4] || 0),
              ]),
            ),
          ),
        ]),
      ),
      "ขายไข่เบอร์ 0 (บาท)": String(e.selling?.eggs[0].price),
      "ขายไข่เบอร์ 0 (แผง)": String(e.selling?.eggs[0].amount),
      "ไข่เบอร์ 0 คงเหลือ (แผง)": calGroup(
        utils.sum([
          e.sum_eggs?.from_yesterday[0] || 0,
          e.sum_eggs?.sum_collect[0] || 0,
          -(e.sum_eggs?.sum_sell[0] || 0),
        ]),
      ),
      "ขายไข่เบอร์ 1 (บาท)": String(e.selling?.eggs[1].price),
      "ขายไข่เบอร์ 1 (แผง)": String(e.selling?.eggs[1].amount),
      "ไข่เบอร์ 1 คงเหลือ (แผง)": calGroup(
        utils.sum([
          e.sum_eggs?.from_yesterday[1] || 0,
          e.sum_eggs?.sum_collect[1] || 0,
          -(e.sum_eggs?.sum_sell[1] || 0),
        ]),
      ),
      "ขายไข่เบอร์ 2 (บาท)": String(e.selling?.eggs[2].price),
      "ขายไข่เบอร์ 2 (แผง)": String(e.selling?.eggs[2].amount),
      "ไข่เบอร์ 2 คงเหลือ (แผง)": calGroup(
        utils.sum([
          e.sum_eggs?.from_yesterday[2] || 0,
          e.sum_eggs?.sum_collect[2] || 0,
          -(e.sum_eggs?.sum_sell[2] || 0),
        ]),
      ),
      "ขายไข่เบอร์ 3 (บาท)": String(e.selling?.eggs[3].price),
      "ขายไข่เบอร์ 3 (แผง)": String(e.selling?.eggs[3].amount),
      "ไข่เบอร์ 3 คงเหลือ (แผง)": calGroup(
        utils.sum([
          e.sum_eggs?.from_yesterday[3] || 0,
          e.sum_eggs?.sum_collect[3] || 0,
          -(e.sum_eggs?.sum_sell[3] || 0),
        ]),
      ),
      "ขายไข่เบอร์ 4 (บาท)": String(e.selling?.eggs[4].price),
      "ขายไข่เบอร์ 4 (แผง)": String(e.selling?.eggs[4].amount),
      "ไข่เบอร์ 4 คงเหลือ (แผง)": calGroup(
        utils.sum([
          e.sum_eggs?.from_yesterday[4] || 0,
          e.sum_eggs?.sum_collect[4] || 0,
          -(e.sum_eggs?.sum_sell[4] || 0),
        ]),
      ),
    };
  }

  function createAccountingCsv(e: {
    date: string;
    sum_eggs: SumSchema | undefined;
    acc_data: ResponseAcc | undefined;
    collect_eggs: EggSchema | undefined;
    food: FoodSchema | undefined;
    selling: SellingSchema | undefined;
  }): AccountingCSV[] {
    const expense =
      e.acc_data?.expense.map((f) => ({
        title: f.value === "0" ? f.other : f.title,
        price: -f.price,
      })) || [];
    const receive =
      e.acc_data?.receive.map((f) => ({
        title: f.value === "0" ? f.other : f.title,
        price: f.price,
      })) || [];

    const items = [...expense, ...receive].flat();

    return items.map((f) => ({
      ...createHeader().accounting,
      "วัน เดือน ปี": e.date,
      รายการ: f.title,
      "รายจ่าย ": String(f.price < 0 ? -f.price : 0),
      รายรับ: String(f.price < 0 ? 0 : f.price),
      คงเหลือ: "",
    }));
  }

  function calAccSum(items: AccountingCSV[]): AccountingCSV[] {
    const sum: string[] = [];
    items.forEach((e, i) => {
      if (i === 0) {
        sum.push(
          String(utils.sum([Number(e["รายรับ"]), -Number(e["รายจ่าย "])])),
        );
      } else {
        sum.push(
          String(
            utils.sum([
              Number(e["รายรับ"]),
              -Number(e["รายจ่าย "]),
              Number(sum[i - 1]),
            ]),
          ),
        );
      }
    });

    return items.map((e, i) => ({ ...e, คงเหลือ: sum[i] }));
  }

  return {
    provide: {
      csv: {
        export: (
          accData: Response[],
          sumEggs: Response[],
          collectEggs: Response[],
          foods: Response[],
          sellgins: Response[],
          dateRange: Moment[],
        ) => {
          const acc_data = getData(filtering(accData, "date", dateRange));
          const sum_eggs = getData(
            filtering(sumEggs, "record_date", dateRange),
          );
          const collect_eggs = getData(
            filtering(collectEggs, "date", dateRange),
          );
          const food = getData(filtering(foods, "date", dateRange));
          const selling = getData(filtering(sellgins, "date", dateRange));

          const result = createDateRange(dateRange).map((e) => ({
            date: e,
            sum_eggs: sum_eggs.find((f) => f.record_date === e) as
              | SumSchema
              | undefined,
            acc_data: acc_data.find((f) => f.date === e) as
              | ResponseAcc
              | undefined,
            collect_eggs: collect_eggs.find((f) => f.date === e) as
              | EggSchema
              | undefined,
            food: food.find((f) => f.date === e) as FoodSchema | undefined,
            selling: selling.find((f) => f.date === e) as
              | SellingSchema
              | undefined,
          }));

          const accounting_result = result
            .map((e) => createAccountingCsv(e))
            .flat();

          const collect_eggs_csv = result.map((e) => createCollectEggCsv(e));
          const sell_eggs_csv = result.map((e) => createSellEggsCsv(e));
          const accounting_csv = calAccSum(accounting_result);

          const sheet_name = [
            "ข้อมูลการเก็บไข่-แยกไข่รายวัน",
            "ข้อมูลการขายไข่",
            "ข้อมูลรายรับ-รายจ่าย",
          ];

          return {
            sheet_name,
            data: {
              collect_eggs_csv,
              sell_eggs_csv,
              accounting_csv,
            },
          };
        },
      },
    },
  };
});
