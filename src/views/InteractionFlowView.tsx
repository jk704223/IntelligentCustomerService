import React, { useState, useRef } from 'react';

const InteractionFlowView: React.FC = () => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev * 1.2, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev / 1.2, 0.5));
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setStartDrag({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - startDrag.x,
        y: e.clientY - startDrag.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <div style={{ 
      height: '100vh', 
      padding: 24, 
      margin: 0, 
      overflow: 'auto',
      backgroundColor: '#f0f2f5',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{ 
        backgroundColor: '#fff', 
        borderRadius: 8, 
        padding: 24, 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        maxWidth: '100%',
        maxHeight: '90vh',
        width: '100%'
      }}>
        {/* 表格内容 */}
        <div style={{ 
          marginBottom: 24,
          overflowX: 'auto'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: 14
          }}>
            <thead>
              <tr style={{
                backgroundColor: '#f0f2f5',
                borderBottom: '2px solid #e8e8e8'
              }}>
                <th style={{
                  padding: '12px',
                  textAlign: 'left',
                  borderBottom: '1px solid #e8e8e8',
                  fontWeight: 'bold'
                }}>阶段</th>
                <th style={{
                  padding: '12px',
                  textAlign: 'left',
                  borderBottom: '1px solid #e8e8e8',
                  fontWeight: 'bold'
                }}>核心目标</th>
                <th style={{
                  padding: '12px',
                  textAlign: 'left',
                  borderBottom: '1px solid #e8e8e8',
                  fontWeight: 'bold'
                }}>关键任务与产出</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{
                borderBottom: '1px solid #e8e8e8'
              }}>
                <td style={{
                  padding: '12px',
                  borderBottom: '1px solid #e8e8e8',
                  fontWeight: '500'
                }}>阶段一：客服视角改造</td>
                <td style={{
                  padding: '12px',
                  borderBottom: '1px solid #e8e8e8'
                }}>构建辅助能力，验证核心价值，优化知识库。</td>
                <td style={{
                  padding: '12px',
                  borderBottom: '1px solid #e8e8e8'
                }}>
                  <div>任务：1. 对接大模型API；2. 开发客服侧"智能辅助"面板；3. 构建并优化基础知识库。</div>
                  <div>产出：可用的客服辅助工具、高频问题知识库。</div>
                </td>
              </tr>
              <tr style={{
                borderBottom: '1px solid #e8e8e8'
              }}>
                <td style={{
                  padding: '12px',
                  borderBottom: '1px solid #e8e8e8',
                  fontWeight: '500'
                }}>阶段二：客户视角改造与AB测试</td>
                <td style={{
                  padding: '12px',
                  borderBottom: '1px solid #e8e8e8'
                }}>实现机器人优先应答，通过小范围AB测试验证效果。</td>
                <td style={{
                  padding: '12px',
                  borderBottom: '1px solid #e8e8e8'
                }}>
                  <div>任务：1. 开发客户对话界面与机器人引擎；2. 实现"不满意时无缝转人工"流程；3. 在100家服务商内进行AB测试。</div>
                  <div>产出：线上测试系统、对比数据报告、优化后的对话流程。</div>
                </td>
              </tr>
              <tr style={{
                borderBottom: '1px solid #e8e8e8'
              }}>
                <td style={{
                  padding: '12px',
                  borderBottom: '1px solid #e8e8e8',
                  fontWeight: '500'
                }}>阶段三：运营视角接入与功能完善</td>
                <td style={{
                  padding: '12px',
                  borderBottom: '1px solid #e8e8e8'
                }}>实现全局管理，完善系统，建立数据驱动优化闭环。</td>
                <td style={{
                  padding: '12px',
                  borderBottom: '1px solid #e8e8e8'
                }}>
                  <div>任务：1. 开发运营监控数据看板；2. 实现全渠道接入与智能路由；3. 完成系统安全与合规性加固。</div>
                  <div>产出：功能完整的智能客服系统、持续优化机制。</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 控制按钮 */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center',
          marginBottom: 16,
          gap: 8
        }}>
          <button 
            onClick={handleZoomIn}
            style={{
              padding: '6px 12px',
              backgroundColor: '#1677ff',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: 12
            }}
          >
            放大
          </button>
          <button 
            onClick={handleZoomOut}
            style={{
              padding: '6px 12px',
              backgroundColor: '#1677ff',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: 12
            }}
          >
            缩小
          </button>
          <button 
            onClick={handleReset}
            style={{
              padding: '6px 12px',
              backgroundColor: '#666',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: 12
            }}
          >
            重置
          </button>
        </div>
        
        {/* 图片容器 */}
        <div 
          ref={containerRef}
          style={{
            position: 'relative',
            maxWidth: '100%',
            maxHeight: '70vh',
            overflow: 'auto',
            border: '1px solid #e8e8e8',
            borderRadius: 4,
            backgroundColor: '#fafafa',
            cursor: isDragging ? 'grabbing' : scale > 1 ? 'grab' : 'default'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          <div 
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              minHeight: 400,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <img 
              src="https://file-boss.boogcloud.com/NKB/3.png" 
              alt="客户售后交互流程" 
              style={{
                transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                transformOrigin: 'center center',
                transition: 'transform 0.2s ease',
                maxWidth: '100%',
                maxHeight: '100%',
                cursor: isDragging ? 'grabbing' : scale > 1 ? 'grab' : 'default'
              }}
            />
          </div>
        </div>
        
        {/* 提示信息 */}
        <div style={{ 
          marginTop: 16, 
          textAlign: 'center',
          fontSize: 14,
          color: '#666'
        }}>
          <p>提示：点击放大后可拖动图片查看不同部分</p>
        </div>
      </div>
    </div>
  );
};

export default InteractionFlowView;