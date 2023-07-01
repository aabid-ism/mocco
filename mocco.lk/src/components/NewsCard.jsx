import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import "./NewsCard.css"; // Import the CSS file

function NewsCard({ heading, description }) {
  return (
    <div>
      <Card
        className="custom-card"
        style={{ borderRadius: "10px", margin: "25px" }}
      >
        <Card.Img variant="top" src="books.jpg" />
        <Card.Body>
          <Card.Title>{heading}</Card.Title>
          <Card.Text>{description}</Card.Text>
          <Button variant="primary">Source</Button>
        </Card.Body>
      </Card>
    </div>
  );
}

export default NewsCard;
