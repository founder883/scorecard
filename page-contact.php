<?php
/**
 * Template Name: Contact Page
 *
 * @package CXOLanes
 */

get_header();
?>

<div class="page-header">
  <div class="container">
    <div class="section-tag"><?php esc_html_e( 'Get In Touch', 'cxolanes' ); ?></div>
    <h1 class="page-title"><?php the_title(); ?></h1>
    <p class="page-subtitle"><?php esc_html_e( 'Have questions? We\'d love to hear from you.', 'cxolanes' ); ?></p>
  </div>
</div>

<div class="container contact-section">
  <div class="contact-form">
    <?php
    while ( have_posts() ) : the_post();
      the_content();
    endwhile;
    ?>
  </div>
</div>

<?php get_footer(); ?>
