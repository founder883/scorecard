<?php
/**
 * Archive: Leadership Moves
 *
 * @package CXOLanes
 */

get_header();
?>

<div class="page-header">
  <div class="container">
    <div class="section-tag"><?php esc_html_e( 'All Updates', 'cxolanes' ); ?></div>
    <h1 class="page-title"><?php esc_html_e( 'Leadership Moves', 'cxolanes' ); ?></h1>
    <p class="page-subtitle"><?php esc_html_e( 'Track executive appointments and C-suite transitions across India.', 'cxolanes' ); ?></p>
  </div>
</div>

<div class="container">
  <div class="archive-grid">
    <?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
      <?php get_template_part( 'template-parts/content', 'leadership' ); ?>
    <?php endwhile; ?>
  </div>

  <div class="pagination">
    <?php
    the_posts_pagination( array(
      'mid_size'  => 2,
      'prev_text' => '&laquo;',
      'next_text' => '&raquo;',
    ) );
    ?>
  </div>

  <?php else : ?>
    <div class="section" style="text-align:center; padding: 80px 0;">
      <p><?php esc_html_e( 'No leadership moves found yet. Check back soon!', 'cxolanes' ); ?></p>
    </div>
  <?php endif; ?>
</div>

<?php get_footer(); ?>
