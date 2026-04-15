<?php
/**
 * Template part: CTA / Invite form
 *
 * @package CXOLanes
 */
?>

<section class="section cta-section" id="invite">
  <div class="container">
    <div class="cta-card fade-in">
      <div class="cta-glow"></div>
      <h2 class="cta-title"><?php echo wp_kses_post( get_theme_mod( 'cxolanes_cta_title', 'Ready to join India\'s most<br /><span class="text-gradient">exclusive executive network?</span>' ) ); ?></h2>
      <p class="cta-desc"><?php echo esc_html( get_theme_mod( 'cxolanes_cta_desc', 'Request an invite to connect with 4L+ senior professionals, access leadership opportunities, and amplify your executive brand.' ) ); ?></p>

      <?php
      // Use Contact Form 7 or WPForms shortcode if configured
      $form_shortcode = get_theme_mod( 'cxolanes_cta_form_shortcode', '' );
      if ( ! empty( $form_shortcode ) ) :
        echo do_shortcode( $form_shortcode );
      else :
      ?>
        <form class="cta-form" id="inviteForm" method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
          <?php wp_nonce_field( 'cxolanes_invite', 'cxolanes_nonce' ); ?>
          <input type="hidden" name="action" value="cxolanes_invite_submit" />
          <div class="form-row">
            <input type="text" name="fullname" placeholder="<?php esc_attr_e( 'Full Name', 'cxolanes' ); ?>" class="form-input" required />
            <input type="email" name="email" placeholder="<?php esc_attr_e( 'Work Email', 'cxolanes' ); ?>" class="form-input" required />
          </div>
          <div class="form-row">
            <input type="text" name="designation" placeholder="<?php esc_attr_e( 'Current Designation', 'cxolanes' ); ?>" class="form-input" required />
            <input type="text" name="company" placeholder="<?php esc_attr_e( 'Company', 'cxolanes' ); ?>" class="form-input" required />
          </div>
          <div class="form-row form-row-center">
            <button type="submit" class="btn btn-primary btn-lg btn-submit">
              <?php esc_html_e( 'Request Invite', 'cxolanes' ); ?>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
          </div>
        </form>
      <?php endif; ?>
    </div>
  </div>
</section>
