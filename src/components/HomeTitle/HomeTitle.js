import "./HomeTitle.css";

const HomeTitle = ({ title, description, subheading }) => {
  var titleSize = "55px";
  var descSize = "25px";
  if (subheading === true) {
    titleSize = "45px";
    descSize = "22px";
  }
  const styles = {
    homeTitle: {
      fontSize: titleSize,
    },
    homeTitleDesc: {
      fontSize: descSize,
    },
  };

  return (
    <div className="home-title">
      <h1 style={styles.homeTitle}>{title}</h1>
      {description && <p style={styles.homeTitleDesc}>{description}</p>}
    </div>
  );
};

export default HomeTitle;
