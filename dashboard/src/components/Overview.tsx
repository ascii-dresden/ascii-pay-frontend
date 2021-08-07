import React from "react";
import "./Overview.scss";
import {
  Layout,
  Form,
  DatePicker,
  Statistic,
  Card,
  Row,
  Col,
  Space,
  Tag,
  Table,
  PageHeader,
  Button,
} from "antd";
import { Line } from "@ant-design/charts";
import { red, blue } from "@ant-design/colors";
import moment from "moment";
import { ArrowDownOutlined, CreditCardOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
const { Content, Footer } = Layout;
const { RangePicker } = DatePicker;

const dateFormat = "YYYY-MM-DD";
const dateTimeFormat = "YYYY-MM-DD  HH:mm:ss";

const transactionData = [
  {
    transaction: {
      id: "6253bcc9-c7df-46d4-91c9-3021f1820cb4",
      account_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      cashier_id: null,
      total: 1850,
      before_credit: 0,
      after_credit: 1850,
      date: "2021-07-27T16:19:53.225617",
    },
    products: [],
  },
  {
    transaction: {
      id: "ea7ba4f7-3b79-4270-93eb-8b60716a8d2a",
      account_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      cashier_id: null,
      total: -250,
      before_credit: 1850,
      after_credit: 1600,
      date: "2021-07-27T16:20:07.637631",
    },
    products: [],
  },
  {
    transaction: {
      id: "42360718-6aad-4e22-9034-fa8fb3471447",
      account_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      cashier_id: null,
      total: -300,
      before_credit: 1600,
      after_credit: 1300,
      date: "2021-07-27T16:21:37.312867",
    },
    products: [
      {
        product_id: "129ca082-531b-46d0-ab55-dacb027e455e",
        product: {
          id: "129ca082-531b-46d0-ab55-dacb027e455e",
          name: "Kolle Mate",
          category: {
            id: "6ead8fbd-5ac6-4696-9dd1-338917b8ea75",
            name: "Kaltgetränke",
            prices: [],
            current_price: null,
          },
          image: "71039343-3eeb-42d9-a90c-67cc45847860.png",
          prices: [{ validity_start: "1900-01-01", value: 150 }],
          current_price: 150,
          barcode: null,
        },
        amount: 2,
        current_price: 300,
      },
    ],
  },
  {
    transaction: {
      id: "4646f53e-bcab-46a7-b458-49bd0af28228",
      account_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      cashier_id: null,
      total: -150,
      before_credit: 1300,
      after_credit: 1150,
      date: "2021-07-27T16:21:45.683723",
    },
    products: [
      {
        product_id: "129ca082-531b-46d0-ab55-dacb027e455e",
        product: {
          id: "129ca082-531b-46d0-ab55-dacb027e455e",
          name: "Kolle Mate",
          category: {
            id: "6ead8fbd-5ac6-4696-9dd1-338917b8ea75",
            name: "Kaltgetränke",
            prices: [],
            current_price: null,
          },
          image: "71039343-3eeb-42d9-a90c-67cc45847860.png",
          prices: [{ validity_start: "1900-01-01", value: 150 }],
          current_price: 150,
          barcode: null,
        },
        amount: 1,
        current_price: 150,
      },
    ],
  },
  {
    transaction: {
      id: "619200c3-6ec7-4f7e-9c15-02e7097a09b5",
      account_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      cashier_id: null,
      total: -300,
      before_credit: 1150,
      after_credit: 850,
      date: "2021-07-27T17:51:01.762908",
    },
    products: [
      {
        product_id: "129ca082-531b-46d0-ab55-dacb027e455e",
        product: {
          id: "129ca082-531b-46d0-ab55-dacb027e455e",
          name: "Kolle Mate",
          category: {
            id: "6ead8fbd-5ac6-4696-9dd1-338917b8ea75",
            name: "Kaltgetränke",
            prices: [],
            current_price: null,
          },
          image: "71039343-3eeb-42d9-a90c-67cc45847860.png",
          prices: [{ validity_start: "1900-01-01", value: 150 }],
          current_price: 150,
          barcode: null,
        },
        amount: 2,
        current_price: 300,
      },
    ],
  },
  {
    transaction: {
      id: "ab228e38-350e-448b-ad48-c9f74e0fc066",
      account_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      cashier_id: null,
      total: 1500,
      before_credit: 850,
      after_credit: 2350,
      date: "2021-07-27T18:11:55.586920",
    },
    products: [],
  },
  {
    transaction: {
      id: "b97b4567-f781-4555-b885-7595bef551d2",
      account_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      cashier_id: null,
      total: -180,
      before_credit: 2350,
      after_credit: 2170,
      date: "2021-07-28T07:57:30.275770",
    },
    products: [
      {
        product_id: "129ca082-531b-46d0-ab55-dacb027e455e",
        product: {
          id: "129ca082-531b-46d0-ab55-dacb027e455e",
          name: "Kolle Mate",
          category: {
            id: "6ead8fbd-5ac6-4696-9dd1-338917b8ea75",
            name: "Kaltgetränke",
            prices: [],
            current_price: null,
          },
          image: "71039343-3eeb-42d9-a90c-67cc45847860.png",
          prices: [{ validity_start: "1900-01-01", value: 150 }],
          current_price: 150,
          barcode: null,
        },
        amount: 1,
        current_price: 150,
      },
      {
        product_id: "3fddeb1b-c957-4d2a-8270-0f48e09ac82b",
        product: {
          id: "3fddeb1b-c957-4d2a-8270-0f48e09ac82b",
          name: "Duplo",
          category: null,
          image: null,
          prices: [{ validity_start: "1900-01-01", value: 30 }],
          current_price: 30,
          barcode: null,
        },
        amount: 1,
        current_price: 30,
      },
    ],
  },
  {
    transaction: {
      id: "3ac6ed7a-6da8-4d46-8ee9-0d8e85522ed8",
      account_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      cashier_id: null,
      total: -150,
      before_credit: 2170,
      after_credit: 2020,
      date: "2021-07-28T10:15:41.996504",
    },
    products: [],
  },
  {
    transaction: {
      id: "ce210307-b750-49ca-a0d8-49aee3d616d0",
      account_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      cashier_id: null,
      total: -250,
      before_credit: 2020,
      after_credit: 1770,
      date: "2021-07-30T15:29:40.274735",
    },
    products: [],
  },
  {
    transaction: {
      id: "b72698f0-aeee-4c9b-bc89-28c20ac9b114",
      account_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      cashier_id: null,
      total: -550,
      before_credit: 1770,
      after_credit: 1220,
      date: "2021-07-30T15:29:46.811978",
    },
    products: [
      {
        product_id: "129ca082-531b-46d0-ab55-dacb027e455e",
        product: {
          id: "129ca082-531b-46d0-ab55-dacb027e455e",
          name: "Kolle Mate",
          category: {
            id: "6ead8fbd-5ac6-4696-9dd1-338917b8ea75",
            name: "Kaltgetränke",
            prices: [],
            current_price: null,
          },
          image: "71039343-3eeb-42d9-a90c-67cc45847860.png",
          prices: [{ validity_start: "1900-01-01", value: 150 }],
          current_price: 150,
          barcode: null,
        },
        amount: 1,
        current_price: 150,
      },
      {
        product_id: "3212f2ea-278a-46fd-89ec-c3017d61949b",
        product: {
          id: "3212f2ea-278a-46fd-89ec-c3017d61949b",
          name: "Premium Cola",
          category: {
            id: "6ead8fbd-5ac6-4696-9dd1-338917b8ea75",
            name: "Kaltgetränke",
            prices: [],
            current_price: null,
          },
          image: "fdce716c-f572-47b6-8e9e-867741c3329b.png",
          prices: [{ validity_start: "1900-01-01", value: 150 }],
          current_price: 150,
          barcode: null,
        },
        amount: 1,
        current_price: 150,
      },
    ],
  },
  {
    transaction: {
      id: "99535777-31ad-44ba-86ba-a2392f030957",
      account_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      cashier_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      total: -150,
      before_credit: 1220,
      after_credit: 1070,
      date: "2021-08-04T10:13:07.781540",
    },
    products: [],
  },
  {
    transaction: {
      id: "0246d186-6908-499d-8145-a0f0a115f296",
      account_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      cashier_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      total: -150,
      before_credit: 1070,
      after_credit: 920,
      date: "2021-08-04T11:02:42.077569",
    },
    products: [],
  },
  {
    transaction: {
      id: "6d20c7f7-71d8-451d-9117-fd8d1a1281d3",
      account_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      cashier_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      total: 150,
      before_credit: 920,
      after_credit: 1070,
      date: "2021-08-04T11:34:56.569700",
    },
    products: [],
  },
  {
    transaction: {
      id: "774047f9-8e20-48e5-96fd-0edea9217a18",
      account_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      cashier_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      total: -150,
      before_credit: 1070,
      after_credit: 920,
      date: "2021-08-04T13:02:23.734670",
    },
    products: [],
  },
  {
    transaction: {
      id: "5d078145-8e82-4f56-9486-00f6684bf648",
      account_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      cashier_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      total: 100,
      before_credit: 920,
      after_credit: 1020,
      date: "2021-08-04T18:06:18.086738",
    },
    products: [],
  },
  {
    transaction: {
      id: "bc282fb3-e99a-4290-b2af-a1aff0f6b1ed",
      account_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      cashier_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      total: 100,
      before_credit: 1020,
      after_credit: 1120,
      date: "2021-08-04T18:27:45.955024",
    },
    products: [],
  },
  {
    transaction: {
      id: "dcf52395-7e70-415e-9fc0-fe735c0d3f4d",
      account_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      cashier_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      total: 100,
      before_credit: 1120,
      after_credit: 1220,
      date: "2021-08-04T19:30:57.431794",
    },
    products: [],
  },
  {
    transaction: {
      id: "f6b71eb8-d242-44de-8d4f-2ddd7ef8e493",
      account_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      cashier_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      total: 100,
      before_credit: 1220,
      after_credit: 1320,
      date: "2021-08-04T19:44:47.864308",
    },
    products: [],
  },
  {
    transaction: {
      id: "6d339119-1149-4efd-8ee5-9500fdfafdbc",
      account_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      cashier_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      total: 100,
      before_credit: 1320,
      after_credit: 1420,
      date: "2021-08-04T20:06:42.630684",
    },
    products: [],
  },
  {
    transaction: {
      id: "d36cf308-c991-44a6-b0d7-c0923a00dbbe",
      account_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      cashier_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      total: -419,
      before_credit: 1420,
      after_credit: 1001,
      date: "2021-08-04T20:48:48.952764",
    },
    products: [],
  },
  {
    transaction: {
      id: "c7d956a5-699d-4866-b8ff-88b9b7aca185",
      account_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      cashier_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      total: 99,
      before_credit: 1001,
      after_credit: 1100,
      date: "2021-08-04T20:50:44.670867",
    },
    products: [],
  },
  {
    transaction: {
      id: "c4793c02-3faf-4253-a71f-a5507ed12a76",
      account_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      cashier_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      total: 100,
      before_credit: 1100,
      after_credit: 1200,
      date: "2021-08-04T21:06:44.046045",
    },
    products: [],
  },
  {
    transaction: {
      id: "5994f885-bab5-422a-89e2-e3a3aa3363d9",
      account_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      cashier_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      total: 100,
      before_credit: 1200,
      after_credit: 1300,
      date: "2021-08-04T21:07:12.082541",
    },
    products: [],
  },
  {
    transaction: {
      id: "00ef5c33-c56d-4a37-ab84-aaf629be2774",
      account_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      cashier_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      total: -419,
      before_credit: 1300,
      after_credit: 881,
      date: "2021-08-04T21:14:04.143406",
    },
    products: [],
  },
  {
    transaction: {
      id: "61e23755-aacc-46f0-a3de-6bb47c03e2ce",
      account_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      cashier_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      total: -421,
      before_credit: 881,
      after_credit: 460,
      date: "2021-08-04T21:14:12.529304",
    },
    products: [],
  },
  {
    transaction: {
      id: "1d52ad55-b5e1-46da-9d74-5853c247147e",
      account_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      cashier_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      total: 419,
      before_credit: 460,
      after_credit: 879,
      date: "2021-08-04T21:14:20.129288",
    },
    products: [],
  },
  {
    transaction: {
      id: "53f4f4f5-ae6b-46a6-98d9-74c2c212ca3b",
      account_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      cashier_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      total: 419,
      before_credit: 879,
      after_credit: 1298,
      date: "2021-08-04T21:14:58.819413",
    },
    products: [],
  },
  {
    transaction: {
      id: "fc33130d-c1ae-473b-a56b-ad306b9b3774",
      account_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      cashier_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      total: 100,
      before_credit: 1298,
      after_credit: 1398,
      date: "2021-08-04T21:22:08.530478",
    },
    products: [],
  },
  {
    transaction: {
      id: "994bf967-9a10-48cc-aa49-610e731e328c",
      account_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      cashier_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      total: 2,
      before_credit: 1398,
      after_credit: 1400,
      date: "2021-08-04T21:22:50.274093",
    },
    products: [],
  },
  {
    transaction: {
      id: "6f70cdd3-8bb0-4428-9f51-6520b31c8db6",
      account_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      cashier_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      total: 100,
      before_credit: 1400,
      after_credit: 1500,
      date: "2021-08-04T21:27:30.018769",
    },
    products: [],
  },
  {
    transaction: {
      id: "18ffcfec-0dbd-4d53-af7e-5bd300c01433",
      account_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      cashier_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      total: 100,
      before_credit: 1500,
      after_credit: 1600,
      date: "2021-08-04T21:37:58.211686",
    },
    products: [],
  },
  {
    transaction: {
      id: "128bd329-e771-4727-a319-75e50a5bb411",
      account_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      cashier_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      total: 100,
      before_credit: 1600,
      after_credit: 1700,
      date: "2021-08-04T21:39:15.225779",
    },
    products: [],
  },
  {
    transaction: {
      id: "94dde9e2-ae1f-4f62-93f7-5e3d6ba47f32",
      account_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      cashier_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      total: 100,
      before_credit: 1700,
      after_credit: 1800,
      date: "2021-08-04T22:00:34.092409",
    },
    products: [],
  },
  {
    transaction: {
      id: "bb73674d-7c47-4ff6-8af3-1202ae06a7d7",
      account_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      cashier_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      total: -800,
      before_credit: 1800,
      after_credit: 1000,
      date: "2021-08-04T22:01:26.321693",
    },
    products: [],
  },
  {
    transaction: {
      id: "fb19b089-5aa5-483c-b21d-c512d627c80f",
      account_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      cashier_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      total: 200,
      before_credit: 1000,
      after_credit: 1200,
      date: "2021-08-04T22:11:46.398278",
    },
    products: [],
  },
  {
    transaction: {
      id: "318d27e4-946c-4c50-9c3f-2fc54154ed6b",
      account_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      cashier_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      total: 500,
      before_credit: 1200,
      after_credit: 1700,
      date: "2021-08-04T22:17:04.138409",
    },
    products: [],
  },
  {
    transaction: {
      id: "da65409a-ba1a-480c-a512-eefbae53bcc8",
      account_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      cashier_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      total: 100,
      before_credit: 1700,
      after_credit: 1800,
      date: "2021-08-05T07:39:47.596176",
    },
    products: [],
  },
  {
    transaction: {
      id: "e05d0538-8809-4b57-a0f8-d50e3096dfc3",
      account_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      cashier_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      total: 100,
      before_credit: 1800,
      after_credit: 1900,
      date: "2021-08-05T08:22:22.106179",
    },
    products: [],
  },
  {
    transaction: {
      id: "85efa858-8bf5-4042-b388-8838ff11ae5c",
      account_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      cashier_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      total: -1000,
      before_credit: 1900,
      after_credit: 900,
      date: "2021-08-05T08:26:21.408482",
    },
    products: [],
  },
  {
    transaction: {
      id: "26a7873e-14c4-4060-9760-e73af3ab98ed",
      account_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      cashier_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      total: 100,
      before_credit: 900,
      after_credit: 1000,
      date: "2021-08-05T08:29:13.509382",
    },
    products: [],
  },
  {
    transaction: {
      id: "45707525-b369-444d-a2ca-8c34137f2118",
      account_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      cashier_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      total: 500,
      before_credit: 1000,
      after_credit: 1500,
      date: "2021-08-05T08:30:50.444642",
    },
    products: [],
  },
  {
    transaction: {
      id: "e36a1fee-70b9-4b2a-ac32-443f174177f5",
      account_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      cashier_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      total: 100,
      before_credit: 1500,
      after_credit: 1600,
      date: "2021-08-05T12:05:30.167722",
    },
    products: [],
  },
  {
    transaction: {
      id: "dd4bf1ef-1970-4a39-980d-0beb3ed8c702",
      account_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      cashier_id: "585ab55c-fdcc-44d1-b9cb-b102d37b5695",
      total: -100,
      before_credit: 1600,
      after_credit: 1500,
      date: "2021-08-06T09:02:47.285375",
    },
    products: [],
  },
];

export default function Overview() {
  transactionData.reverse();
  const diagramData: any[] = [];

  let balance = 0;
  let spent = 0;
  for (let item of transactionData) {
    let oldBalance = balance;
    balance += item.transaction.total;
    if (item.transaction.total < 0) {
      spent -= item.transaction.total;
    }
    diagramData.push({
      date: item.transaction.date,
      price: item.transaction.total / 100,
      oldBalance: oldBalance / 100,
      balance: balance / 100,
      products: item.products,
    });
  }

  const tableData: any[] = [];
  for (let item of diagramData) {
    tableData.push(item);
  }

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (value: string) => moment(value).format(dateTimeFormat),
      sorter: (a: any, b: any) =>
        moment(a.date).valueOf() - moment(b.date).valueOf(),
      sortDirections: ["ascend", "descend"] as ("descend" | "ascend" | null)[],
    },
    {
      title: "Products",
      dataIndex: "products",
      key: "products",
      render: (value: any[]) => (
        <>
          {value.map((p) => (
            <Tag key={p.product_id}>
              {p.amount} × {p.product.name}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: "Total",
      dataIndex: "price",
      key: "price",
      render: (value: number) => value.toFixed(2) + "€",
    },
    {
      title: "Action",
      render: (text: any, record: any) => <Button type="link">Details</Button>,
    },
  ];

  const config = {
    data: diagramData,
    height: 300,
    xField: "date",
    yField: "balance",
    color: blue[5],
    stepType: "hv",
    annotations: [
      {
        type: "regionFilter",
        start: ["min", "min"] as [number | string, number | string],
        end: ["max", "0"] as [number | string, number | string],
        color: red[5],
      },
    ],
    xAxis: {
      label: {
        formatter: (value: any) => {
          return moment(value).format(dateFormat);
        },
      },
    },
    yAxis: {
      label: {
        formatter: (value: any) => {
          return (value * 1.0).toFixed(2) + "€";
        },
      },
    },
    tooltip: {
      customContent: (title: string, items: any) => {
        if (items.length <= 0) {
          return (<></>) as unknown as HTMLElement;
        }
        let item = items[0];
        return (
          <>
            <div className="g2-tooltip-title">
              {moment(title).format(dateTimeFormat)}
            </div>
            <ul className="g2-tooltip-list">
              <li className="g2-tooltip-list-item" data-index="">
                <span
                  className="g2-tooltip-marker"
                  style={{ backgroundColor: item.color }}
                ></span>
                <span className="g2-tooltip-name">Price</span>:
                <span className="g2-tooltip-value">
                  {(item.data.price * 1.0).toFixed(2)}€
                </span>
              </li>
              <li className="g2-tooltip-list-item" data-index="">
                <span className="g2-tooltip-marker"></span>
                <span className="g2-tooltip-name">Balance</span>:
                <span className="g2-tooltip-value">
                  {(item.data.balance * 1.0).toFixed(2)}€
                </span>
              </li>
            </ul>
          </>
        ) as unknown as HTMLElement;
      },
    },
  };

  return (
    <div id="Overview">
      <Layout className="site-layout">
        <PageHeader
          title="Overview"
          extra={[
            <Button key="admin" type="text">
              Open Management View
            </Button>,
            <Link to="/preferences">
              <Button key="preferences">Preferences</Button>
            </Link>,
            <Button key="logout">Logout</Button>,
          ]}
        />
        <Content style={{ margin: "8px 16px 0", overflow: "initial" }}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Row gutter={12} align="middle">
              <Col span={12}>
                <Card>
                  <Statistic title="Name" value="Max Mustermann" />
                </Card>
              </Col>
              <Col span={12}>
                <Card>
                  <Statistic
                    title="Current balance"
                    value={balance / 100}
                    precision={2}
                    prefix={<CreditCardOutlined />}
                    suffix="€"
                  />
                </Card>
              </Col>
            </Row>

            <Card>
              <Space size={32} direction="vertical" style={{ width: "100%" }}>
                <Row gutter={16} align="middle">
                  <Col span={16}>
                    <Form layout="vertical">
                      <Form.Item label="Select date range" name="range">
                        <RangePicker
                          defaultValue={[
                            moment().subtract(7, "days"),
                            moment(),
                          ]}
                          format={dateFormat}
                          ranges={{
                            Today: [moment(), moment()],
                            "Last 7 days": [
                              moment().subtract(7, "days"),
                              moment(),
                            ],
                            "Last 30 days": [
                              moment().subtract(30, "days"),
                              moment(),
                            ],
                            "Last 90 days": [
                              moment().subtract(90, "days"),
                              moment(),
                            ],
                            "This year": [moment().startOf("year"), moment()],
                            "Last year": [
                              moment().subtract(1, "year").startOf("year"),
                              moment().subtract(1, "year").endOf("year"),
                            ],
                          }}
                        />
                      </Form.Item>
                    </Form>
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="Amount spent"
                      value={spent / 100}
                      valueStyle={{ color: red[5] }}
                      prefix={<ArrowDownOutlined />}
                      suffix="€"
                    />
                  </Col>
                </Row>

                <Line {...config} />
                <Table
                  columns={columns}
                  dataSource={tableData}
                  pagination={false}
                />
              </Space>
            </Card>
          </Space>
        </Content>
        <Footer style={{ textAlign: "center" }}></Footer>
      </Layout>
    </div>
  );
}
