import React from 'react';
import { Modal, Form, Input, Divider } from 'antd';
import { EditAccount } from './AccountList';
import { ApolloClient, useApolloClient } from '@apollo/client';
import { GET_ACCOUNT_ACCESS_TOKEN, TRANSACTION } from '../graphql';
import { getAccountAccessToken, getAccountAccessTokenVariables } from '../__generated__/getAccountAccessToken';
import { transaction, transactionVariables } from '../__generated__/transaction';
import { PaymentItemInput, StampType } from '../types/graphql-global';

async function payment(
  client: ApolloClient<object>,
  account: EditAccount,
  total: number,
  bottleStamps: number,
  coffeeStamps: number
) {
  try {
    let tokenResult = await client.mutate<getAccountAccessToken, getAccountAccessTokenVariables>({
      mutation: GET_ACCOUNT_ACCESS_TOKEN,
      variables: {
        id: account.id,
      },
    });

    if (tokenResult.errors || !tokenResult.data) {
      return false;
    } else {
      let token = tokenResult.data.getAccountAccessToken.token;

      let transactionItems: PaymentItemInput[] = [];

      if (total !== 0) {
        transactionItems.push({
          price: total,
          payWithStamps: StampType.NONE,
          couldBePaidWithStamps: StampType.NONE,
          giveStamps: StampType.NONE,
        });
      }
      if (bottleStamps !== 0) {
        transactionItems.push({
          price: 0,
          payWithStamps: StampType.NONE,
          couldBePaidWithStamps: StampType.NONE,
          giveStamps: StampType.BOTTLE,
        });
      }
      if (coffeeStamps !== 0) {
        transactionItems.push({
          price: 0,
          payWithStamps: StampType.NONE,
          couldBePaidWithStamps: StampType.NONE,
          giveStamps: StampType.COFFEE,
        });
      }

      const variables: transactionVariables = {
        accountAccessToken: token,
        stopIfStampPaymentIsPossible: false,
        transactionItems,
      };
      let transactionResult = await client.mutate<transaction, transactionVariables>({
        mutation: TRANSACTION,
        variables,
      });

      return !transactionResult.errors && transactionResult.data;
    }
  } catch (e) {
    console.error(e);
    return false;
  }
}

export default function AccountPaymentDialog(props: { account: EditAccount; closeDialog: () => void }) {
  const client = useApolloClient();
  const [paymentForm] = Form.useForm();

  const onPaymentCancel = () => {
    props.closeDialog();
  };
  const onPaymentSave = (form: any) => {
    (async () => {
      await payment(
        client,
        props.account,
        parseInt(form.total),
        parseInt(form.bottleStamps),
        parseInt(form.coffeeStamps)
      );
      props.closeDialog();
    })();
  };

  paymentForm.setFieldsValue({
    id: props.account.id,
    name: props.account.name,
    total: 0,
    bottleStamps: 0,
    coffeeStamps: 0,
  });

  return (
    <Modal
      title="Payment"
      visible={true}
      okText="Pay"
      cancelText="Cancel"
      onCancel={onPaymentCancel}
      onOk={() => {
        paymentForm
          .validateFields()
          .then((values) => {
            paymentForm.resetFields();
            onPaymentSave(values);
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form
        form={paymentForm}
        name="payment-account"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        className="account-payment-form"
        onFinish={onPaymentSave}
      >
        <Form.Item label="Id" name="id">
          <Input placeholder="Id" readOnly={true} />
        </Form.Item>
        <Form.Item label="Name" name="name">
          <Input placeholder="Name" readOnly={true} />
        </Form.Item>
        <Divider />
        <Form.Item label="Total" name="total">
          <Input suffix="cents" placeholder="Total" />
        </Form.Item>
        <Form.Item label="Bottle stamps" name="bottleStamps">
          <Input placeholder="Bottle stamps" />
        </Form.Item>
        <Form.Item label="Coffee stamps" name="coffeeStamps">
          <Input placeholder="Coffee stamps" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
