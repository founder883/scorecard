<?php
/**
 * Single Leadership Move template
 *
 * @package CXOLanes
 */

get_header();

$terms       = get_the_terms( get_the_ID(), 'leadership_category' );
$cat_name    = $terms && ! is_wp_error( $terms ) ? $terms[0]->name : '';
$company     = get_post_meta( get_the_ID(), '_cxolanes_company', true );
$designation = get_post_meta( get_the_ID(), '_cxolanes_designation', true );
$person_name = get_post_meta( get_the_ID(), '_cxolanes_person_name', true );
?>

<div class="page-header">
  <div class="container">
    <?php if ( $cat_name ) : ?>
      <div class="section-tag"><?php echo esc_html( $cat_name ); ?></div>
    <?php endif; ?>
    <h1 class="page-title"><?php the_title(); ?></h1>
    <div class="single-meta">
      <?php if ( $company ) : ?>
        <span><?php echo esc_html( $company ); ?></span>
      <?php endif; ?>
      <?php if ( $designation ) : ?>
        <span><?php echo esc_html( $designation ); ?></span>
      <?php endif; ?>
      <span><?php echo esc_html( get_the_date() ); ?></span>
    </div>
  </div>
</div>

<div class="container single-content">
  <?php if ( has_post_thumbnail() ) : ?>
    <div style="margin-bottom: 32px; border-radius: var(--radius); overflow: hidden;">
      <?php the_post_thumbnail( 'large' ); ?>
    </div>
  <?php endif; ?>

  <div class="single-body">
    <?php
    while ( have_posts() ) : the_post();
      the_content();
    endwhile;
    ?>
  </div>

  <div style="margin-top: 48px; padding-top: 24px; border-top: 1px solid var(--color-border);">
    <a href="<?php echo esc_url( get_post_type_archive_link( 'leadership_move' ) ); ?>" class="btn btn-outline">&larr; <?php esc_html_e( 'All Leadership Moves', 'cxolanes' ); ?></a>
  </div>
</div>

<?php get_footer(); ?>
