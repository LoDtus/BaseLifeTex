import { Box, Button, Typography } from "@mui/material";
import React, { useState } from "react";
import HeaderLogin from "../../components/headerLogin/HeaderLogin";
import FooterLogin from "../../components/footerLogin/FooterLogin";
import TimelineIcon from "@mui/icons-material/Timeline";
import CodeIcon from "@mui/icons-material/Code";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import SportsBaseballIcon from "@mui/icons-material/SportsBaseball";
import Input from "@mui/material/Input";
import FaceIcon from "@mui/icons-material/Face";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from "../../services/authService";
import "../../styles/register.scss";
import { Container } from "react-bootstrap";

export default function Register() {
  const [email, setEmail] = useState("");
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const validateInputs = () => {
    let newErrors = {};
    if (!userName) {
      newErrors.userName = "Tên đăng nhập không được để trống.";
    } else if (userName.length < 6) {
      newErrors.userName = "Tên đăng nhập phải có ít nhất 6 ký tự.";
    }
    if (!email.match(/^\S+@\S+\.\S+$/)) {
      newErrors.email = "Email không hợp lệ.";
    }
    if (password.length < 6)
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Mật khẩu xác nhận không trùng khớp.";
    return newErrors;
  };
  const handleRegister = () => {
    const validationErrors = validateInputs();
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      toast.error("Vui lòng kiểm tra lại thông tin đăng ký!", {
        autoClose: 3000,
      });
      return;
    }
    setError({});
    const newUser = {
      email: email,
      userName: userName,
      password: password,
      confirmPassword: confirmPassword,
    };
    console.log("Dữ liệu gửi lên API:", newUser);
    registerUser(newUser, dispatch, navigate)
      .then(() => {
        toast.success(
          "Đăng ký thành công! Vui lòng check Email để xác thực. ",
          { autoClose: 3000 }
        );
      })
      .catch(() => {
        toast.error("Đăng ký thất bại, vui lòng thử lại!", { autoClose: 3000 });
      });
  };

  return (
    <>
      <ToastContainer />
      <Box className="register">
        <Box className="register-form">
          <HeaderLogin />
          <Container>
            <Box className="register-form-content">
              <Typography className="register-title">Resigter</Typography>
              <Box className="register-total">
                <Box className="register-introduction">
                  <Box className="register-introduction-content">
                    <TimelineIcon className="register-introduction-icon" />
                    <Box>
                      <Typography
                        className="register-introduction-text"
                        variant="h4"
                      >
                        {" "}
                        Marketing
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "14px",
                          color: "#999999",
                          marginBottom: "10px",
                        }}
                      >
                        We've created the marketing campaign of the website. It
                        was a very interesting collaboration.
                      </Typography>
                    </Box>
                  </Box>
                  <Box className="register-introduction-content">
                    <CodeIcon className="register-introduction-icon" />
                    <Box>
                      <Typography
                        sx={{
                          fontSize: "18px",
                          color: "#3C4858",
                          marginBottom: "15px",
                        }}
                        variant="h4"
                      >
                        Fully Coded in HTML5
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "14px",
                          color: "#999999",
                          marginBottom: "10px",
                        }}
                      >
                        We've developed the website with HTML5 and CSS3. The
                        client has access to the code using GitHub.
                      </Typography>
                    </Box>
                  </Box>
                  <Box className="register-introduction-content">
                    <PeopleAltIcon className="register-introduction-icon" />
                    <Box>
                      <Typography
                        sx={{
                          fontSize: "18px",
                          color: "#3C4858",
                          marginBottom: "15px",
                        }}
                        variant="h4"
                      >
                        Built Audience
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "14px",
                          color: "#999999",
                        }}
                      >
                        There is also a Fully Customizable CMS Admin Dashboard
                        for this product.
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box
                  sx={{
                    maxWidth: "374px",
                    width: "100%",
                    height: 100,
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <TwitterIcon sx={{ fontSize: "40px", color: "#57aced" }} />
                    <SportsBaseballIcon
                      sx={{ fontSize: "40px", color: "#ea4d88" }}
                    />
                    <FacebookIcon sx={{ fontSize: "40px", color: "#3b5999" }} />
                  </Box>
                  <Typography
                    sx={{
                      fontSize: "18px",
                      textAlign: "center",
                      fontWeight: 300,
                      marginTop: "10px",
                    }}
                    variant="h4"
                  >
                    or be classical
                  </Typography>
                  <Box sx={{ position: "relative" }}>
                    <FaceIcon
                      sx={{
                        marginRight: "20px",
                        position: "absolute",
                        right: "27px",
                        top: "16px",
                      }}
                    />
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <Input
                        sx={{
                          paddingTop: "10px",
                          paddingBottom: "10px",
                          width: "75%",
                        }}
                        placeholder="UserName"
                        onChange={(e) => setUsername(e.target.value)}
                        inputProps={{ style: { width: "85%" } }}
                      />
                    </Box>

                    {error.userName && (
                      <Typography
                        sx={{
                          textAlign: "center",
                          fontSize: "12px",
                          marginTop: "5px",
                        }}
                        color="error"
                      >
                        {error.userName}
                      </Typography>
                    )}
                  </Box>

                  <Box
                    sx={{
                      position: "relative",
                    }}
                  >
                    <EmailIcon
                      sx={{
                        marginRight: "20px",
                        position: "absolute",
                        right: "27px",
                        top: "16px",
                      }}
                    />
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <Input
                        sx={{
                          paddingTop: "10px",
                          paddingBottom: "10px",
                          width: "75%",
                        }}
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                        inputProps={{ style: { width: "85%" } }}
                      />
                    </Box>

                    {error.email && (
                      <Typography
                        sx={{
                          fontSize: "12px",
                          marginTop: "5px",
                          textAlign: "center",
                        }}
                        color="error"
                      >
                        {error.email}
                      </Typography>
                    )}
                  </Box>

                  <Box
                    sx={{
                      position: "relative",
                    }}
                  >
                    <LockIcon
                      sx={{
                        marginRight: "20px",
                        position: "absolute",
                        right: "27px",
                        top: "16px",
                      }}
                    />
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <Input
                        sx={{
                          paddingTop: "10px",
                          paddingBottom: "10px",
                          width: "75%",
                        }}
                        placeholder="PassWord"
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        inputProps={{ style: { width: "85%" } }}
                      />
                    </Box>
                  </Box>
                  {error.password && (
                    <Typography
                      sx={{
                        fontSize: "12px",
                        marginTop: "5px",
                        textAlign: "center",
                      }}
                      color="error"
                    >
                      {error.password}
                    </Typography>
                  )}
                  <Box
                    sx={{
                      position: "relative",
                    }}
                  >
                    <LockIcon
                      sx={{
                        marginRight: "20px",
                        position: "absolute",
                        right: "27px",
                        top: "16px",
                      }}
                    />
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <Input
                        sx={{
                          paddingTop: "10px",
                          paddingBottom: "10px",
                          width: "75%",
                        }}
                        placeholder="Confirm Password"
                        type="password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        inputProps={{ style: { width: "85%" } }}
                      />
                    </Box>
                    {error.confirmPassword && (
                      <Typography
                        sx={{
                          fontSize: "12px",
                          marginTop: "5px",
                          textAlign: "center",
                        }}
                        color="error"
                      >
                        {error.confirmPassword}
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Button
                      sx={{ borderRadius: "20px", margin: "15px 0" }}
                      variant="contained"
                      onClick={handleRegister}
                    >
                      Get Started
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Container>
          <FooterLogin />
        </Box>
      </Box>
    </>
  );
}
