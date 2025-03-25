import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import GoogleIcon from "@mui/icons-material/Google";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import HeaderLogin from "../../components/headerLogin/HeaderLogin";
import FooterLogin from "../../components/footerLogin/FooterLogin";
import { validateLogin } from "./utilsValidateLogin";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "react-bootstrap";
import "../../styles/login.scss";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.login.currentUser);
  useEffect(() => {
    let token = user?.data?.accessToken;
    if (token) {
      navigate("/home");
    }
  }, [user]);
  const handleLogin = async () => {
    const { errors, hasError } = validateLogin({ email, password });

    setEmailError(errors.email || "");
    setPasswordError(errors.password || "");

    if (hasError) return;

    setError("");

    setLoading(true);
    const newUser = { email, password };
    const response = await loginUser(newUser, dispatch, navigate);

    setTimeout(() => {
      setLoading(false);
      if (!response.success) {
        setError(response.error);
      }
    }, 2000);
  };

  return (
    <Box className="body-login">
      <Box className="coating">
        <Container>
          <Box>
            <Box>
              <HeaderLogin />
              <Box className="body-content">
                <Box className="login-form">
                  <Box className="login-form-total">
                    <Typography className="login-title">Đăng Nhập</Typography>
                    <Box display="flex" justifyContent="center">
                      <FacebookIcon className="login-icon" />
                      <TwitterIcon className="login-icon" />
                      <GoogleIcon className="login-icon" />
                    </Box>
                  </Box>
                  <Box className="login-input">
                    <TextField
                      label="Tên đăng nhập"
                      variant="standard"
                      fullWidth
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      error={!!emailError}
                      helperText={emailError}
                      inputProps={{ style: { width: "85%" } }}
                    />
                    <EmailIcon className="login-input-icon" />
                  </Box>

                  <Box className="login-input">
                    <TextField
                      label="Mật Khẩu"
                      type="password"
                      variant="standard"
                      fullWidth
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      error={!!passwordError}
                      helperText={passwordError}
                      inputProps={{ style: { width: "85%" } }}
                    />
                    <LockIcon className="login-input-icon" />
                  </Box>

                  {error && (
                    <Typography className="login-error">{error}</Typography>
                  )}

                  <Box className="login-forgot">
                    <Button
                      onClick={handleLogin}
                      sx={{ fontWeight: "bold" }}
                      variant="outlined"
                      disabled={loading}
                    >
                      {loading ? <CircularProgress size={24} /> : "Đăng Nhập"}
                    </Button>
                  </Box>
                </Box>
              </Box>
              <FooterLogin />
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
