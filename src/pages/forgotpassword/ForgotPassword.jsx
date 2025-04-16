import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import HeaderLogin from "@/components/access/components/HeaderLogin";
import FooterLogin from "@/components/access/components/FooterLogin";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import "../sign-in/signIn.scss"; // dùng lại chung CSS với đăng nhập

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!email || !email.includes("@")) {
      setEmailError("Email không hợp lệ.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setEmailError("");
      setSuccess("Đã gửi email hướng dẫn đổi mật khẩu.");
    }, 2000);
  };

  return (
    <Box className="body-login">
      <Box className="coating">
        <Container>
          <Box>
            <HeaderLogin />
            <Box className="body-content">
              <Box className="login-form">
                <Box className="login-form-total">
                  <Typography className="login-title">Quên Mật Khẩu</Typography>
                </Box>

                <Box className="login-input">
                  <TextField
                    label="Nhập Email"
                    variant="standard"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={!!emailError}
                    helperText={emailError}
                    inputProps={{ style: { width: "85%" } }}
                  />
                </Box>

                {success && (
                  <Typography
                    sx={{ textAlign: "center", color: "green", mt: 1 }}
                  >
                    {success}
                  </Typography>
                )}

                <Box className="login-forgot">
                  <Button
                    onClick={handleSubmit}
                    sx={{ fontWeight: "bold" }}
                    variant="outlined"
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : "Gửi Yêu Cầu"}
                  </Button>
                </Box>

                <Typography
                  onClick={() => navigate("/")}
                  sx={{
                    textAlign: "center",
                    color: "#1976d2",
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                >
                  Quay lại đăng nhập
                </Typography>
              </Box>
            </Box>
            <FooterLogin />
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
