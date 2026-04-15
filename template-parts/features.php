<?php
/**
 * Template part: Features section
 *
 * @package CXOLanes
 */

$features = array(
  array(
    'icon'  => '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    'class' => '',
    'title' => get_theme_mod( 'cxolanes_feat1_title', 'Executive Networking' ),
    'desc'  => get_theme_mod( 'cxolanes_feat1_desc', 'Connect with verified CXOs and senior leaders across industries. Build meaningful relationships that drive business growth.' ),
  ),
  array(
    'icon'  => '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
    'class' => 'icon-teal',
    'title' => get_theme_mod( 'cxolanes_feat2_title', 'Leadership Moves' ),
    'desc'  => get_theme_mod( 'cxolanes_feat2_desc', "Stay updated on the latest C-suite appointments, promotions, and leadership transitions across India's top companies." ),
  ),
  array(
    'icon'  => '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>',
    'class' => 'icon-purple',
    'title' => get_theme_mod( 'cxolanes_feat3_title', 'Industry Intelligence' ),
    'desc'  => get_theme_mod( 'cxolanes_feat3_desc', 'Access exclusive insights, market trends, and strategic intelligence curated for senior decision-makers.' ),
  ),
  array(
    'icon'  => '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>',
    'class' => 'icon-gold',
    'title' => get_theme_mod( 'cxolanes_feat4_title', 'Executive Brand' ),
    'desc'  => get_theme_mod( 'cxolanes_feat4_desc', 'Amplify your personal brand with a verified executive profile, thought leadership content, and peer recognition.' ),
  ),
  array(
    'icon'  => '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    'class' => 'icon-rose',
    'title' => get_theme_mod( 'cxolanes_feat5_title', 'Exclusive Events' ),
    'desc'  => get_theme_mod( 'cxolanes_feat5_desc', 'Get invited to curated roundtables, industry summits, and intimate leadership dinners with top executives.' ),
  ),
  array(
    'icon'  => '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
    'class' => 'icon-cyan',
    'title' => get_theme_mod( 'cxolanes_feat6_title', 'Career Opportunities' ),
    'desc'  => get_theme_mod( 'cxolanes_feat6_desc', 'Discover confidential leadership roles, board positions, and advisory opportunities shared exclusively within the network.' ),
  ),
);
?>

<section class="section features-section" id="features">
  <div class="container">
    <div class="section-header">
      <div class="section-tag"><?php esc_html_e( 'Platform Features', 'cxolanes' ); ?></div>
      <h2 class="section-title"><?php echo wp_kses_post( get_theme_mod( 'cxolanes_features_title', 'Your C-Suite <span class="text-gradient">Collaboration</span> Network' ) ); ?></h2>
      <p class="section-desc"><?php echo esc_html( get_theme_mod( 'cxolanes_features_desc', 'Everything you need to connect, grow, and lead at the highest level.' ) ); ?></p>
    </div>
    <div class="features-grid">
      <?php foreach ( $features as $f ) : ?>
        <div class="feature-card fade-in">
          <div class="feature-icon <?php echo esc_attr( $f['class'] ); ?>">
            <?php echo $f['icon']; // SVG markup, safe ?>
          </div>
          <h3 class="feature-title"><?php echo esc_html( $f['title'] ); ?></h3>
          <p class="feature-desc"><?php echo esc_html( $f['desc'] ); ?></p>
        </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>
