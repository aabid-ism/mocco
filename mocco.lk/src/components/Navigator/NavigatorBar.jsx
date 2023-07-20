import React from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import "./Navigator.css";
import LanguageToggle from "../left/LanguageToggle";

function NavigatorBar() {
  function handleSelect(eventKey) {
    // Fetch
    // Dispatch
  }

  return (
    <Navbar
      fixed="top"
      expand={true}
      bg="dark"
      variant="dark"
      className="full-width-navbar"
    >
      <Container fluid>
        <Navbar.Brand href="#home">Mocco</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse
          id="basic-navbar-nav"
          className="justify-content-center"
        >
          <Nav className="mr-auto">
            <NavDropdown title="Explore" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">News Tag 1</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">News Tag 2</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">News Tag 3</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated News Tag
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link eventKey="Local" active>
              Local
            </Nav.Link>
            <Nav.Link eventKey="International">International</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
      <div style={{ marginRight: "10px" }}>
        <LanguageToggle />
      </div>
    </Navbar>
  );
}

export default NavigatorBar;
