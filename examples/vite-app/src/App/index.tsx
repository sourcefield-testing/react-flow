import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import Basic from '../examples/Basic';
import Backgrounds from '../examples/Backgrounds';
import ControlledUncontrolled from '../examples/ControlledUncontrolled';
import CustomConnectionLine from '../examples/CustomConnectionLine';
import CustomNode from '../examples/CustomNode';
import DefaultNodes from '../examples/DefaultNodes';
import DragHandle from '../examples/DragHandle';
import DragNDrop from '../examples/DragNDrop';
import Edges from '../examples/Edges';
import EdgeTypes from '../examples/EdgeTypes';
import Empty from '../examples/Empty';
import Figma from '../examples/Figma';
import FloatingEdges from '../examples/FloatingEdges';
import Hidden from '../examples/Hidden';
import Interaction from '../examples/Interaction';
import Layouting from '../examples/Layouting';
import MultiFlows from '../examples/MultiFlows';
import NestedNodes from '../examples/NestedNodes';
import NodeTypeChange from '../examples/NodeTypeChange';
import NodeTypesObjectChange from '../examples/NodeTypesObjectChange';
import Overview from '../examples/Overview';
import Provider from '../examples/Provider';
import SaveRestore from '../examples/SaveRestore';
import Stress from '../examples/Stress';
import Subflow from '../examples/Subflow';
import SwitchFlow from '../examples/Switch';
import TouchDevice from '../examples/TouchDevice';
import Undirectional from '../examples/Undirectional';
import UpdatableEdge from '../examples/UpdatableEdge';
import UpdateNode from '../examples/UpdateNode';
import UseUpdateNodeInternals from '../examples/UseUpdateNodeInternals';
import UseReactFlow from '../examples/UseReactFlow';
import Validation from '../examples/Validation';
import UseKeyPress from '../examples/UseKeyPress';
import EdgeRouting from '../examples/EdgeRouting';
import CancelConnection from '../examples/CancelConnection';
import UseOnSelectionChange from '../examples/UseOnSelectionChange';

interface IRoute {
  name: string;
  path: string;
  component: React.ComponentType;
}

const routes: IRoute[] = [
  {
    name: 'Basic',
    path: '/',
    component: Basic,
  },
  {
    name: 'Backgrounds',
    path: '/backgrounds',
    component: Backgrounds,
  },
  {
    name: 'Cancel Connection',
    path: '/cancel-connection',
    component: CancelConnection,
  },
  {
    name: 'Controlled/Uncontrolled',
    path: '/controlled-uncontrolled',
    component: ControlledUncontrolled,
  },
  {
    name: 'Custom Connection Line',
    path: '/custom-connectionline',
    component: CustomConnectionLine,
  },
  {
    name: 'Custom Node',
    path: '/custom-node',
    component: CustomNode,
  },
  {
    name: 'Default Nodes',
    path: '/default-nodes',
    component: DefaultNodes,
  },
  {
    name: 'Drag Handle',
    path: '/draghandle',
    component: DragHandle,
  },
  {
    name: 'Drag and Drop',
    path: '/dragndrop',
    component: DragNDrop,
  },
  {
    name: 'Edges',
    path: '/edges',
    component: Edges,
  },
  {
    name: 'Edge Types',
    path: '/edge-types',
    component: EdgeTypes,
  },
  {
    name: 'Edge Routing',
    path: '/edge-routing',
    component: EdgeRouting,
  },
  {
    name: 'Empty',
    path: '/empty',
    component: Empty,
  },
  {
    name: 'Figma',
    path: '/figma',
    component: Figma,
  },
  {
    name: 'Floating Edges',
    path: '/floating-edges',
    component: FloatingEdges,
  },
  {
    name: 'Hidden',
    path: '/hidden',
    component: Hidden,
  },
  {
    name: 'Interaction',
    path: '/interaction',
    component: Interaction,
  },
  {
    name: 'Layouting',
    path: '/layouting',
    component: Layouting,
  },
  {
    name: 'Multi Flows',
    path: '/multiflows',
    component: MultiFlows,
  },
  {
    name: 'Nested Nodes',
    path: '/nested-nodes',
    component: NestedNodes,
  },
  {
    name: 'Node Type Change',
    path: '/nodetype-change',
    component: NodeTypeChange,
  },
  {
    name: 'nodeTypes Object Change',
    path: '/nodetypesobject-change',
    component: NodeTypesObjectChange,
  },
  {
    name: 'Overview',
    path: '/overview',
    component: Overview,
  },
  {
    name: 'Provider',
    path: '/provider',
    component: Provider,
  },
  {
    name: 'Save/Restore',
    path: '/save-restore',
    component: SaveRestore,
  },
  {
    name: 'Stress',
    path: '/stress',
    component: Stress,
  },
  {
    name: 'Subflow',
    path: '/subflow',
    component: Subflow,
  },
  {
    name: 'Switch Flow',
    path: '/switch',
    component: SwitchFlow,
  },
  {
    name: 'Touch Device',
    path: '/touch-device',
    component: TouchDevice,
  },
  {
    name: 'Undirectional',
    path: '/undirectional',
    component: Undirectional,
  },
  {
    name: 'Updatable Edge',
    path: '/updatable-edge',
    component: UpdatableEdge,
  },
  {
    name: 'Update Node',
    path: '/update-node',
    component: UpdateNode,
  },
  {
    name: 'useOnSelectionChange',
    path: '/use-on-selection-change',
    component: UseOnSelectionChange,
  },
  {
    name: 'useReactFlow',
    path: '/usereactflow',
    component: UseReactFlow,
  },
  {
    name: 'useUpdateNodeInternals',
    path: '/useupdatenodeinternals',
    component: UseUpdateNodeInternals,
  },
  {
    name: 'Validation',
    path: '/validation',
    component: Validation,
  },
  {
    name: 'useKeyPress',
    path: '/use-key-press',
    component: UseKeyPress,
  },
];

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentPath, setCurrentPath] = useState(location.pathname);

  useEffect(() => {
    const name = routes.find((route) => route.path === currentPath)?.name;
    document.title = `React Flow Examples${name ? ' - ' + name : ''}`;
    navigate(currentPath);
  }, [currentPath]);

  return (
    <header>
      <a className="logo" href="https://github.com/wbkd/react-flow">
        React Flow Dev
      </a>
      <select value={currentPath} onChange={(event) => setCurrentPath(event.target.value)}>
        {routes.map((route) => (
          <option value={route.path} key={route.path}>
            {route.name}
          </option>
        ))}
      </select>
    </header>
  );
};

export default () => (
  <BrowserRouter>
    <Header />
    <Routes>
      {routes.map((route) => (
        <Route path={route.path} key={route.path} element={<route.component />} />
      ))}
    </Routes>
  </BrowserRouter>
);
