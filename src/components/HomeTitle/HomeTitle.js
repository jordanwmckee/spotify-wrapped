import "./HomeTitle.css";

const HomeTitle = ({ title, description }) => {
  return (
    <div className="home-title">
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </div>
  );
};

export default HomeTitle;
