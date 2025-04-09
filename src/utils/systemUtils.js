import { notification } from 'antd';

export function openSystemNoti(type, description, placement = 'topRight') {
    let message;
    switch(type) {
        case 'success':
            message = 'Thành công';
            break;
        case 'error':
            message = 'Lỗi';
            break;
        case 'info':
            message = 'Thông báo từ hệ thống';
            break;
        case 'warning':
            message = 'Cảnh báo';
            break;
        case 'open':
            message = 'Thông báo';
            break;
        default:
            message = 'Thông báo';
    }

    notification[type]({
        message: message,
        description: description,
        placement: placement,
        duration: 3,
        showProgress: true,
    });
};