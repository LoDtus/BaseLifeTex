export const validateSignUp = ({
    userName,
    email,
    password,
    confirmPassword,
}) => {
    let newErrors = {};

    if (!userName) {
        newErrors.userName = "Tên đăng nhập không được để trống.";
    } else if (userName.length < 6) {
        newErrors.userName = "Tên đăng nhập phải có ít nhất 6 ký tự.";
    }

    if (!email.match(/^\S+@\S+\.\S+$/)) {
        newErrors.email = "Email không hợp lệ.";
    }

    if (password.length < 6) {
        newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
    }

    if (password !== confirmPassword) {
        newErrors.confirmPassword = "Mật khẩu xác nhận không trùng khớp.";
    }

    return newErrors;
};

export const validateSignIn = ({ email, password }) => {
    let errors = {};
    let hasError = false;

    if (!email) {
        errors.email = "Vui lòng nhập tên đăng nhập!";
        hasError = true;
    } else if (!email.match(/^\S+@\S+\.\S+$/)) {
        errors.email = "Email không hợp lệ.";
        hasError = true;
    }

    if (!password) {
        errors.password = "Vui lòng nhập mật khẩu!";
        hasError = true;
    } else if (password.length < 6) {
        errors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
        hasError = true;
    }

    return { errors, hasError };
};

export function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9]{2,}$/;
    return emailRegex.test(email);
};

export function isValidPhone(phone) {
    const phoneRegex = /^\+?[0-9]{1,4}?[ -]?(\(?[0-9]{2,4}\)?[ -]?)?[0-9]{3,4}[ -]?[0-9]{3,4}$/;
    return phoneRegex.test(phone);
};