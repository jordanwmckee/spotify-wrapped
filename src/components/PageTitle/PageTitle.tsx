import styles from './PageTitle.module.css';

const PageTitle = (props: PageTitleProps) => {
  const { title, description } = props;

  return (
    <div className={styles.pageTitle}>
      <div className={styles.titleText}>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
    </div>
  );
};

export default PageTitle;
