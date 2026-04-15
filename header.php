<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo( 'charset' ); ?>" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<!-- Navbar -->
<nav class="navbar" id="navbar">
  <div class="container nav-inner">
    <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="nav-logo">
      <?php if ( has_custom_logo() ) : ?>
        <?php the_custom_logo(); ?>
      <?php else : ?>
        <div class="logo-mark"><?php echo esc_html( get_theme_mod( 'cxolanes_logo_mark', 'CXO' ) ); ?></div>
        <span class="logo-text"><?php bloginfo( 'name' ); ?></span>
      <?php endif; ?>
    </a>

    <?php
    wp_nav_menu( array(
      'theme_location' => 'primary',
      'container'      => false,
      'menu_class'     => 'nav-links',
      'menu_id'        => 'navLinks',
      'fallback_cb'    => 'cxolanes_fallback_menu',
      'depth'          => 1,
      'link_before'    => '',
      'link_after'     => '',
    ) );
    ?>

    <div class="nav-actions">
      <a href="<?php echo esc_url( get_theme_mod( 'cxolanes_signin_url', '#' ) ); ?>" class="btn btn-ghost"><?php esc_html_e( 'Sign In', 'cxolanes' ); ?></a>
      <a href="<?php echo esc_url( get_theme_mod( 'cxolanes_invite_url', '#invite' ) ); ?>" class="btn btn-primary"><?php esc_html_e( 'Request Invite', 'cxolanes' ); ?></a>
    </div>

    <button class="nav-toggle" id="navToggle" aria-label="<?php esc_attr_e( 'Toggle menu', 'cxolanes' ); ?>">
      <span></span><span></span><span></span>
    </button>

    <!-- Mobile menu -->
    <div class="mobile-menu" id="mobileMenu">
      <?php
      wp_nav_menu( array(
        'theme_location' => 'primary',
        'container'      => false,
        'menu_class'     => '',
        'fallback_cb'    => 'cxolanes_fallback_menu',
        'depth'          => 1,
        'items_wrap'     => '%3$s',
        'walker'         => new CXOLanes_Mobile_Walker(),
      ) );
      ?>
      <div class="mobile-cta">
        <a href="<?php echo esc_url( get_theme_mod( 'cxolanes_signin_url', '#' ) ); ?>" class="btn btn-outline"><?php esc_html_e( 'Sign In', 'cxolanes' ); ?></a>
        <a href="<?php echo esc_url( get_theme_mod( 'cxolanes_invite_url', '#invite' ) ); ?>" class="btn btn-primary"><?php esc_html_e( 'Request Invite', 'cxolanes' ); ?></a>
      </div>
    </div>
  </div>
</nav>
