// src/providers/ToastProvider.tsx
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastProvider = () => (
  <ToastContainer position="top-right" autoClose={5000} />
);
export default ToastProvider;
