import { Col, Form, Input, Radio, Row, Select } from 'antd';
import { useState } from 'react';
import addSearch from '../../assets/img/addSearch.png';
import { uid } from 'uid';
import { DeleteOutlined } from '@ant-design/icons';

interface ISearchCom {
  options: Array<{ label: string; value: string }>;
  form: any;
  typeName: string;
  type?: string;
}

const SearchCom = ({ options, form, typeName, type }: ISearchCom) => {
  const [properties, setProperties] = useState<any>([]);
  const [fields, setFields]: any = useState([]);
  return (
    <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>
      <Form form={form} initialValues={{ logicalOperator: 'and' }}>
        <Form.Item name={typeName} rules={[{ required: true }]}>
          <Select
            style={{ marginTop: '20px', width: '363px' }}
            placeholder="请选择类型"
            options={options}
            onChange={(v, option: any) => {
              setProperties(
                option.properties.map((item: any) => {
                  return {
                    label: item.propertyName,
                    value: item.propertyName,
                  };
                })
              );
            }}
          />
        </Form.Item>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '12px',
            marginBottom: '12px',
          }}
        >
          <div
            style={{
              fontSize: '14px',
              color: '#2A2A2A',
              marginBottom: '12px',
              fontWeight: type === 'head' ? 700 : 400,
            }}
          >
            查询条件
          </div>
          <div
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => {
              setFields((pre: any) => {
                return [...pre, { key: uid() }];
              });
            }}
          >
            <img
              src={addSearch}
              width={14}
              height={13}
              style={{ marginRight: '4px', flexShrink: 0 }}
            />
            <div style={{ color: '#305EBA', fontSize: '12px' }}>添加查询条件</div>
          </div>
        </div>

        {fields.length > 1 && (
          <Form.Item name="logicalOperator">
            <Radio.Group
              style={{ height: '36px' }}
              options={[
                {
                  label: '且',
                  value: 'and',
                },
                {
                  label: '或',
                  value: 'or',
                },
              ]}
            />
          </Form.Item>
        )}

        <div style={{ marginTop: '-12px' }}>
          {fields.map(({ key, name, id, ...restField }: any) => (
            <Row key={key} justify="space-between" align="middle" style={{ marginBottom: -14 }}>
              <Col>
                <Form.Item {...restField} name={`propertyKey-${key}`}>
                  <Select style={{ width: 123 }} placeholder="属性" options={properties} />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item {...restField} name={`operator-${key}`}>
                  <Select style={{ width: 83 }} placeholder="操作符" options={stringOperator} />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item {...restField} name={`propertyValue-${key}`}>
                  <Input style={{ width: 103 }} placeholder="值" />
                </Form.Item>
              </Col>
              <Col style={{ display: 'flex', alignItems: 'center' }}>
                <DeleteOutlined
                  style={{
                    fontSize: '14px',
                    color: '#888888',
                    marginTop: '-20px',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setFields((pre: any[]) => {
                      return pre.filter((item) => {
                        return item.key !== key;
                      });
                    });
                  }}
                />
              </Col>
            </Row>
          ))}
        </div>
      </Form>
    </div>
  );
};

export default SearchCom;

const stringOperator = [
  {
    label: '包含',
    value: 'like',
    text: '包含',
  },
  {
    label: '不包含',
    value: 'not like',
    text: '不包含',
  },
  {
    label: '等于',
    value: '=',
    text: '等于',
  },
  {
    label: '不等于',
    value: '!=',
    text: '不等于',
  },
  {
    label: '大于',
    value: '>',
    text: '大于',
  },
  {
    label: '小于',
    value: '<',
    text: '小于',
  },
  {
    label: '大于等于',
    value: '>=',
    text: '大于或等于',
  },
  {
    label: '小于等于',
    value: '<=',
    text: '小于或等于',
  },
];
