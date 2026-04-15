<?php
/**
 * Template part: CXO Categories — uses taxonomy from Leadership Moves CPT
 *
 * @package CXOLanes
 */

$categories = array(
  array( 'slug' => 'ceo',  'label' => 'CEO',  'full' => 'Chief Executive Officer',         'icon_class' => 'cat-blue',   'icon' => '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>' ),
  array( 'slug' => 'cto',  'label' => 'CTO',  'full' => 'Chief Technology Officer',        'icon_class' => 'cat-teal',   'icon' => '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>' ),
  array( 'slug' => 'cfo',  'label' => 'CFO',  'full' => 'Chief Financial Officer',         'icon_class' => 'cat-green',  'icon' => '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>' ),
  array( 'slug' => 'chro', 'label' => 'CHRO', 'full' => 'Chief Human Resources Officer',   'icon_class' => 'cat-purple', 'icon' => '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' ),
  array( 'slug' => 'cio',  'label' => 'CIO',  'full' => 'Chief Information Officer',       'icon_class' => 'cat-orange', 'icon' => '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>' ),
  array( 'slug' => 'coo',  'label' => 'COO',  'full' => 'Chief Operating Officer',         'icon_class' => 'cat-rose',   'icon' => '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>' ),
  array( 'slug' => 'cdo',  'label' => 'CDO',  'full' => 'Chief Data Officer',              'icon_class' => 'cat-cyan',   'icon' => '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>' ),
  array( 'slug' => 'cmo',  'label' => 'CMO',  'full' => 'Chief Marketing Officer',         'icon_class' => 'cat-gold',   'icon' => '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>' ),
);
?>

<section class="section categories-section" id="categories">
  <div class="container">
    <div class="section-header">
      <div class="section-tag"><?php esc_html_e( 'Executive Categories', 'cxolanes' ); ?></div>
      <h2 class="section-title"><?php echo wp_kses_post( get_theme_mod( 'cxolanes_categories_title', 'Explore by <span class="text-gradient">C-Suite Role</span>' ) ); ?></h2>
      <p class="section-desc"><?php echo esc_html( get_theme_mod( 'cxolanes_categories_desc', 'Browse leadership moves and connect with executives across every major C-suite category.' ) ); ?></p>
    </div>
    <div class="categories-grid">
      <?php foreach ( $categories as $cat ) :
        $term  = get_term_by( 'slug', $cat['slug'], 'leadership_category' );
        $count = $term ? $term->count : '&mdash;';
        $link  = $term ? get_term_link( $term ) : '#';
      ?>
        <a href="<?php echo esc_url( $link ); ?>" class="category-card fade-in">
          <div class="cat-icon <?php echo esc_attr( $cat['icon_class'] ); ?>">
            <?php echo $cat['icon']; ?>
          </div>
          <div class="cat-info">
            <h3><?php echo esc_html( $cat['label'] ); ?></h3>
            <p><?php echo esc_html( $cat['full'] ); ?></p>
          </div>
          <span class="cat-count"><?php echo $count; ?></span>
        </a>
      <?php endforeach; ?>
    </div>
  </div>
</section>
