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
import { validateInputs } from "./utilsValidateRegister";

export default function Register() {
  const [email, setEmail] = useState("");
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleRegister = () => {
    const validationErrors = validateInputs({
      userName,
      email,
      password,
      confirmPassword,
    });
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
    registerUser(newUser, dispatch, navigate).then(() => {
      toast.success("Đăng ký thành công! Vui lòng check Email để xác thực. ", {
        autoClose: 3000,
      });
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
                        Marketing
                      </Typography>
                      <Typography className="register-introduction-describe">
                        We've created the marketing campaign of the website. It
                        was a very interesting collaboration.
                      </Typography>
                    </Box>
                  </Box>
                  <Box className="register-introduction-content">
                    <CodeIcon className="register-introduction-icon" />
                    <Box>
                      <Typography
                        className="register-introduction-text"
                        variant="h4"
                      >
                        Fully Coded in HTML5
                      </Typography>
                      <Typography className="register-introduction-describe">
                        We've developed the website with HTML5 and CSS3. The
                        client has access to the code using GitHub.
                      </Typography>
                    </Box>
                  </Box>
                  <Box className="register-introduction-content">
                    <PeopleAltIcon className="register-introduction-icon" />
                    <Box>
                      <Typography
                        className="register-introduction-text"
                        variant="h4"
                      >
                        Built Audience
                      </Typography>
                      <Typography className="register-introduction-describe">
                        There is also a Fully Customizable CMS Admin Dashboard
                        for this product.
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box className="register-form-total">
                  <Box className="register-total-social">
                    <TwitterIcon className="register-icon-tw" />
                    <SportsBaseballIcon className="register-icon-social" />
                    <FacebookIcon className="register-icon-fb" />
                  </Box>
                  <Typography className="register-or" variant="h4">
                    or be classical
                  </Typography>
                  <Box className="register-bag">
                    <FaceIcon className="register-input-icon" />
                    <Box className="flexR justify-center">
                      <Input
                        className="register-input"
                        placeholder="UserName"
                        onChange={(e) => setUsername(e.target.value)}
                        inputProps={{ style: { width: "85%" } }}
                      />
                    </Box>

                    {error.userName && (
                      <Typography className="register-error" color="error">
                        {error.userName}
                      </Typography>
                    )}
                  </Box>

                  <Box className="register-bag">
                    <EmailIcon className="register-input-icon" />
                    <Box className="flexR justify-center">
                      <Input
                        className="register-input"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                        inputProps={{ style: { width: "85%" } }}
                      />
                    </Box>

                    {error.email && (
                      <Typography className="register-error" color="error">
                        {error.email}
                      </Typography>
                    )}
                  </Box>

                  <Box className="register-bag">
                    <LockIcon className="register-input-icon" />
                    <Box className="flexR justify-center">
                      <Input
                        className="register-input"
                        placeholder="PassWord"
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        inputProps={{ style: { width: "85%" } }}
                      />
                    </Box>
                  </Box>
                  {error.password && (
                    <Typography className="register-error" color="error">
                      {error.password}
                    </Typography>
                  )}
                  <Box className="register-bag">
                    <LockIcon className="register-input-icon" />
                    <Box className="flexR justify-center">
                      <Input
                        className="register-input"
                        placeholder="Confirm Password"
                        type="password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        inputProps={{ style: { width: "85%" } }}
                      />
                    </Box>
                    {error.confirmPassword && (
                      <Typography className="register-error" color="error">
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
