import { Outlet } from 'react-router';
import './App.css';

function App() {
  return (
    <div className='flex flex-col gap-8'>
      <h1>Connect Four</h1>
      <Outlet />;
    </div>
  );
}

export default App;
