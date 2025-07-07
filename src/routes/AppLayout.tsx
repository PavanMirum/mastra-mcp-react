import { Outlet, Link } from 'react-router-dom';

export default function AppLayout() {
  return (
    <>
      <header style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <nav style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/">Home</Link>
          <Link to="/ai-sdk">Ai SDK</Link>
          <Link to="/weather-stream">Weather Stream</Link>
          <Link to="/custom-tool">Custom Client Tool</Link>
          <Link to="/generate-workflow">Client Workflow</Link>
          <Link to="/stream-chat-workflow">Stream Chat Workflow</Link>
          <Link to="/stream-mem-chat">Stream Memory Chat</Link>
          <Link to="/suspend-resume-workflow">Suspend/Resume Workflow</Link>
        </nav>
      </header>
      <main style={{ padding: '1rem' }}>
        <Outlet />
      </main>
    </>
  );
}
