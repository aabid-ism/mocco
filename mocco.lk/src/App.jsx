import "./App.css";
import NavigatorBar from "./components/Navigator/NavigatorBar";
import { Container, Row, Col } from "react-bootstrap";
import LeftSidebar from "./components/left/LeftSidebar";
import RightSidebar from "./components/right/RightSidebar";
import FeedContainer from "./components/FeedContainer";
import { MoccoNewsFeedProvider } from "./providers/NewsProvider";
import ErrorBoundary from "./ErrorBoundary";
function App() {
  return (
    <>
      <ErrorBoundary
        fallback={
          <div>
            <h2>
              Some error has occurred. Please check your internet connection.
            </h2>
          </div>
        }
      >
        <MoccoNewsFeedProvider>
          <NavigatorBar />
          <Container fluid style={{ backgroundColor: "#F1F2F5" }}>
            <Row style={{ paddingTop: "80px", margin: "0" }}>
              <Col
                lg={3}
                className="d-none d-lg-block custom-scrollbar"
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
                <div
                  style={{
                    position: "sticky",
                    top: "80px",
                    overflow: "hidden",
                  }}
                >
                  <RightSidebar />
                </div>
              </Col>
            </Row>
          </Container>
        </MoccoNewsFeedProvider>
      </ErrorBoundary>
    </>
  );
}

export default App;
