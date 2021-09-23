import React, { useState } from "react";
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
  Empty,
} from "antd";
import { Line } from "@ant-design/charts";
import { red, blue } from "@ant-design/colors";
import moment, { Moment } from "moment";
import { ArrowDownOutlined, CreditCardOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useApolloClient, useMutation, useQuery } from "@apollo/client";
import { GET_SELF, GET_TRANSACTIONS, LOGOUT } from "../graphql";
import { AccountOutput, TransactionOutput } from "../model";
const { Content, Footer } = Layout;
const { RangePicker } = DatePicker;

const dateFormat = "YYYY-MM-DD";
const dateTimeFormat = "YYYY-MM-DD HH:mm:ss";

export default function Overview(props: { account: AccountOutput }) {
  const client = useApolloClient();
  const [rangePickerValue, setRangePickerValue] = useState([
    moment().startOf("day").subtract(7, "days"),
    moment().endOf("day"),
  ] as [Moment | null, Moment | null] | null);

  const [logoutFunction, { data: logoutData }] = useMutation(LOGOUT);
  if (logoutData) {
    client.resetStore();
    client.refetchQueries({
      include: [GET_SELF],
    });
  }

  const { data: transactionRawData, loading: transactionLoading } = useQuery(
    GET_TRANSACTIONS,
    {
      variables: {
        accountId: props.account.id,
        transactionFilterFrom: rangePickerValue
          ? rangePickerValue[0]?.format(dateFormat)
          : "",
        transactionFilterTo: rangePickerValue
          ? rangePickerValue[1]?.format(dateFormat)
          : "",
      },
    }
  );

  const transactionData: TransactionOutput[] =
    (transactionRawData?.getTransactions ?? []).slice();
  transactionData.reverse();

  let spent = 0;
  for (let item of transactionData) {
    if (item.total < 0) {
      spent -= item.total;
    }
  }
  const diagramData: TransactionOutput[] = [];
  const tableData: TransactionOutput[] = [];
  for (let item of transactionData) {
    diagramData.push(item);
    tableData.push(item);
  }
  tableData.reverse();

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
      dataIndex: "total",
      key: "total",
      render: (value: number) => (value / 100).toFixed(2) + "€",
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
    yField: "afterCredit",
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
          return (value * 1.0 / 100).toFixed(2) + "€";
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
                  {(item.data.total * 1.0 / 100).toFixed(2)}€
                </span>
              </li>
              <li className="g2-tooltip-list-item" data-index="">
                <span className="g2-tooltip-marker"></span>
                <span className="g2-tooltip-name">Balance</span>:
                <span className="g2-tooltip-value">
                  {(item.data.afterCredit * 1.0 / 100).toFixed(2)}€
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
            <Link to="/admin/accounts">
              <Button key="admin" type="text">
                Open Management View
              </Button>
            </Link>,
            <Link to="/preferences">
              <Button key="preferences">Preferences</Button>
            </Link>,
            <Button
              key="logout"
              onClick={() => {
                logoutFunction();
                localStorage.removeItem("token");
              }}
            >
              Logout
            </Button>,
          ]}
        />
        <Content style={{ margin: "8px 16px 0", overflow: "initial" }}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Row gutter={12} align="middle">
              <Col span={12}>
                <Card>
                  <Statistic title="Name" value={props.account.name} />
                </Card>
              </Col>
              <Col span={12}>
                <Card>
                  <Statistic
                    title="Current balance"
                    value={(props.account.credit / 100).toFixed(2)}
                    prefix={<CreditCardOutlined />}
                    suffix="€"
                  />
                </Card>
              </Col>
            </Row>

            <Card loading={!!transactionLoading}>
              <Space size={32} direction="vertical" style={{ width: "100%" }}>
                <Row gutter={16} align="middle">
                  <Col span={16}>
                    <Form layout="vertical">
                      <Form.Item label="Select date range" name="range">
                        <RangePicker
                          value={rangePickerValue}
                          defaultValue={rangePickerValue}
                          onChange={(dates) => setRangePickerValue(dates)}
                          format={dateFormat}
                          ranges={{
                            Today: [moment(), moment()],
                            "Last 7 days": [
                              moment().startOf("day").subtract(7, "days"),
                              moment().endOf("day"),
                            ],
                            "Last 30 days": [
                              moment().startOf("day").subtract(30, "days"),
                              moment().endOf("day"),
                            ],
                            "Last 90 days": [
                              moment().startOf("day").subtract(90, "days"),
                              moment().endOf("day"),
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
                    {transactionData.length > 0 ? (
                      <>
                        <Statistic
                          title="Amount spent"
                          value={(spent / 100).toFixed(2)}
                          valueStyle={{ color: red[5] }}
                          prefix={<ArrowDownOutlined />}
                          suffix="€"
                        />
                      </>
                    ) : (
                      <></>
                    )}
                  </Col>
                </Row>

                {transactionData.length > 0 ? (
                  <>
                    <Line {...config} />
                    <Table
                      columns={columns}
                      dataSource={tableData}
                      pagination={false}
                    />
                  </>
                ) : (
                  <>
                    <Empty />
                  </>
                )}
              </Space>
            </Card>
          </Space>
        </Content>
        <Footer style={{ textAlign: "center" }}></Footer>
      </Layout>
    </div>
  );
}
