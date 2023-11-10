import { ToastPosition } from 'react-toastify';

const ToastOptions = {
    success: {
        position: 'top-right' as ToastPosition,
        autoClose: 2000,
        hideProgressBar: true,
        pauseOnHover: false,
    },
    error: {
        position: 'top-right' as ToastPosition,
        autoClose: 2000,
        hideProgressBar: true,
        pauseOnHover: false,
    },
};

export default ToastOptions;
