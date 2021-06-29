import React from 'react';
import ReactDOM from 'react-dom';
import root from '@storybook/global-root';

import App from './App';
import './index.css';

ReactDOM.render(<App />, root.document.getElementById('root'));
