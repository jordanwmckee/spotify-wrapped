import "./PageTitle.css";

const PageTitle = (props: { title: string; description?: string }) => {
  const { title, description } = props;

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
