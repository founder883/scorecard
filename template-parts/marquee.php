<?php
/**
 * Template part: Marquee ticker
 *
 * @package CXOLanes
 */

$roles = array( 'CEO', 'CTO', 'CFO', 'CHRO', 'CIO', 'COO', 'CDO', 'CMO', 'VP', 'SVP', 'Managing Director', 'Executive Director' );
?>

<section class="marquee-section">
  <div class="marquee-track">
    <div class="marquee-content">
      <?php for ( $i = 0; $i < 2; $i++ ) : ?>
        <?php foreach ( $roles as $role ) : ?>
          <span class="marquee-item"><?php echo esc_html( $role ); ?></span>
          <span class="marquee-dot">&#9670;</span>
        <?php endforeach; ?>
      <?php endfor; ?>
    </div>
  </div>
</section>
