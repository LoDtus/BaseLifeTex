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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    setError("");
    setUsernameError("");
    setPasswordError("");

    let hasError = false;
    if (!username) {
      setUsernameError("Vui lòng nhập tên đăng nhập!");
      hasError = true;
    }
    if (!password) {
      setPasswordError("Vui lòng nhập mật khẩu!");
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);

    const newUser = { username, password };
    const response = await loginUser(newUser, dispatch, navigate);

    setLoading(false);

    if (!response.success) {
      setError(response.error);
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
                  margin: "15px",
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

              <Box sx={{ padding: "0 20px", marginBottom: "10px" }}>
                <TextField
                  label="Tên đăng nhập"
                  variant="standard"
                  fullWidth
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  error={!!usernameError}
                  helperText={usernameError}
                />
                <EmailIcon
                  sx={{ fontSize: "27px", position: "absolute", right: "30px" }}
                />
              </Box>

              <Box sx={{ padding: "0 20px", marginBottom: "10px" }}>
                <TextField
                  label="Mật Khẩu"
                  type="password"
                  variant="standard"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={!!passwordError}
                  helperText={passwordError}
                />
                <LockIcon
                  sx={{ fontSize: "27px", position: "absolute", right: "30px" }}
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
