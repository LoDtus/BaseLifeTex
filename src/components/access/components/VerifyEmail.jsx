import React from "react";
import { Box, Typography, Button } from "@mui/material";
import HeaderLogin from "@/components/access/components/HeaderLogin";
import FooterLogin from "@/components/access/components/FooterLogin";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "@/pages/sign-in/signIn.scss";

export default function VerifyEmail() {
  const navigate = useNavigate();
  return (
    <Box className="body-login">
      <Box className="coating">
        <Container>
          <Box>
            <Box>
              <HeaderLogin />
              <Box className="content_body">
                <Box>
                  <Typography className="text_notation">
                    Xác nhận Email thành công!
                  </Typography>
                  <Button
                    onClick={() => navigate("/")}
                    className="btn_out_login"
                  >
                    Về Đăng Nhập
                  </Button>
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
