"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./NavBar.module.css";

interface NavBarProps {
  user?: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export default function NavBar({ user }: NavBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

  const isActiveLink = (href: string) => {
    if (href === "/" && pathname === "/") return true;
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.container}>
          {/* Logo and App Name */}
          <div className={styles.logo}>
            <Link href="/" className={styles.logoLink}>
              <div className={styles.logoIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className={styles.appName}>NXBlogs</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className={styles.desktopNav}>
            <div className={styles.navLinks}>
              <Link href="/" className={`${styles.navLink} ${isActiveLink("/") ? styles.activeLink : ""}`}>
                Home
              </Link>
              {user && (
                <>
                  <Link href="/manage" className={`${styles.navLink} ${isActiveLink("/manage") ? styles.activeLink : ""}`}>
                    Manage
                  </Link>
                  <Link href="/create" className={`${styles.ctaButton} ${isActiveLink("/create") ? styles.activeCta : ""}`}>
                    Create
                  </Link>
                </>
              )}
            </div>

            {/* Desktop User Menu */}
            <div className={styles.userSection}>
              {user ? (
                <div className={styles.userMenu}>
                  <button
                    onClick={toggleUserMenu}
                    className={styles.avatarButton}
                  >
                    <div className={styles.avatar}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </button>
                  
                  {isUserMenuOpen && (
                    <div className={styles.userDropdown}>
                      <div className={styles.userInfo}>
                        <div className={styles.userEmail}>{user.email}</div>
                      </div>
                      <hr className={styles.divider} />
                      <form action="/api/auth/signout" method="POST">
                        <button type="submit" className={styles.signOutButton}>
                          Sign Out
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login" className={styles.signInButton}>
                  Sign In
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className={styles.mobileNav}>
            {/* Mobile User Menu */}
            <div className={styles.mobileUserSection}>
              {user ? (
                <div className={styles.userMenu}>
                  <button
                    onClick={toggleUserMenu}
                    className={styles.mobileUserButton}
                  >
                    <div className={styles.avatar}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </button>
                  
                  {isUserMenuOpen && (
                    <div className={styles.mobileUserDropdown}>
                      <div className={styles.userInfo}>
                        <div className={styles.userName}>{user.name}</div>
                        <div className={styles.userEmail}>{user.email}</div>
                      </div>
                      <hr className={styles.divider} />
                      <form action="/api/auth/signout" method="POST">
                        <button type="submit" className={styles.signOutButton}>
                          Sign Out
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login" className={styles.mobileSignInButton}>
                  Sign In
                </Link>
              )}
            </div>

            {/* Hamburger Menu */}
            <button
              className={styles.hamburger}
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.hamburgerLineOpen : ''}`}></span>
              <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.hamburgerLineOpen : ''}`}></span>
              <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.hamburgerLineOpen : ''}`}></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Full Screen Mobile Menu */}
      {isMenuOpen && (
        <div className={styles.mobileMenu} onClick={toggleMenu}>
          <div className={styles.mobileMenuContent} onClick={(e) => e.stopPropagation()}>
            <Link href="/" className={`${styles.mobileNavLink} ${isActiveLink("/") ? styles.activeMobileLink : ""}`} onClick={toggleMenu}>
              Home
            </Link>
            {user && (
              <>
                <Link href="/manage" className={`${styles.mobileNavLink} ${isActiveLink("/manage") ? styles.activeMobileLink : ""}`} onClick={toggleMenu}>
                  Manage
                </Link>
                <Link href="/create" className={`${styles.mobileCtaButton} ${isActiveLink("/create") ? styles.activeMobileCta : ""}`} onClick={toggleMenu}>
                  Create
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}