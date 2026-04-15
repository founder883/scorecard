<?php
/**
 * Template part: Leadership Moves section — pulls from CPT
 *
 * @package CXOLanes
 */

$leadership_query = new WP_Query( array(
  'post_type'      => 'leadership_move',
  'posts_per_page' => 6,
  'orderby'        => 'date',
  'order'          => 'DESC',
) );
?>

<section class="section leadership-section" id="leadership">
  <div class="container">
    <div class="section-header">
      <div class="section-tag"><?php esc_html_e( 'Latest Updates', 'cxolanes' ); ?></div>
      <h2 class="section-title"><?php echo wp_kses_post( get_theme_mod( 'cxolanes_leadership_title', 'Leadership <span class="text-gradient">Moves</span>' ) ); ?></h2>
      <p class="section-desc"><?php echo esc_html( get_theme_mod( 'cxolanes_leadership_desc', "Track the latest C-suite appointments and executive transitions across India's leading organizations." ) ); ?></p>
    </div>

    <div class="leadership-grid">
      <?php if ( $leadership_query->have_posts() ) : ?>
        <?php while ( $leadership_query->have_posts() ) : $leadership_query->the_post(); ?>
          <?php get_template_part( 'template-parts/content', 'leadership' ); ?>
        <?php endwhile; wp_reset_postdata(); ?>
      <?php else : ?>
        <?php
        // Fallback: show placeholder cards if no posts yet
        $placeholders = array(
          array( 'badge' => 'CEO', 'class' => 'lc-ceo', 'title' => 'Rajesh Kumar appointed as Chief Executive Officer at TechVista Solutions', 'excerpt' => 'Rajesh brings over 25 years of experience in digital transformation and enterprise technology leadership.', 'company' => 'TechVista Solutions', 'date' => 'Apr 2026' ),
          array( 'badge' => 'CFO', 'class' => 'lc-cfo', 'title' => 'Priya Sharma joins Meridian Group as Chief Financial Officer', 'excerpt' => 'With a track record of driving profitable growth, Priya will lead financial strategy for the conglomerate.', 'company' => 'Meridian Group', 'date' => 'Apr 2026' ),
          array( 'badge' => 'CTO', 'class' => 'lc-cto', 'title' => 'Amit Patel elevated to Chief Technology Officer at NovaBridge AI', 'excerpt' => 'Amit will spearhead the company\'s AI-first strategy, overseeing product engineering and innovation labs.', 'company' => 'NovaBridge AI', 'date' => 'Mar 2026' ),
          array( 'badge' => 'CHRO', 'class' => 'lc-chro', 'title' => 'Sneha Reddy takes charge as CHRO at Pinnacle Industries', 'excerpt' => 'Sneha will focus on building a future-ready workforce and driving culture transformation.', 'company' => 'Pinnacle Industries', 'date' => 'Mar 2026' ),
          array( 'badge' => 'CIO', 'class' => 'lc-cio', 'title' => 'Vikram Malhotra appointed CIO at Apex Financial Services', 'excerpt' => 'Vikram will lead the digital modernization agenda and cloud-first transformation.', 'company' => 'Apex Financial', 'date' => 'Mar 2026' ),
          array( 'badge' => 'COO', 'class' => 'lc-coo', 'title' => 'Deepa Nair joins GreenPath Logistics as Chief Operating Officer', 'excerpt' => 'Deepa will streamline operations and scale the sustainable logistics network.', 'company' => 'GreenPath Logistics', 'date' => 'Feb 2026' ),
        );
        foreach ( $placeholders as $p ) : ?>
          <article class="leadership-card fade-in">
            <div class="lc-badge <?php echo esc_attr( $p['class'] ); ?>"><?php echo esc_html( $p['badge'] ); ?></div>
            <h3 class="lc-title"><?php echo esc_html( $p['title'] ); ?></h3>
            <p class="lc-excerpt"><?php echo esc_html( $p['excerpt'] ); ?></p>
            <div class="lc-meta">
              <span class="lc-company"><?php echo esc_html( $p['company'] ); ?></span>
              <span class="lc-date"><?php echo esc_html( $p['date'] ); ?></span>
            </div>
          </article>
        <?php endforeach; ?>
      <?php endif; ?>
    </div>

    <?php
    $archive_link = get_post_type_archive_link( 'leadership_move' );
    if ( $archive_link ) :
    ?>
      <div class="section-cta">
        <a href="<?php echo esc_url( $archive_link ); ?>" class="btn btn-outline btn-lg"><?php esc_html_e( 'View All Leadership Moves', 'cxolanes' ); ?> &rarr;</a>
      </div>
    <?php endif; ?>
  </div>
</section>
