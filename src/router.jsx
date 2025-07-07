import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import AppLayout from './routes/AppLayout';
import Home from './routes/Home';
import AiSDK from './routes/AiSDK';
import WeatherStream from './routes/WeatherStream';
import WithCustomTool from './routes/WithCustomTool';
import GenerateWorkflow from './routes/GenerateWorkflow';
import StreamChatWorkflow from './routes/StreamChatWorkflow';
import SuspendResumeWorkflowPage from './routes/SuspendResumeWorkflowPage';
import StreamMemChat from './routes/StreamMemChat';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<AppLayout />}>
      <Route index element={<Home />} />
      <Route path="ai-sdk" element={<AiSDK />} />
      <Route path="weather-stream" element={<WeatherStream />} />
      <Route path="custom-tool" element={<WithCustomTool />} />
      <Route path="generate-workflow" element={<GenerateWorkflow />} />
      <Route path="stream-chat-workflow" element={<StreamChatWorkflow />} />
      <Route path="stream-mem-chat" element={<StreamMemChat />} />
      <Route path="suspend-resume-workflow" element={<SuspendResumeWorkflowPage />} />
    </Route>
  )
);

export default router;
