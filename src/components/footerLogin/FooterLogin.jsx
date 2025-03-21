import { Box, Link, Typography } from "@mui/material";
import "../../styles/footerLogin.scss";
import React from "react";

export default function FooterLogin() {
  return (
    <>
      <Box className="footer">
        <Box className="footer-content">
          <Box>
            <Link className="footer-link">Trang chủ</Link>
            <Link className="footer-link">Giới thiệu</Link>
            <Link className="footer-link">Hỗ trợ</Link>
          </Box>
          <Typography className="footer-text">
            © 2025{" "}
            <Link
              className="footer-text-link"
              href="http://http://lifetek.com.vn/"
            >
              LifeTek{" "}
            </Link>
            Công nghệ cho cuộc sống
          </Typography>
        </Box>
      </Box>
    </>
  );
}
