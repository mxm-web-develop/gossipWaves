import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';
import CheckOutlined from '../../assets/img/CheckOutlined.png';
import { Empty, Tooltip } from 'antd';
import arrowLeft from '../../assets/img/arrowLeft.png';

const ItemSearchResult = ({ data, handleResult, setResult, resultType }: any) => {
  useEffect(() => {
    console.log('====================================');
    console.log(data, 12112);
    console.log('====================================');
  }, [data]);
  const getName = (item: any) => {
    return resultType === 'edge'
      ? item.src.properties?.name || item.nodeType
      : resultType === 'node'
      ? item?.data?.name
      : item.type === 'EDGE'
      ? item.src?.properties?.name
      : item.properties?.name || item.nodeType;
  };
  const getName2 = (item: any) => {
    return item.dst.properties?.name || item.nodeType;
  };

  const isEdge = (item: any) => {
    return resultType === 'edge' || item.type === 'EDGE';
  };
  return (
    <div style={{ padding: '12px 20px' }}>
      <div
        style={{ display: 'flex', marginBottom: '12px', cursor: 'pointer' }}
        onClick={() => {
          handleResult('back');
        }}
      >
        <ArrowLeft color="#2468F2" size={16} className="mr-[6px]" />
        <span style={{ color: '#2a2a2a', fontSize: '14px' }}>
          {resultType === 'node' ? '点' : resultType === 'edge' ? '边' : '语句'}查询结果
        </span>
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
              setResult((pre: any) => {
                return pre.map((i: any) => {
                  if (i.id === item.id) {
                    return { ...i, choosed: !i.choosed };
                  }
                  return i;
                });
              });
            }}
          >
            <div
              style={{
                display: 'flex',
                flex: 1,
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <IconCom str={getName(item).substr(0, 1) || ''} />
                {(isEdge(item) && getName(item).length > 4) ||
                (!isEdge(item) && getName(item).length > 18) ? (
                  <Tooltip
                    placement="topLeft"
                    title={getName(item)}
                    getPopupContainer={(triggerNode) => triggerNode.parentElement || document.body}
                  >
                    <>
                      <TextCom isEdge={isEdge} getName={getName} item={item} />
                    </>
                  </Tooltip>
                ) : (
                  <TextCom isEdge={isEdge} getName={getName} item={item} />
                )}
              </div>
              {(resultType === 'edge' || item.type === 'EDGE') && (
                <>
                  <img
                    src={arrowLeft}
                    width={12}
                    height={12}
                    style={{ flexShrink: 0, margin: '0 16px' }}
                  />
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                    }}
                  >
                    <IconCom str={getName2(item).substr(0, 1) || ''} />
                    {(isEdge(item) && getName2(item).length > 4) ||
                    (!isEdge(item) && getName2(item).length > 18) ? (
                      <Tooltip
                        placement="topLeft"
                        title={getName2(item)}
                        getPopupContainer={(triggerNode) =>
                          triggerNode.parentElement || document.body
                        }
                      >
                        <>
                          <TextCom isEdge={isEdge} getName={getName2} item={item} />
                        </>
                      </Tooltip>
                    ) : (
                      <TextCom isEdge={isEdge} getName={getName2} item={item} />
                    )}
                  </div>
                </>
              )}
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

const IconCom = ({ str }: { str: string }) => {
  return (
    <div
      style={{
        background: '#BD9CFF',
        width: '32px',
        height: '32px',
        borderRadius: '4px',
        fontSize: '20px',
        color: '#fff',
        lineHeight: '32px',
        textAlign: 'center',
      }}
    >
      {str}
    </div>
  );
};

const TextCom = ({ isEdge, getName, item }: any) => {
  return (
    <div
      style={{
        marginLeft: '12px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        color: '#2a2a2a',
        fontSize: '14px',
        width: isEdge(item) ? '60px' : '255px',
      }}
    >
      {getName(item)}
    </div>
  );
};
