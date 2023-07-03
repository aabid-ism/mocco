import "./App.css";
import NewsCard from "./components/NewsCard";
import NavigatorBar from "./components/NavigatorBar";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { Container } from "react-bootstrap";
import LeftSidebar from "./components/left/LeftSidebar";
import RightSidebar from "./components/right/RightSidebar";
import FeedContainer from "./components/FeedContainer";
import { MoccoNewsFeedProvider } from "./providers/NewsProvider";
import { useEffect } from "react";
import { fetchDefaultFeed } from "./services/FetchService";
function App() {
  return (
    <>
      <NavigatorBar />
      <MoccoNewsFeedProvider>
        <Container fluid style={{ backgroundColor: "#F1F2F5" }}>
          <div
            style={{
              display: "flex",
              paddingTop: "100px",
              margin: "0",
            }}
          >
            <Col
              lg={3}
              className="d-none d-lg-block"
              style={{ backgroundColor: "orange" }}
            >
              <div>
                <LeftSidebar />
              </div>
            </Col>
            <Col lg={6} md={12} sm={12} xs={12}>
              <div>
                <FeedContainer />
              </div>
            </Col>
            <Col
              lg={3}
              className="d-none d-lg-block"
              style={{ backgroundColor: "purple" }}
            >
              <div
              // style={{
              //   display: "flex",
              //   justifyContent: "start",
              // }}
              >
                <RightSidebar />
              </div>
            </Col>
          </div>
        </Container>
      </MoccoNewsFeedProvider>
    </>
  );
}

export default App;
