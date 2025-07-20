
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { StagewiseToolbar } from '@stagewise/toolbar-react';
import './index.css';

// Create a more robust root mounting with error handling
const container = document.getElementById("root");

if (!container) {
  console.error("Root element not found!");
} else {
  try {
    const root = createRoot(container);
    root.render(<App />);
  } catch (error) {
    console.error("Failed to render app:", error);
    // Display a fallback UI for critical errors
    container.innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <h2>Something went wrong</h2>
        <p>The application failed to load. Please try refreshing the page.</p>
      </div>
    `;
  }
}

// Initialize Stagewise toolbar separately (development mode only)
const toolbarConfig = {
  plugins: [], // Add your custom plugins here
};

// Only initialize in development mode
if (import.meta.env.DEV) {
  document.addEventListener('DOMContentLoaded', () => {
    const toolbarRoot = document.createElement('div');
    toolbarRoot.id = 'stagewise-toolbar-root';
    document.body.appendChild(toolbarRoot);

    createRoot(toolbarRoot).render(
      <React.StrictMode>
        <StagewiseToolbar config={toolbarConfig} />
      </React.StrictMode>
    );
  });
}
