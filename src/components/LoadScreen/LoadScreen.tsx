import SpinningLogo from 'assets/logos/spinning_logo.gif';
import './LoadScreen.css';

const LoadScreen = () => {
  return (
    <div id="load-screen" className="active">
      <div className="load-screen-items">
        <img src={SpinningLogo} alt="" />
        <h1>Loading...</h1>
      </div>
    </div>
  );
};

export default LoadScreen;
