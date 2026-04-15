<?php
/**
 * Main template file (blog / fallback)
 *
 * @package CXOLanes
 */

get_header();
?>

<div class="page-header">
  <div class="container">
    <h1 class="page-title"><?php single_post_title(); ?></h1>
    <p class="page-subtitle"><?php esc_html_e( 'Latest updates and insights from CXO Lanes', 'cxolanes' ); ?></p>
  </div>
</div>

<div class="container">
  <div class="archive-grid">
    <?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
      <article class="leadership-card fade-in">
        <?php if ( has_post_thumbnail() ) : ?>
          <a href="<?php the_permalink(); ?>"><?php the_post_thumbnail( 'medium' ); ?></a>
        <?php endif; ?>
        <h3 class="lc-title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
        <p class="lc-excerpt"><?php echo esc_html( wp_trim_words( get_the_excerpt(), 20 ) ); ?></p>
        <div class="lc-meta">
          <span class="lc-company"><?php the_author(); ?></span>
          <span class="lc-date"><?php echo esc_html( get_the_date( 'M Y' ) ); ?></span>
        </div>
      </article>
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
    <div class="section" style="text-align:center;">
      <p><?php esc_html_e( 'No posts found.', 'cxolanes' ); ?></p>
    </div>
  <?php endif; ?>
</div>

<?php get_footer(); ?>
