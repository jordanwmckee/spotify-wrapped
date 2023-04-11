import HomeFooter from 'components/HomeFooter/HomeFooter';
import styles from './PrivacyPolicy.module.css';

const PrivacyPolicy = () => {
  return (
    <>
      <div id={styles.privacyPolicy}>
        <div className={styles.policyInfo}>
          <h1>Privacy Policy for Monthly Wrapped</h1>

          <p>
            Monthly Wrapped is committed to protecting your privacy. This
            Privacy Policy explains how we collect, use, and disclose
            information from and about you when you use our web app that
            integrates with the Spotify Web API.
          </p>

          <h2>1. Information We Collect</h2>
          <p>
            When you use Monthly Wrapped, we may collect the following types of
            information:
          </p>
          <ul>
            <li>
              Spotify User Information: We collect information about your
              Spotify account, including your Spotify username, profile picture,
              and public playlists. This information is used solely for the
              purpose of making requests to the Spotify Web API.
            </li>
            <li>
              Spotify Listening Data: We collect information about your
              listening history on Spotify, including the songs you've played,
              artists you've listened to, and playlists you've created. This
              information is used solely for the purpose of displaying your
              listening statistics in Monthly Wrapped.
            </li>
            <li>
              Cookies and Analytics: We use cookies and analytics tools to
              collect information about how you use Monthly Wrapped, including
              your IP address, browser type, operating system, and other usage
              data. This information is used to improve our web app and provide
              a better user experience.
            </li>
          </ul>

          <h2>2. Use of Information</h2>
          <p>
            We use the information we collect from and about you to provide
            Monthly Wrapped and its features, including making requests to the
            Spotify Web API and displaying your listening statistics. We do not
            sell or share your information with third parties for marketing
            purposes.
          </p>

          <h2>3. Data Retention</h2>
          <p>
            We retain your information for as long as necessary to provide
            Monthly Wrapped and its features, and to comply with our legal
            obligations. We may also retain your information in anonymized form
            for research and analytics purposes.
          </p>

          <h2>4. Security</h2>
          <p>
            We take reasonable measures to protect your information from
            unauthorized access, disclosure, or misuse. However, no data
            transmission over the internet or any wireless network can be
            guaranteed to be 100% secure. As a result, we cannot guarantee the
            security of your information.
          </p>

          <h2>5. Changes to this Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. If we make
            material changes, we will notify you by posting the new policy on
            our website. Your continued use of Monthly Wrapped after any changes
            to this Privacy Policy will constitute your acceptance of such
            changes.
          </p>

          <h2>6. Contact Us</h2>
          <p>
            If you have any questions or concerns about our Privacy Policy,
            please contact us at jwm109@uakron.edu.
          </p>

          <p>
            By using Monthly Wrapped, you agree to the terms of this Privacy
            Policy.
          </p>
        </div>
      </div>
      <HomeFooter />
    </>
  );
};

export default PrivacyPolicy;
