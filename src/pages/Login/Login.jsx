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
import bgImage from "../../assets/image/bg_login.jpg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../redux/apiRequest";
import { useDispatch } from "react-redux";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    setError("");
    setEmailError("");
    setPasswordError("");

    let hasError = false;
    if (!email) {
      setEmailError("Vui lòng nhập tên đăng nhập!");
      hasError = true;
    } else if (!email.match(/^\S+@\S+\.\S+$/)) {
      setEmailError("Email không hợp lệ.");
      hasError = true;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Vui lòng nhập mật khẩu!");
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError("Mật khẩu phải có ít nhất 6 ký tự.");
      hasError = true;
    } else {
      setPasswordError("");
    }

    setLoading(true);
    const newUser = { email, password };
    const response = await loginUser(newUser, dispatch, navigate);
    setTimeout(() => {
      setLoading(false);
    }, 2000);

    if (!response.success) {
      setTimeout(() => {
        setError(response.error);
      }, 2000);
    }
  };

  return (
    <>
      <Box
        sx={{
          backgroundImage: `url(${bgImage})`,
          width: "100%",
          height: "100%",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(26, 33, 18, 0.5)",
          }}
        >
          <HeaderLogin />
          <Box
            sx={{
              width: "100%",
              height: "550px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: "360px",
                backgroundColor: "white",
                borderRadius: "6px",
                padding: "20px",
              }}
            >
              <Box
                sx={{
                  background: "linear-gradient(60deg, #26c6da, #00acc1)",
                  margin: "0 0 15px 0",
                  borderRadius: "3px",
                  padding: "15px",
                  boxShadow:
                    "0 12px 20px -10px rgba(0, 188, 212, 0.28), 0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(0, 188, 212, 0.2)",
                }}
              >
                <Typography
                  textAlign="center"
                  fontWeight="bold"
                  color="white"
                  margin="10px 0"
                >
                  Đăng Nhập
                </Typography>
                <Box display="flex" justifyContent="center">
                  <FacebookIcon sx={{ margin: "10px 15px" }} />
                  <TwitterIcon sx={{ margin: "10px 15px" }} />
                  <GoogleIcon sx={{ margin: "10px 15px" }} />
                </Box>
              </Box>

              <Box
                sx={{
                  padding: "0 20px",
                  marginBottom: "10px",
                  position: "relative",
                }}
              >
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
                <EmailIcon
                  sx={{
                    fontSize: "27px",
                    position: "absolute",
                    right: "20px",
                    top: "17px",
                  }}
                />
              </Box>

              <Box
                sx={{
                  padding: "0 20px",
                  marginBottom: "10px",
                  position: "relative",
                }}
              >
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
                <LockIcon
                  sx={{
                    fontSize: "27px",
                    position: "absolute",
                    right: "20px",
                    top: "17px",
                  }}
                />
              </Box>

              {error && (
                <Typography
                  sx={{ marginBottom: "10px" }}
                  color="red"
                  textAlign="center"
                  fontSize="14px"
                >
                  {error}
                </Typography>
              )}

              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                marginBottom="20px"
              >
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
    </>
  );
}
