import "./TitleCard.css";

const TitleCard = ({ heading, text }) => {
  return (
    <div className="title-card">
      <div className="title-card-heading">
        <h1>{heading}</h1>
      </div>
      {text && (
        <div className="title-card-text">
          <h5>{text}</h5>
        </div>
      )}
    </div>
  );
};

export default TitleCard;
