import { Outlet } from 'react-router';
import './App.css';

function App() {
  return (
    <>
      <h1>Connect Four</h1>
      <Outlet />;
    </>
  );
}

export default App;
