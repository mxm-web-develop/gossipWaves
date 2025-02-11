import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';
import CheckOutlined from '../../assets/img/CheckOutlined.png';
import { Empty } from 'antd';
const ItemSearchResult = ({ data, handleResult, setNodeResult }: any) => {
  useEffect(() => {
    console.log('====================================');
    console.log(data);
    console.log('====================================');
  }, [data]);
  return (
    <div style={{ padding: '12px 20px' }}>
      <div
        style={{ display: 'flex', marginBottom: '12px', cursor: 'pointer' }}
        onClick={() => {
          handleResult('back');
        }}
      >
        <ArrowLeft color="#2468F2" size={16} className="mr-[6px]" />
        <span style={{ color: '#2a2a2a', fontSize: '14px' }}>点查询结果</span>
      </div>
      {(data || []).map((item: any, index: number) => {
        return (
          <div
            key={index}
            style={{
              border: '1px solid #EEEEEE',
              height: '48px',
              marginTop: '8px',
              borderRadius: '4px',
              padding: '0 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              backgroundColor: item.choosed ? '#F1F5FF' : '#fff',
            }}
            onClick={() => {
              setNodeResult((pre: any) => {
                return pre.map((i: any) => {
                  if (i.id === item.id) {
                    return { ...i, choosed: !i.choosed };
                  }
                  return i;
                });
              });
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  background: '#DBBDA0',
                  width: '32px',
                  height: '32px',
                  borderRadius: '4px',
                  fontSize: '20px',
                  color: '#fff',
                  lineHeight: '32px',
                  textAlign: 'center',
                }}
              >
                {item.category ? item.category.substr(0, 1) : '圆'}
              </div>
              <div
                style={{
                  width: '255px',
                  marginLeft: '12px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  color: '#2a2a2a',
                  fontSize: '14px',
                }}
              >
                {item?.data?.name}
              </div>
            </div>
            {item.choosed && <img src={CheckOutlined} width={20} height={20} />}
          </div>
        );
      })}
      {!data?.length && <Empty />}
    </div>
  );
};

export default ItemSearchResult;
