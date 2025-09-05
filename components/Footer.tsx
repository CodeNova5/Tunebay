import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Left Section - Brand / About */}
        <div className={styles.left}>
          <h2 className={styles.logo}>Code Nova</h2>
          <p className={styles.tagline}>
            Building meaningful digital experiences with clean code & design.
          </p>
          <p className={styles.small}>
            Innovation | Creativity | Reliability
          </p>
        </div>

        {/* Right Section - Links & Contact */}
        <div className={styles.right}>
          <div className={styles.section}>
            <h3 className={styles.heading}>Quick Links</h3>
            <ul className={styles.linkList}>
              <li>
                <Link href="/terms" className={styles.link}>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/dmca" className={styles.link}>
                  DMCA
                </Link>
              </li>
              <li>
                <Link href="/privacy" className={styles.link}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/faq" className={styles.link}>
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h3 className={styles.heading}>Contact</h3>
            <ul className={styles.linkList}>
              <li>Email: <a href="mailto:hello@codenova.com" className={styles.link}>hello@codenova.com</a></li>
              <li>Phone: <span className={styles.text}>+234 812 345 6789</span></li>
              <li>Location: <span className={styles.text}>Lagos, Nigeria</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className={styles.bottom}>
        <p>
          &copy; {currentYear} Developed by <span>Code Nova</span>. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}