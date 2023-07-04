import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import "./NewsCard.css"; // Import the CSS file

function NewsCard({
  heading,
  description,
  imageUrl,
  sinhalaHeading,
  sinhalaDescription,
  lang,
}) {
  return (
    <div>
      <Card
        className="custom-card"
        style={{ borderRadius: "10px", margin: "25px" }}
      >
        <Card.Img variant="top" src={imageUrl} />
        <Card.Body>
          {lang == "English" && <Card.Title>{heading}</Card.Title>}
          {lang == "Sinhala" && <Card.Title>{sinhalaHeading}</Card.Title>}
          {lang == "English" && <Card.Text>{description}</Card.Text>}
          {lang == "Sinhala" && <Card.Text>{sinhalaDescription}</Card.Text>}
          <Button variant="primary">Source</Button>
        </Card.Body>
      </Card>
    </div>
  );
}

export default NewsCard;
