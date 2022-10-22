/**
 * The user selection rectangle gets displayed when a user drags the mouse while pressing shift
 */

import { memo, useState, useRef } from 'react';
import shallow from 'zustand/shallow';

import { useStore, useStoreApi } from '../../hooks/useStore';
import { getSelectionChanges } from '../../utils/changes';
import { getConnectedEdges, getNodesInside } from '../../utils/graph';
import type { XYPosition, ReactFlowState, NodeChange, EdgeChange, Rect } from '../../types';

type SelectionRect = Rect & {
  startX: number;
  startY: number;
};

type EventHandlers = { [key: string]: React.MouseEventHandler | React.WheelEventHandler | undefined };

type UserSelectionProps = {
  isSelectionMode: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  onWheel?: (e: React.WheelEvent) => void;
  children: React.ReactNode;
};

function getMousePosition(event: React.MouseEvent, containerBounds: DOMRect): XYPosition {
  return {
    x: event.clientX - containerBounds.left,
    y: event.clientY - containerBounds.top,
  };
}

const wrapHandler = (
  handler: React.MouseEventHandler | undefined,
  containerRef: React.MutableRefObject<HTMLDivElement | null>
): React.MouseEventHandler => {
  return (event: React.MouseEvent) => {
    if (event.target !== containerRef.current) {
      return;
    }
    handler?.(event);
  };
};

const wrapHandlers = (
  handlers: EventHandlers,
  containerRef: React.MutableRefObject<HTMLDivElement | null>
): EventHandlers =>
  Object.keys(handlers).reduce((hls, key) => ({ ...hls, [key]: wrapHandler(handlers[key], containerRef) }), {});

const selector = (s: ReactFlowState) => ({
  userSelectionActive: s.userSelectionActive,
  elementsSelectable: s.elementsSelectable,
});

const UserSelection = memo(({ isSelectionMode, onClick, onContextMenu, onWheel, children }: UserSelectionProps) => {
  const container = useRef<HTMLDivElement | null>(null);
  const store = useStoreApi();
  const prevSelectedNodesCount = useRef<number>(0);
  const prevSelectedEdgesCount = useRef<number>(0);
  const containerBounds = useRef<DOMRect>();
  const [userSelectionRect, setUserSelectionRect] = useState<SelectionRect | null>(null);
  const { userSelectionActive, elementsSelectable } = useStore(selector, shallow);

  const resetUserSelection = () => {
    setUserSelectionRect(null);

    store.setState({ userSelectionActive: false });

    prevSelectedNodesCount.current = 0;
    prevSelectedEdgesCount.current = 0;
  };

  const onMouseDown = (event: React.MouseEvent): void => {
    if (!elementsSelectable || !isSelectionMode || event.button !== 0 || event.target !== container.current) {
      return;
    }

    store.getState().resetSelectedElements();

    const reactFlowNode = (event.target as Element).closest('.react-flow')!;
    containerBounds.current = reactFlowNode.getBoundingClientRect();

    const mousePos = getMousePosition(event, containerBounds.current!);

    setUserSelectionRect({
      width: 0,
      height: 0,
      startX: mousePos.x,
      startY: mousePos.y,
      x: mousePos.x,
      y: mousePos.y,
    });
  };

  const onMouseMove = (event: React.MouseEvent): void => {
    if (!isSelectionMode || !containerBounds.current || !userSelectionRect || event.target !== container.current) {
      return;
    }

    store.setState({ userSelectionActive: true, nodesSelectionActive: false });

    const mousePos = getMousePosition(event, containerBounds.current!);
    const startX = userSelectionRect.startX ?? 0;
    const startY = userSelectionRect.startY ?? 0;

    const nextUserSelectRect = {
      ...userSelectionRect,
      x: mousePos.x < startX ? mousePos.x : startX,
      y: mousePos.y < startY ? mousePos.y : startY,
      width: Math.abs(mousePos.x - startX),
      height: Math.abs(mousePos.y - startY),
      draw: true,
    };

    const { nodeInternals, edges, transform, onNodesChange, onEdgesChange } = store.getState();
    const nodes = Array.from(nodeInternals.values());
    const selectedNodes = getNodesInside(nodeInternals, nextUserSelectRect, transform, false, true);
    const selectedEdgeIds = getConnectedEdges(selectedNodes, edges).map((e) => e.id);
    const selectedNodeIds = selectedNodes.map((n) => n.id);

    if (prevSelectedNodesCount.current !== selectedNodeIds.length) {
      prevSelectedNodesCount.current = selectedNodeIds.length;
      const changes = getSelectionChanges(nodes, selectedNodeIds) as NodeChange[];
      if (changes.length) {
        onNodesChange?.(changes);
      }
    }

    if (prevSelectedEdgesCount.current !== selectedEdgeIds.length) {
      prevSelectedEdgesCount.current = selectedEdgeIds.length;
      const changes = getSelectionChanges(edges, selectedEdgeIds) as EdgeChange[];
      if (changes.length) {
        onEdgesChange?.(changes);
      }
    }

    setUserSelectionRect(nextUserSelectRect);
  };

  const onMouseUp = (event: React.MouseEvent) => {
    // We only want to trigger click functions when in selection mode if
    // the user did not move the mouse.
    if (!userSelectionActive && userSelectionRect && event.target === container.current) {
      onClick?.(event);
    }

    store.setState({ nodesSelectionActive: prevSelectedNodesCount.current > 0 });

    resetUserSelection();
  };

  const onMouseLeave = () => {
    if (userSelectionActive) {
      store.setState({ nodesSelectionActive: prevSelectedNodesCount.current > 0 });
    }
    resetUserSelection();
  };

  const eventHandlers =
    elementsSelectable && (isSelectionMode || userSelectionActive)
      ? {
          ...wrapHandlers({ onContextMenu, onWheel }, container),
          onMouseDown,
          onMouseMove,
          onMouseUp,
          onMouseLeave,
        }
      : wrapHandlers(
          {
            onClick,
            onContextMenu,
            onWheel,
          },
          container
        );

  return (
    <div className="react-flow__selectionpane react-flow__container" {...eventHandlers} ref={container}>
      {children}
      {userSelectionActive && userSelectionRect && (
        <div
          className="react-flow__selection react-flow__container"
          style={{
            width: userSelectionRect.width,
            height: userSelectionRect.height,
            transform: `translate(${userSelectionRect.x}px, ${userSelectionRect.y}px)`,
          }}
        />
      )}
    </div>
  );
});

UserSelection.displayName = 'UserSelection';

export default UserSelection;
