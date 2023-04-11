import styles from './TitleCard.module.css';

const TitleCard = (props: TitleCardProps) => {
  const { title, description } = props;
  return (
    <div className={styles.titleCard}>
      <div className={styles.titleCardHeading}>
        <h1>{title}</h1>
      </div>
      {description && (
        <div className={styles.titleCardText}>
          <h5>{description}</h5>
        </div>
      )}
    </div>
  );
};

export default TitleCard;
