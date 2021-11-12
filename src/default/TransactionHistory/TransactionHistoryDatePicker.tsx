import React from 'react';
import moment, { Moment } from 'moment';
import { Col, DatePicker, Form } from 'antd';

const { RangePicker } = DatePicker;

export type TransactionHistoryTimeRange = { start: Moment; end: Moment };
const dateFormat = 'YYYY-MM-DD';

export function TransactionHistoryDatePicker(props: {
  timeRange: TransactionHistoryTimeRange;
  onChange: (dates: [Moment | null, Moment | null] | null) => void;
}) {
  return (
    <Col span={16}>
      <Form layout="vertical">
        <Form.Item label="Select date range" name="range">
          <RangePicker
            value={[props.timeRange.start, props.timeRange.end]}
            defaultValue={[props.timeRange.start, props.timeRange.end]}
            onChange={(values) => props.onChange(values)}
            format={dateFormat}
            ranges={{
              Today: [moment(), moment()],
              'Last 7 days': [moment().startOf('day').subtract(7, 'days'), moment().endOf('day')],
              'Last 30 days': [moment().startOf('day').subtract(30, 'days'), moment().endOf('day')],
              'Last 90 days': [moment().startOf('day').subtract(90, 'days'), moment().endOf('day')],
              'This year': [moment().startOf('year'), moment()],
              'Last year': [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')],
            }}
          />
        </Form.Item>
      </Form>
    </Col>
  );
}
