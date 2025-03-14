import { Box, Link, Typography } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function HeaderLogin() {
  const navigate = useNavigate();
  return (
    <>
      <Box
        sx={{
          display: "flex",
          maxWidth: "1140px",
          width: "100%",
          margin: "0 auto",
          justifyContent: "space-between",
          height: "70px",
          alignItems: "center",
        }}
      >
        <Link
          sx={{
            textDecoration: "none",
            fontSize: "18px",
            color: "white",
            fontFamily: "sans-serif",
          }}
          href="#"
        >
          Lifetek Corp
        </Link>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            onClick={() => navigate("/register")}
            sx={{
              display: "flex",
              alignItems: "center",
              padding: "15px",
              margin: "0 5px",
              cursor: "pointer",
            }}
            className="register"
          >
            <PersonAddIcon sx={{ fontSize: 25, color: "white" }} />
            <Typography sx={{ fontSize: 12, color: "white" }}>
              Đăng Kí
            </Typography>
          </Box>
          <Box
            onClick={() => navigate("/login")}
            sx={{
              display: "flex",
              alignItems: "center",
              padding: "15px",
              margin: " 0 5px ",
              cursor: "pointer",
            }}
          >
            <FingerprintIcon sx={{ fontSize: 25, color: "white" }} />
            <Typography sx={{ fontSize: 12, color: "white" }}>
              Đăng nhập
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
}
