<?php
/**
 * Template part: Single Leadership Move card (used in grids)
 *
 * @package CXOLanes
 */

$terms    = get_the_terms( get_the_ID(), 'leadership_category' );
$cat_slug = $terms && ! is_wp_error( $terms ) ? $terms[0]->slug : '';
$cat_name = $terms && ! is_wp_error( $terms ) ? $terms[0]->name : '';
$company  = get_post_meta( get_the_ID(), '_cxolanes_company', true );

// Map category slug to badge class
$badge_map = array(
  'ceo' => 'lc-ceo', 'cto' => 'lc-cto', 'cfo' => 'lc-cfo',
  'chro' => 'lc-chro', 'cio' => 'lc-cio', 'coo' => 'lc-coo',
  'cdo' => 'lc-cdo', 'cmo' => 'lc-cmo',
);
$badge_class = isset( $badge_map[ $cat_slug ] ) ? $badge_map[ $cat_slug ] : 'lc-ceo';
?>

<article class="leadership-card fade-in" id="post-<?php the_ID(); ?>">
  <?php if ( $cat_name ) : ?>
    <div class="lc-badge <?php echo esc_attr( $badge_class ); ?>"><?php echo esc_html( strtoupper( $cat_name ) ); ?></div>
  <?php endif; ?>

  <h3 class="lc-title">
    <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
  </h3>

  <p class="lc-excerpt"><?php echo esc_html( wp_trim_words( get_the_excerpt(), 24 ) ); ?></p>

  <div class="lc-meta">
    <?php if ( $company ) : ?>
      <span class="lc-company"><?php echo esc_html( $company ); ?></span>
    <?php endif; ?>
    <span class="lc-date"><?php echo esc_html( get_the_date( 'M Y' ) ); ?></span>
  </div>
</article>
