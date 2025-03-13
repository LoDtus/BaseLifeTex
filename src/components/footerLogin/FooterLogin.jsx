import { Box, Link, Typography } from "@mui/material";
import React from "react";

export default function FooterLogin() {
  return (
    <>
      <Box width={"100%"} sx={{ margin: "0 auto", paddingBottom: "55px" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            margin: "0 auto",
            width: "100%",
            maxWidth: "1140px",
          }}
        >
          <Box>
            <Link
              sx={{
                padding: "15px",
                color: "white",
                textDecoration: "none",
                cursor: "pointer",
                fontSize: "15px",
              }}
            >
              Trang chủ
            </Link>
            <Link
              sx={{
                padding: "15px",
                color: "white",
                textDecoration: "none",
                cursor: "pointer",
                fontSize: "15px",
              }}
            >
              Giới thiệu
            </Link>
            <Link
              sx={{
                padding: "15px",
                color: "white",
                textDecoration: "none",
                cursor: "pointer",
                fontSize: "15px",
              }}
            >
              Hỗ trợ
            </Link>
          </Box>
          <Typography color="white" sx={{ padding: "15px" }}>
            © 2025{" "}
            <Link
              sx={{ color: "white", textDecoration: "none" }}
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
