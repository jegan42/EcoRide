// Ce layout entoure les pages principales de l'application avec un header
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';

const AppLayout = () => (
  <>
    <Header />
    <main>
      <Outlet />
    </main>
  </>
);

export default AppLayout;
