import styles from './HomeTitle.module.css';

const HomeTitle = (props: HomeTitleProps) => {
  const { title, description, subheading } = props;

  var titleSize = '55px';
  var descSize = '25px';
  if (subheading === true) {
    titleSize = '45px';
    descSize = '22px';
  }
  const inlineStyles = {
    homeTitle: {
      fontSize: titleSize,
    },
    homeTitleDesc: {
      fontSize: descSize,
    },
  };

  return (
    <div className={styles.homeTitle}>
      <h1 style={inlineStyles.homeTitle}>{title}</h1>
      {description && <p style={inlineStyles.homeTitleDesc}>{description}</p>}
    </div>
  );
};

export default HomeTitle;
