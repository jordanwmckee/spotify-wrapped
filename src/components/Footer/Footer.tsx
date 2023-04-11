import styles from './Footer.module.css';

const Footer = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.footerLeft}>
        <h4>Some Heading</h4>
        <ul>
          <p>some link</p>
          <p>some link</p>
        </ul>
      </div>
      <div className={styles.footerRight}>
        <h4>Some other heading</h4>
        <ul>
          <p>some link</p>
          <p>some link</p>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
