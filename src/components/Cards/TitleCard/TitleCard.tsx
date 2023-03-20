import "./TitleCard.css";

const TitleCard = (props: TitleCardProps) => {
  const { title, description } = props;
  return (
    <div className="title-card">
      <div className="title-card-heading">
        <h1>{title}</h1>
      </div>
      {description && (
        <div className="title-card-text">
          <h5>{description}</h5>
        </div>
      )}
    </div>
  );
};

export default TitleCard;
