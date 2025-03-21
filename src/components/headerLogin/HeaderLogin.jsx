import { Box } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/headerLogin.scss";

export default function HeaderLogin() {
  const navigate = useNavigate();
  return (
    <>
      <Navbar collapseOnSelect expand="lg" className="bg-body-tertiaryy">
        <Container>
          <Navbar.Brand href="#home">Lifetek Corp</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto"></Nav>
            <Nav>
              <Box
                className="total-login"
                onClick={() => navigate("/register")}
              >
                <PersonAddIcon sx={{ fontSize: 25, color: "white" }} />
                <Nav.Link className="login_text">Đăng kí</Nav.Link>
              </Box>
              <Box className="total-login">
                <FingerprintIcon sx={{ fontSize: 25, color: "white" }} />
                <Nav.Link className="login_text" onClick={() => navigate("/")}>
                  Đăng nhập
                </Nav.Link>
              </Box>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
