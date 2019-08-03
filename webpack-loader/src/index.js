import React from 'react';
import { render } from 'react-dom';

import './index.less';

function App() {
  return <div className="component">APP COMPONENT</div>;
}

render(<App />, document.getElementById('app'));
