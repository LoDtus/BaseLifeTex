import { Box } from "@mui/material";
import React from "react";
import XImage from "../../assets/image/X.png";

export default function MemberList() {
  return (
    <>
      <Box
        sx={{
          maxWidth: "343px",
          width: "100%",
          height: "380px",
          backgroundColor: "white",
          border: "1px solid black",
          position: "relative",
        }}
      >
        <Box
          component="img"
          src={XImage}
          alt="Hình ảnh MUI"
          sx={{
            width: "20",
            height: "20px",
            position: "absolute",
            right: 14,
            top: 18,
          }}
        />
      </Box>
    </>
  );
}
