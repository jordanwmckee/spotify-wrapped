import SpinningLogo from 'assets/logos/spinning_logo.gif';
import styles from './LoadScreen.module.css';

export const clearLoadingScreen = () => {
  // shrink loading screen div
  const loadScreenDiv = document.getElementById(styles.loadScreen);
  // set the display property of the img and h1 elements to none
  if (loadScreenDiv) {
    loadScreenDiv
      .querySelector(`.${styles.loadScreenItems}`)
      ?.setAttribute('style', 'display: none');
    loadScreenDiv.setAttribute('style', 'height: 55px;');
    setTimeout(() => {
      loadScreenDiv.style.display = 'none';
    }, 300);
  }
};

const LoadScreen = () => {
  return (
    <div id={styles.loadScreen} className="active">
      <div className={styles.loadScreenItems}>
        <img src={SpinningLogo} alt="" />
        <h1>Loading...</h1>
      </div>
    </div>
  );
};

export default LoadScreen;
