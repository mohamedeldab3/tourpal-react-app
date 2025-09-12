import { Outlet } from 'react-router-dom'; // Import Outlet
import Navbar from '../components/layout/Navbar';

const MainLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet /> {/* This will render the matched child route */}
      </main>
      
    </div>
  );
};

export default MainLayout;

