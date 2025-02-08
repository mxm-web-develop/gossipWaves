import { LoadingOutlined } from '@ant-design/icons';

function LoadingGraph() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'white',
      }}
    >
      <div
        style={{
          width: '118px',
          height: '40px',
          position: 'absolute',
          top: '24px',
          left: '50%',
          transform: 'translateX(-50%) translateY(-10%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
          borderRadius: '4px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        }}
      >
        <LoadingOutlined style={{ marginRight: '8px', color: '#2B69FF' }} />
        <div style={{ fontSize: '14px' }}>生成图谱中</div>
      </div>
    </div>
  );
}

export default LoadingGraph;
