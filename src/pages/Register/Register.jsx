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
import bgImage from "../../assets/image/bg_login.jpg";
import FaceIcon from "@mui/icons-material/Face";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from "../../redux/apiRequest";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleResigter = () => {
    const newUser = {
      email: email,
      username: username,
      password: password,
    };
    registerUser(newUser, dispatch, navigate);
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
              maxWidth: "930px",
              width: "100%",
              height: "555px",
              backgroundColor: "white",
              margin: "0 auto",
              borderRadius: "6px",
            }}
          >
            <Typography
              sx={{ textAlign: "center", fontSize: "32px", padding: "40px 0" }}
            >
              Resigter
            </Typography>
            <Box sx={{ width: "100%", maxWidth: "889px", padding: "16px" }}>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Box
                  sx={{
                    maxWidth: "374px",
                    width: "100%",
                    height: 100,
                  }}
                >
                  <Box sx={{ display: "flex" }}>
                    <TimelineIcon
                      sx={{
                        color: "#e32163",
                        fontSize: "30px",
                        marginRight: "10px",
                      }}
                    />
                    <Box>
                      <Typography
                        sx={{
                          fontSize: "18px",
                          color: "#3C4858",
                          marginBottom: "15px",
                          marginTop: "5px",
                        }}
                        variant="h4"
                      >
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
                  <Box sx={{ display: "flex" }}>
                    <CodeIcon
                      sx={{
                        color: "#3791d9",
                        fontSize: "30px",
                        marginRight: "10px",
                      }}
                    />
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
                  <Box sx={{ display: "flex" }}>
                    <PeopleAltIcon
                      sx={{
                        color: "#00b1c3",
                        fontSize: "30px",
                        marginRight: "10px",
                      }}
                    />
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
                      margin: "10px 0",
                    }}
                    variant="h4"
                  >
                    or be classical
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "end",
                    }}
                  >
                    <FaceIcon sx={{ marginRight: "20px" }} />
                    <Input
                      sx={{ paddingTop: "18px", paddingBottom: "10px" }}
                      placeholder="UserName"
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "end",
                    }}
                  >
                    <EmailIcon sx={{ marginRight: "20px" }} />
                    <Input
                      sx={{ paddingTop: "18px", paddingBottom: "10px" }}
                      placeholder="Email"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "end",
                      width: "100%",
                    }}
                  >
                    <LockIcon sx={{ marginRight: "20px" }} />
                    <Input
                      sx={{ paddingTop: "18px", paddingBottom: "10px" }}
                      placeholder="PassWord"
                      type="password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Button
                      sx={{ borderRadius: "20px", margin: "10px 0" }}
                      variant="contained"
                      onClick={handleResigter()}
                    >
                      Get Started
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
          <FooterLogin />
        </Box>
      </Box>
    </>
  );
}
