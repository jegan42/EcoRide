// Ce fichier rend les routes et applique les styles globaux + toastify
import AppRoutes from './routes';
import { Provider } from 'react-redux';
import { store } from './app/store';
import GlobalStyle from './styles/GlobalStyle';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => (
  <Provider store={store}>
    <GlobalStyle />
    <AppRoutes />
    <ToastContainer position="top-right" autoClose={3000} />
  </Provider>
);

export default App;
