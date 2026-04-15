<?php
/**
 * Template part: Network / Why section with testimonials
 *
 * @package CXOLanes
 */
?>

<section class="section network-section" id="network">
  <div class="container">
    <div class="network-grid">
      <div class="network-content fade-in">
        <div class="section-tag"><?php esc_html_e( 'Why CXO Lanes', 'cxolanes' ); ?></div>
        <h2 class="section-title"><?php echo wp_kses_post( get_theme_mod( 'cxolanes_why_title', 'Built for leaders,<br /><span class="text-gradient">by leaders</span>' ) ); ?></h2>
        <p class="network-desc"><?php echo esc_html( get_theme_mod( 'cxolanes_why_desc', "CXO Lanes is not just another professional network. It's a curated, invite-only ecosystem designed exclusively for India's senior-most professionals and decision-makers." ) ); ?></p>
        <ul class="network-list">
          <?php
          $benefits = array(
            get_theme_mod( 'cxolanes_benefit_1', 'Verified executive profiles — no noise, only senior leaders' ),
            get_theme_mod( 'cxolanes_benefit_2', 'Confidential leadership opportunities shared within the network' ),
            get_theme_mod( 'cxolanes_benefit_3', 'Curated industry intelligence and executive insights' ),
            get_theme_mod( 'cxolanes_benefit_4', "Invitation-only events with India's top business leaders" ),
            get_theme_mod( 'cxolanes_benefit_5', 'Board and advisory position matching' ),
          );
          foreach ( $benefits as $b ) :
          ?>
            <li>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
              <?php echo esc_html( $b ); ?>
            </li>
          <?php endforeach; ?>
        </ul>
      </div>

      <div class="network-cards fade-in">
        <div class="testimonial-card">
          <div class="tc-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
          <p class="tc-quote"><?php echo esc_html( get_theme_mod( 'cxolanes_testimonial1_quote', '"CXO Lanes has been instrumental in helping me connect with peers across industries. The quality of the network is unmatched."' ) ); ?></p>
          <div class="tc-author">
            <div class="tc-avatar"><?php echo esc_html( get_theme_mod( 'cxolanes_testimonial1_initials', 'RK' ) ); ?></div>
            <div>
              <div class="tc-name"><?php echo esc_html( get_theme_mod( 'cxolanes_testimonial1_name', 'Rajeev Kapoor' ) ); ?></div>
              <div class="tc-role"><?php echo esc_html( get_theme_mod( 'cxolanes_testimonial1_role', 'CEO, TechNova Solutions' ) ); ?></div>
            </div>
          </div>
        </div>
        <div class="testimonial-card tc-offset">
          <div class="tc-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
          <p class="tc-quote"><?php echo esc_html( get_theme_mod( 'cxolanes_testimonial2_quote', '"The leadership intelligence and executive networking opportunities on CXO Lanes are second to none. A must for every CXO."' ) ); ?></p>
          <div class="tc-author">
            <div class="tc-avatar tc-avatar-teal"><?php echo esc_html( get_theme_mod( 'cxolanes_testimonial2_initials', 'AS' ) ); ?></div>
            <div>
              <div class="tc-name"><?php echo esc_html( get_theme_mod( 'cxolanes_testimonial2_name', 'Ananya Singh' ) ); ?></div>
              <div class="tc-role"><?php echo esc_html( get_theme_mod( 'cxolanes_testimonial2_role', 'CHRO, Pinnacle Group' ) ); ?></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
