import React, { useState } from "react";
import { Navbar, Container, Nav, NavDropdown, Col } from "react-bootstrap";
import "./Navigator.css";
import LanguageToggle from "../left/LanguageToggle";
import {
  fetchDefaultFeed,
  fetchIntlNews,
  loadMorePosts,
} from "../../services/FetchService";
import { useMoccoNewsFeedDispatchContext } from "../../providers/NewsProvider";
import { NewsType } from "../../enums";
import ModalComponent from "../Modals/ModalComponent";
import Mocco from "../../assets/Mocco.png";

function NavigatorBar() {
  const dispatch = useMoccoNewsFeedDispatchContext();
  const newsTagsList = Object.values(NewsType);
  const tagDropdown = newsTagsList.map((tag) => (
    <NavDropdown.Item eventKey={tag} key={tag}>
      {tag}
    </NavDropdown.Item>
  ));
  const [isModal, setModal] = useState(false);

  async function handleSelect(eventKey) {
    if (eventKey === "Local") {
      const data = await fetchDefaultFeed();
      dispatch({
        type: "DispatchDefaultFeed",
        payload: data,
      });
    } else if (eventKey === "International") {
      const data = await fetchIntlNews();

      dispatch({
        type: "LOAD_INTL_TO_FEED",
        payload: data,
      });
    } else if (eventKey == "Mocco") {
      setModal((value) => true);
    } else {
      const data = await loadMorePosts("TAG", 99999, eventKey);
      dispatch({
        type: "SET_TAG_FEED",
        // toUpperCase because in the provider we use enums.js
        payload: { tag: eventKey.toUpperCase(), data: data },
      });
    }
  }

  return (
    <>
      {isModal && (
        <ModalComponent
          isModal={isModal}
          setModal={setModal}
          title={<h1>Welcome to Mocco!</h1>}
          children={
            <>
              <p>
                {" "}
                We are creating the first personalized short news curator in Sri
                Lanka.
              </p>
              <p>
                Follow us on{" "}
                <a href="https://www.instagram.com/mocco_lk/" target="_blank">
                  Instagram
                </a>{" "}
                and{" "}
                <a
                  href="https://www.facebook.com/mocco.srilanka/"
                  target="_blank"
                >
                  Facebook
                </a>{" "}
                to stay updated!
              </p>
            </>
          }
        />
      )}
      <Navbar
        fixed="top"
        expand={true}
        bg="dark"
        variant="dark"
        className="full-width-navbar"
      >
        <Container fluid>
          <Navbar.Brand href="#home">
            <Col className="d-none d-lg-block">
              <div
                onClick={() => setModal(true)}
                style={{ width: "52px", height: "32px", marginLeft: "20px" }}
              >
                <img
                  src={Mocco}
                  alt="tag"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </Col>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="justify-content-center"
          >
            <Nav
              variant="underline"
              className="text-center d-lg-none"
              onSelect={handleSelect}
              defaultActiveKey="Local"
            >
              <NavDropdown title="Explore" id="basic-nav-dropdown">
                {tagDropdown}

                <NavDropdown.Divider />
                <NavDropdown.Item eventKey="Mocco">Mocco</NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Nav
              variant="underline"
              className="text-center"
              onSelect={handleSelect}
              defaultActiveKey="Local"
            >
              <Nav.Link eventKey="Local">Local</Nav.Link>
              <Nav.Link eventKey="International">International</Nav.Link>
            </Nav>
          </Navbar.Collapse>
          <Navbar.Brand>
            <Col className="d-none d-sm-block">
              <LanguageToggle />
            </Col>
          </Navbar.Brand>
        </Container>
      </Navbar>
    </>
  );
}

export default NavigatorBar;
