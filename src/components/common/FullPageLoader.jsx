import { Backdrop, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';

function FullPageLoader() {
    const isLoading = useSelector((state) => state.loading.isLoading);
    return (
        <Backdrop
            open={isLoading}
            className={`text-white flex flex-col items-center justify-center`}>
            <CircularProgress color="inherit" />
            <p>Đang tải.....</p>
        </Backdrop>
    )
}

export default FullPageLoader