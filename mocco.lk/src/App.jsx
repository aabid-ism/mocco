import "./App.css";
import NavigatorBar from "./components/Navigator/NavigatorBar";
import { Container, Row, Col } from "react-bootstrap";
import LeftSidebar from "./components/Left/LeftSidebar";
import RightSidebar from "./components/Right/RightSidebar";
import FeedContainer from "./components/FeedContainer";
import { MoccoNewsFeedProvider } from "./providers/NewsProvider";
import backgroundImage from "./assets/MOCCO.svg";
import LanguageToggle from "./components/left/LanguageToggle";

function App() {
  return (
    <>
      <MoccoNewsFeedProvider>
        <NavigatorBar />

        <Container fluid style={{ backgroundColor: "#F1F2F5" }}>
          <Row style={{ paddingTop: "80px", margin: "0" }}>
            <Col
              lg={3}
              className="d-none d-lg-block"
              style={{
                position: "sticky",
                top: "80px",
                height: "calc(100vh - 80px)",
                overflowY: "auto",
              }}
            >
              <LeftSidebar />
            </Col>
            <Col lg={6} md={12} sm={12} xs={12} className="custom-lg-margin">
              <FeedContainer />
            </Col>
            <Col lg={3} className="d-none d-lg-block">
              <div style={{ position: "sticky", top: "80px" }}>
                <RightSidebar />
              </div>
            </Col>
          </Row>
        </Container>
      </MoccoNewsFeedProvider>
    </>
  );
}

export default App;
