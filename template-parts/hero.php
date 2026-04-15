<?php
/**
 * Template part: Hero section
 *
 * @package CXOLanes
 */

$headline    = get_theme_mod( 'cxolanes_hero_headline', 'Where <span class="text-gradient">Senior Leaders</span> Connect, Collaborate &amp; Grow' );
$subtitle    = get_theme_mod( 'cxolanes_hero_subtitle', "Join 4L+ senior professionals on India's premier invite-only executive network. Connect with CXOs, discover leadership opportunities, and amplify your executive brand." );
$cta_text    = get_theme_mod( 'cxolanes_hero_cta_text', 'Request an Invite' );
$cta_url     = get_theme_mod( 'cxolanes_hero_cta_url', '#invite' );
$stat1_val   = get_theme_mod( 'cxolanes_stat1_value', '4L+' );
$stat1_label = get_theme_mod( 'cxolanes_stat1_label', 'Senior Professionals' );
$stat2_val   = get_theme_mod( 'cxolanes_stat2_value', '500+' );
$stat2_label = get_theme_mod( 'cxolanes_stat2_label', 'Companies' );
$stat3_val   = get_theme_mod( 'cxolanes_stat3_value', '50+' );
$stat3_label = get_theme_mod( 'cxolanes_stat3_label', 'Industries' );
$stat4_val   = get_theme_mod( 'cxolanes_stat4_value', '12+' );
$stat4_label = get_theme_mod( 'cxolanes_stat4_label', 'CXO Categories' );
?>

<section class="hero" id="hero">
  <div class="hero-bg">
    <div class="hero-gradient"></div>
  </div>
  <div class="container hero-content">
    <div class="hero-badge fade-in">
      <span class="badge-dot"></span>
      <?php echo esc_html( get_theme_mod( 'cxolanes_hero_badge', "India's Largest C-Suite Network" ) ); ?>
    </div>

    <h1 class="hero-title fade-in"><?php echo wp_kses_post( $headline ); ?></h1>

    <p class="hero-subtitle fade-in"><?php echo esc_html( $subtitle ); ?></p>

    <div class="hero-cta fade-in">
      <a href="<?php echo esc_url( $cta_url ); ?>" class="btn btn-primary btn-lg">
        <?php echo esc_html( $cta_text ); ?>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
      </a>
      <a href="#features" class="btn btn-outline btn-lg"><?php esc_html_e( 'Explore Features', 'cxolanes' ); ?></a>
    </div>

    <div class="hero-stats fade-in">
      <div class="hero-stat">
        <div class="hero-stat-value"><?php echo esc_html( $stat1_val ); ?></div>
        <div class="hero-stat-label"><?php echo esc_html( $stat1_label ); ?></div>
      </div>
      <div class="hero-stat-divider"></div>
      <div class="hero-stat">
        <div class="hero-stat-value"><?php echo esc_html( $stat2_val ); ?></div>
        <div class="hero-stat-label"><?php echo esc_html( $stat2_label ); ?></div>
      </div>
      <div class="hero-stat-divider"></div>
      <div class="hero-stat">
        <div class="hero-stat-value"><?php echo esc_html( $stat3_val ); ?></div>
        <div class="hero-stat-label"><?php echo esc_html( $stat3_label ); ?></div>
      </div>
      <div class="hero-stat-divider"></div>
      <div class="hero-stat">
        <div class="hero-stat-value"><?php echo esc_html( $stat4_val ); ?></div>
        <div class="hero-stat-label"><?php echo esc_html( $stat4_label ); ?></div>
      </div>
    </div>
  </div>
</section>
