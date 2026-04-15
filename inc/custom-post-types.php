<?php
/**
 * Register Custom Post Types and Taxonomies
 *
 * @package CXOLanes
 */

defined( 'ABSPATH' ) || exit;

// ─── Leadership Moves CPT ───────────────────────────────────
function cxolanes_register_cpt() {
	// Leadership Moves
	register_post_type( 'leadership_move', array(
		'labels' => array(
			'name'               => __( 'Leadership Moves', 'cxolanes' ),
			'singular_name'      => __( 'Leadership Move', 'cxolanes' ),
			'add_new'            => __( 'Add New Move', 'cxolanes' ),
			'add_new_item'       => __( 'Add New Leadership Move', 'cxolanes' ),
			'edit_item'          => __( 'Edit Leadership Move', 'cxolanes' ),
			'view_item'          => __( 'View Leadership Move', 'cxolanes' ),
			'search_items'       => __( 'Search Leadership Moves', 'cxolanes' ),
			'not_found'          => __( 'No leadership moves found.', 'cxolanes' ),
			'not_found_in_trash' => __( 'No leadership moves in trash.', 'cxolanes' ),
			'all_items'          => __( 'All Leadership Moves', 'cxolanes' ),
			'menu_name'          => __( 'Leadership Moves', 'cxolanes' ),
		),
		'public'       => true,
		'has_archive'  => true,
		'rewrite'      => array( 'slug' => 'leadership-moves' ),
		'menu_icon'    => 'dashicons-businessperson',
		'supports'     => array( 'title', 'editor', 'excerpt', 'thumbnail', 'revisions' ),
		'show_in_rest' => true,
	) );

	// Invite Requests (admin only)
	register_post_type( 'invite_request', array(
		'labels' => array(
			'name'          => __( 'Invite Requests', 'cxolanes' ),
			'singular_name' => __( 'Invite Request', 'cxolanes' ),
			'all_items'     => __( 'All Requests', 'cxolanes' ),
			'menu_name'     => __( 'Invite Requests', 'cxolanes' ),
		),
		'public'       => false,
		'show_ui'      => true,
		'show_in_menu' => true,
		'menu_icon'    => 'dashicons-email-alt',
		'supports'     => array( 'title' ),
		'capabilities' => array(
			'create_posts' => 'do_not_allow',
		),
		'map_meta_cap' => true,
	) );
}
add_action( 'init', 'cxolanes_register_cpt' );

// ─── Leadership Category Taxonomy ───────────────────────────
function cxolanes_register_taxonomies() {
	register_taxonomy( 'leadership_category', 'leadership_move', array(
		'labels' => array(
			'name'          => __( 'CXO Categories', 'cxolanes' ),
			'singular_name' => __( 'CXO Category', 'cxolanes' ),
			'search_items'  => __( 'Search Categories', 'cxolanes' ),
			'all_items'     => __( 'All Categories', 'cxolanes' ),
			'edit_item'     => __( 'Edit Category', 'cxolanes' ),
			'add_new_item'  => __( 'Add New Category', 'cxolanes' ),
		),
		'hierarchical'  => true,
		'public'        => true,
		'rewrite'       => array( 'slug' => 'category' ),
		'show_in_rest'  => true,
		'show_admin_column' => true,
	) );
}
add_action( 'init', 'cxolanes_register_taxonomies' );

// ─── Default categories on theme activation ─────────────────
function cxolanes_create_default_terms() {
	$terms = array(
		'CEO'  => 'Chief Executive Officer',
		'CTO'  => 'Chief Technology Officer',
		'CFO'  => 'Chief Financial Officer',
		'CHRO' => 'Chief Human Resources Officer',
		'CIO'  => 'Chief Information Officer',
		'COO'  => 'Chief Operating Officer',
		'CDO'  => 'Chief Data Officer',
		'CMO'  => 'Chief Marketing Officer',
	);
	foreach ( $terms as $name => $description ) {
		if ( ! term_exists( $name, 'leadership_category' ) ) {
			wp_insert_term( $name, 'leadership_category', array(
				'description' => $description,
				'slug'        => strtolower( $name ),
			) );
		}
	}
}
add_action( 'after_switch_theme', 'cxolanes_create_default_terms' );

// ─── Meta box: Company name ─────────────────────────────────
function cxolanes_add_meta_boxes() {
	add_meta_box(
		'cxolanes_leadership_details',
		__( 'Leadership Move Details', 'cxolanes' ),
		'cxolanes_leadership_meta_box',
		'leadership_move',
		'side',
		'high'
	);
}
add_action( 'add_meta_boxes', 'cxolanes_add_meta_boxes' );

function cxolanes_leadership_meta_box( $post ) {
	wp_nonce_field( 'cxolanes_leadership_meta', 'cxolanes_meta_nonce' );
	$company     = get_post_meta( $post->ID, '_cxolanes_company', true );
	$designation = get_post_meta( $post->ID, '_cxolanes_designation', true );
	$person_name = get_post_meta( $post->ID, '_cxolanes_person_name', true );
	?>
	<p>
		<label for="cxolanes_person_name"><strong><?php esc_html_e( 'Person Name', 'cxolanes' ); ?></strong></label><br />
		<input type="text" id="cxolanes_person_name" name="cxolanes_person_name" value="<?php echo esc_attr( $person_name ); ?>" class="widefat" />
	</p>
	<p>
		<label for="cxolanes_designation"><strong><?php esc_html_e( 'Designation', 'cxolanes' ); ?></strong></label><br />
		<input type="text" id="cxolanes_designation" name="cxolanes_designation" value="<?php echo esc_attr( $designation ); ?>" class="widefat" />
	</p>
	<p>
		<label for="cxolanes_company"><strong><?php esc_html_e( 'Company', 'cxolanes' ); ?></strong></label><br />
		<input type="text" id="cxolanes_company" name="cxolanes_company" value="<?php echo esc_attr( $company ); ?>" class="widefat" />
	</p>
	<?php
}

function cxolanes_save_meta( $post_id ) {
	if ( ! isset( $_POST['cxolanes_meta_nonce'] ) || ! wp_verify_nonce( $_POST['cxolanes_meta_nonce'], 'cxolanes_leadership_meta' ) ) {
		return;
	}
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}

	$fields = array( '_cxolanes_company', '_cxolanes_designation', '_cxolanes_person_name' );
	foreach ( $fields as $field ) {
		$key = str_replace( '_cxolanes_', 'cxolanes_', $field );
		if ( isset( $_POST[ $key ] ) ) {
			update_post_meta( $post_id, $field, sanitize_text_field( $_POST[ $key ] ) );
		}
	}
}
add_action( 'save_post_leadership_move', 'cxolanes_save_meta' );
