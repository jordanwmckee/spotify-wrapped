import "./PageTitle.css";

const PageTitle = ({ title, description }) => {
  return (
    <div className="page-title">
      <div className="title-text">
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
    </div>
  );
};

export default PageTitle;
