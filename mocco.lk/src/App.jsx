import "./App.css";
import NavigatorBar from "./components/Navigator/NavigatorBar";
import Col from "react-bootstrap/Col";
import { Container } from "react-bootstrap";
import LeftSidebar from "./components/Left/LeftSidebar";
import RightSidebar from "./components/Right/RightSidebar";
import FeedContainer from "./components/FeedContainer";
import { MoccoNewsFeedProvider } from "./providers/NewsProvider";
import backgroundImage from "./assets/MOCCO.svg";

function App() {
  return (
    <>
      <MoccoNewsFeedProvider>
        <NavigatorBar />
        <Container
          fluid
          style={{
            backgroundColor: "#F1F2F5",
            // backgroundImage: `url(backgroundImage)`,
            // backgroundSize: "cover",
            // backgroundRepeat: "no-repeat",
            // backgroundPosition: "center",
          }}
        >
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
              // style={{ backgroundColor: "orange" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  position: "fixed",
                }}
              >
                <LeftSidebar />
              </div>
            </Col>
            <Col lg={6} md={12} sm={12} xs={12}>
              <div>
                <FeedContainer />
              </div>
            </Col>
            <Col lg={3} className="d-none d-lg-block">
              <div
              // style={{ position: "fixed" }}
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
