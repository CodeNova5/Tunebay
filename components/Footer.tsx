import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faLinkedin,
  faFacebookF,
  faInstagram,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import styles from "./Footer.module.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Brand / About */}
        <section className={styles.brand}>
          <h2 className={styles.logo}>Code Nova</h2>
          <p className={styles.tagline}>
            Building New Age digital experiences with clean code & design.
          </p>
        </section>

        {/* Navigation */}
        <section className={styles.section}>
          <h3 className={styles.heading}>Explore</h3>
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
          </ul>
        </section>

        {/* Stay Connected */}
        <section className={styles.section}>
          <h3 className={styles.heading}>Stay Connected</h3>
          <div className={styles.iconRow}>
            <a
              href="https://facebook.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className={styles.icon}
            >
              <FontAwesomeIcon icon={faFacebookF} />
            </a>
            <a
              href="https://instagram.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className={styles.icon}
            >
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a
              href="https://wa.me/yourwhatsapplink"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className={styles.icon}
            >
              <FontAwesomeIcon icon={faWhatsapp} />
            </a>
          </div>
        </section>

        {/* Developer */}
        <section className={styles.section}>
          <h3 className={styles.heading}>Developer</h3>
          <div className={styles.iconRow}>
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className={styles.icon}
            >
              <FontAwesomeIcon icon={faGithub} />
            </a>
            <a
              href="https://linkedin.com/in/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className={styles.icon}
            >
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
          </div>
        </section>
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
