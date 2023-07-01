import React from 'react';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import './Navigator.css';

function NavigatorBar() {
  return (
    <Navbar fixed = "top" expand={true} bg="dark" variant="dark" className='full-width-navbar'>
      <Container fluid>
        <Navbar.Brand href="#home">Mocco</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
          <Nav className="mr-auto">
          <NavDropdown title="Explore" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">News Tag 1</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">News Tag 2</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">News Tag 3</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Separated News Tag</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="#news" active >News</Nav.Link>
            <Nav.Link href="#lifestyle">Lifestyle</Nav.Link>           
          </Nav>
        </Navbar.Collapse>
      </Container>
      </Navbar>
  );
}

export default NavigatorBar;