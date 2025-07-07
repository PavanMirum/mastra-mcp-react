import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ChatMemoryProvider } from './contexts/ChatMemoryContext';
import router from './router';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChatMemoryProvider>
      <RouterProvider router={router} />
    </ChatMemoryProvider>
  </React.StrictMode>
);
