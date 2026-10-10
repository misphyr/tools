import React from 'react';
import { createRoot } from 'react-dom/client';
import ExtensionShell from './shell';
import './styles.css';

createRoot(document.getElementById('root')!).render(<ExtensionShell variant="tab" />);
