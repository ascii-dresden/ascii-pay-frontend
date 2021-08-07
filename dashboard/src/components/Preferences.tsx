import React from "react";
import "./Overview.scss";
import {
  Layout,
  Statistic,
  Card,
  Row,
  Col,
  Space,
  PageHeader,
  Button,
} from "antd";
import { useHistory } from "react-router-dom";
const { Content, Footer } = Layout;

export default function Preferences() {
  let history = useHistory();

  return (
    <div id="Preferences">
      <Layout className="site-layout">
        <PageHeader
          title="Preferences"
          onBack={() => history.goBack()}
          extra={[<Button key="logout">Logout</Button>]}
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
                  <Statistic title="Name" value="Max Mustermann" />
                </Card>
              </Col>
            </Row>
          </Space>
        </Content>
        <Footer style={{ textAlign: "center" }}></Footer>
      </Layout>
    </div>
  );
}
