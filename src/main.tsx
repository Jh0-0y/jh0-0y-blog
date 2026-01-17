import ReactDOM from 'react-dom/client'
import '@/styles/global.css';
import { AppRouter } from './router/AppRouter';
import { Toast } from './utils/toast/Toast';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <AppRouter />
    <Toast />
  </>
)