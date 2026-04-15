<?php
/**
 * Front Page template — all sections managed via Customizer
 *
 * @package CXOLanes
 */

get_header();

get_template_part( 'template-parts/hero' );
get_template_part( 'template-parts/marquee' );
get_template_part( 'template-parts/features' );
get_template_part( 'template-parts/leadership-grid' );
get_template_part( 'template-parts/categories' );
get_template_part( 'template-parts/network' );
get_template_part( 'template-parts/cta' );

get_footer();
