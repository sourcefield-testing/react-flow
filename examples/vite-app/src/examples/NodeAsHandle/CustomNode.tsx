import { Handle, NodeProps, Position, ReactFlowState, useStore } from 'reactflow';
import styles from './customnode.module.css';

const connectionNodeIdSelector = (state: ReactFlowState) => state.connectionNodeId;

export default function CustomNode({ data, id, selected }: NodeProps) {
  const connectionNodeId = useStore(connectionNodeIdSelector);
  const isTarget = connectionNodeId && connectionNodeId !== id;

  const targetHandleStyle = { zIndex: isTarget ? 3 : 1 };

  return (
    <div className={styles.customNode}>
      <div className={styles.customNodeBody} style={{ borderStyle: isTarget ? 'dashed' : 'solid' }}>
        <Handle className={styles.sourceHandle} style={{ zIndex: 2 }} position={Position.Right} type="source" />
        <Handle className={styles.targetHandle} style={targetHandleStyle} position={Position.Left} type="target" />
        {data.label}
      </div>
    </div>
  );
}
