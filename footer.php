<footer class="footer" id="contact">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="nav-logo">
          <div class="logo-mark"><?php echo esc_html( get_theme_mod( 'cxolanes_logo_mark', 'CXO' ) ); ?></div>
          <span class="logo-text"><?php bloginfo( 'name' ); ?></span>
        </a>
        <p class="footer-tagline"><?php echo esc_html( get_theme_mod( 'cxolanes_footer_tagline', "India's premier invite-only network for senior professionals and C-suite executives." ) ); ?></p>
        <div class="footer-social">
          <?php if ( get_theme_mod( 'cxolanes_linkedin' ) ) : ?>
            <a href="<?php echo esc_url( get_theme_mod( 'cxolanes_linkedin' ) ); ?>" class="social-link" aria-label="LinkedIn" target="_blank" rel="noopener">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
          <?php endif; ?>
          <?php if ( get_theme_mod( 'cxolanes_twitter' ) ) : ?>
            <a href="<?php echo esc_url( get_theme_mod( 'cxolanes_twitter' ) ); ?>" class="social-link" aria-label="Twitter / X" target="_blank" rel="noopener">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
          <?php endif; ?>
          <?php if ( get_theme_mod( 'cxolanes_instagram' ) ) : ?>
            <a href="<?php echo esc_url( get_theme_mod( 'cxolanes_instagram' ) ); ?>" class="social-link" aria-label="Instagram" target="_blank" rel="noopener">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
          <?php endif; ?>
          <?php if ( get_theme_mod( 'cxolanes_facebook' ) ) : ?>
            <a href="<?php echo esc_url( get_theme_mod( 'cxolanes_facebook' ) ); ?>" class="social-link" aria-label="Facebook" target="_blank" rel="noopener">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
          <?php endif; ?>
        </div>
      </div>

      <?php if ( is_active_sidebar( 'footer-1' ) ) : ?>
        <div class="footer-col"><?php dynamic_sidebar( 'footer-1' ); ?></div>
      <?php else : ?>
        <div class="footer-col">
          <h4 class="footer-heading"><?php esc_html_e( 'Platform', 'cxolanes' ); ?></h4>
          <?php
          wp_nav_menu( array(
            'theme_location' => 'footer-platform',
            'container'      => false,
            'menu_class'     => '',
            'fallback_cb'    => false,
            'depth'          => 1,
            'items_wrap'     => '%3$s',
          ) );
          ?>
        </div>
      <?php endif; ?>

      <?php if ( is_active_sidebar( 'footer-2' ) ) : ?>
        <div class="footer-col"><?php dynamic_sidebar( 'footer-2' ); ?></div>
      <?php else : ?>
        <div class="footer-col">
          <h4 class="footer-heading"><?php esc_html_e( 'Company', 'cxolanes' ); ?></h4>
          <?php
          wp_nav_menu( array(
            'theme_location' => 'footer-company',
            'container'      => false,
            'menu_class'     => '',
            'fallback_cb'    => false,
            'depth'          => 1,
            'items_wrap'     => '%3$s',
          ) );
          ?>
        </div>
      <?php endif; ?>

      <?php if ( is_active_sidebar( 'footer-3' ) ) : ?>
        <div class="footer-col"><?php dynamic_sidebar( 'footer-3' ); ?></div>
      <?php else : ?>
        <div class="footer-col">
          <h4 class="footer-heading"><?php esc_html_e( 'Legal', 'cxolanes' ); ?></h4>
          <?php
          wp_nav_menu( array(
            'theme_location' => 'footer-legal',
            'container'      => false,
            'menu_class'     => '',
            'fallback_cb'    => false,
            'depth'          => 1,
            'items_wrap'     => '%3$s',
          ) );
          ?>
        </div>
      <?php endif; ?>
    </div>

    <div class="footer-bottom">
      <p>&copy; <?php echo esc_html( date( 'Y' ) ); ?> <?php bloginfo( 'name' ); ?>. <?php esc_html_e( 'All rights reserved.', 'cxolanes' ); ?></p>
      <p><?php echo esc_html( get_theme_mod( 'cxolanes_footer_location', 'Gurugram, India' ) ); ?></p>
    </div>
  </div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
