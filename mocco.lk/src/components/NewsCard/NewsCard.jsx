import Card from "react-bootstrap/Card";

function NewsCard({
  heading,
  description,
  tag,
  imageUrl,
  sinhalaHeading,
  sinhalaDescription,
  lang,
  source,
  sourceUrl,
}) {
  return (
    <div>
      <Card
        style={{
          borderRadius: "10px",
          margin: "25px",
          borderWidth: "0",
          boxShadow:
            "0 0px 3px 0px rgba(0, 0, 0, 0.2), 0 0px 1px 0 rgba(0, 0, 0, 0.19)",
        }}
      >
        <Card.Header>{tag}</Card.Header>
        <Card.Img variant="bottom" src={imageUrl} />
        <Card.Body>
          {lang == "English" && <Card.Title>{heading}</Card.Title>}
          {lang == "Sinhala" && <Card.Title>{sinhalaHeading}</Card.Title>}
          {lang == "English" && <Card.Text>{description}</Card.Text>}
          {lang == "Sinhala" && <Card.Text>{sinhalaDescription}</Card.Text>}
          {/* <Button variant="primary">Source</Button> */}
        </Card.Body>
        <Card.Footer>
          via{" "}
          <a href={sourceUrl} target="_blank">
            {source}
          </a>
        </Card.Footer>
      </Card>
    </div>
  );
}

export default NewsCard;
