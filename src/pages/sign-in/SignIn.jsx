import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import GoogleIcon from "@mui/icons-material/Google";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import HeaderLogin from "@/components/access/components/HeaderLogin";
import FooterLogin from "@/components/access/components/FooterLogin";
import { validateSignIn } from "@/utils/validationUtils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import { useDispatch } from "react-redux";
import { Container } from "react-bootstrap";
import "./signIn.scss";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    const { errors, hasError } = validateSignIn({ email, password });

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
                      type={showPassword ? "text" : "password"}
                      variant="standard"
                      fullWidth
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      error={!!passwordError}
                      helperText={passwordError}
                      inputProps={{
                        style: { width: "85%" },
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              size="small"
                            >
                              {showPassword ? (
                                <VisibilityOff sx={{ fontSize: 10 }} />
                              ) : (
                                <Visibility sx={{ fontSize: 10 }} />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
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
