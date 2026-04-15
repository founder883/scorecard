<?php
/**
 * CXO Lanes Theme Functions
 *
 * @package CXOLanes
 */

defined( 'ABSPATH' ) || exit;

define( 'CXOLANES_VERSION', '1.0.0' );

// ─── Theme Setup ────────────────────────────────────────────
function cxolanes_setup() {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'custom-logo', array(
		'height'      => 60,
		'width'       => 200,
		'flex-height' => true,
		'flex-width'  => true,
	) );
	add_theme_support( 'html5', array(
		'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script',
	) );
	add_theme_support( 'wp-block-styles' );
	add_theme_support( 'responsive-embeds' );

	register_nav_menus( array(
		'primary'          => __( 'Primary Menu', 'cxolanes' ),
		'footer-platform'  => __( 'Footer: Platform', 'cxolanes' ),
		'footer-company'   => __( 'Footer: Company', 'cxolanes' ),
		'footer-legal'     => __( 'Footer: Legal', 'cxolanes' ),
	) );

	add_image_size( 'leadership-card', 600, 400, true );
}
add_action( 'after_setup_theme', 'cxolanes_setup' );

// ─── Enqueue Assets ─────────────────────────────────────────
function cxolanes_scripts() {
	wp_enqueue_style(
		'cxolanes-fonts',
		'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
		array(),
		null
	);

	wp_enqueue_style(
		'cxolanes-style',
		get_stylesheet_uri(),
		array( 'cxolanes-fonts' ),
		CXOLANES_VERSION
	);

	wp_enqueue_script(
		'cxolanes-js',
		get_template_directory_uri() . '/js/cxolanes.js',
		array(),
		CXOLANES_VERSION,
		true
	);
}
add_action( 'wp_enqueue_scripts', 'cxolanes_scripts' );

// ─── Widget Areas ───────────────────────────────────────────
function cxolanes_widgets_init() {
	register_sidebar( array(
		'name'          => __( 'Footer Column 1', 'cxolanes' ),
		'id'            => 'footer-1',
		'before_widget' => '<div class="footer-widget">',
		'after_widget'  => '</div>',
		'before_title'  => '<h4 class="footer-heading">',
		'after_title'   => '</h4>',
	) );
	register_sidebar( array(
		'name'          => __( 'Footer Column 2', 'cxolanes' ),
		'id'            => 'footer-2',
		'before_widget' => '<div class="footer-widget">',
		'after_widget'  => '</div>',
		'before_title'  => '<h4 class="footer-heading">',
		'after_title'   => '</h4>',
	) );
	register_sidebar( array(
		'name'          => __( 'Footer Column 3', 'cxolanes' ),
		'id'            => 'footer-3',
		'before_widget' => '<div class="footer-widget">',
		'after_widget'  => '</div>',
		'before_title'  => '<h4 class="footer-heading">',
		'after_title'   => '</h4>',
	) );
}
add_action( 'widgets_init', 'cxolanes_widgets_init' );

// ─── Include modules ────────────────────────────────────────
require_once get_template_directory() . '/inc/custom-post-types.php';
require_once get_template_directory() . '/inc/customizer.php';

// ─── Fallback menu ──────────────────────────────────────────
function cxolanes_fallback_menu() {
	echo '<div class="nav-links">';
	echo '<a href="#features" class="nav-link">' . esc_html__( 'Features', 'cxolanes' ) . '</a>';
	echo '<a href="#leadership" class="nav-link">' . esc_html__( 'Leadership Moves', 'cxolanes' ) . '</a>';
	echo '<a href="#network" class="nav-link">' . esc_html__( 'Network', 'cxolanes' ) . '</a>';
	echo '<a href="#contact" class="nav-link">' . esc_html__( 'Contact', 'cxolanes' ) . '</a>';
	echo '</div>';
}

// ─── Mobile nav walker ──────────────────────────────────────
class CXOLanes_Mobile_Walker extends Walker_Nav_Menu {
	public function start_el( &$output, $item, $depth = 0, $args = null, $id = 0 ) {
		$output .= '<a href="' . esc_url( $item->url ) . '" class="nav-link">' . esc_html( $item->title ) . '</a>';
	}
	public function end_el( &$output, $item, $depth = 0, $args = null ) {}
	public function start_lvl( &$output, $depth = 0, $args = null ) {}
	public function end_lvl( &$output, $depth = 0, $args = null ) {}
}

// ─── Nav menu link classes ──────────────────────────────────
function cxolanes_nav_link_class( $atts, $item, $args, $depth ) {
	if ( isset( $args->theme_location ) && 'primary' === $args->theme_location ) {
		$atts['class'] = 'nav-link';
	}
	if ( in_array( $args->theme_location, array( 'footer-platform', 'footer-company', 'footer-legal' ), true ) ) {
		$atts['class'] = 'footer-link';
	}
	return $atts;
}
add_filter( 'nav_menu_link_attributes', 'cxolanes_nav_link_class', 10, 4 );

// ─── Invite form handler ────────────────────────────────────
function cxolanes_handle_invite() {
	if ( ! isset( $_POST['cxolanes_nonce'] ) || ! wp_verify_nonce( $_POST['cxolanes_nonce'], 'cxolanes_invite' ) ) {
		wp_die( __( 'Security check failed.', 'cxolanes' ) );
	}

	$name        = sanitize_text_field( $_POST['fullname'] ?? '' );
	$email       = sanitize_email( $_POST['email'] ?? '' );
	$designation = sanitize_text_field( $_POST['designation'] ?? '' );
	$company     = sanitize_text_field( $_POST['company'] ?? '' );

	$admin_email = get_option( 'admin_email' );
	$subject     = sprintf( '[CXO Lanes] New Invite Request from %s', $name );
	$message     = sprintf(
		"Name: %s\nEmail: %s\nDesignation: %s\nCompany: %s",
		$name, $email, $designation, $company
	);

	wp_mail( $admin_email, $subject, $message );

	// Store as a CPT entry for admin tracking
	wp_insert_post( array(
		'post_type'   => 'invite_request',
		'post_title'  => $name . ' — ' . $company,
		'post_status' => 'private',
		'meta_input'  => array(
			'_invite_email'       => $email,
			'_invite_designation' => $designation,
			'_invite_company'     => $company,
		),
	) );

	wp_safe_redirect( add_query_arg( 'invited', '1', home_url( '/' ) ) );
	exit;
}
add_action( 'admin_post_nopriv_cxolanes_invite_submit', 'cxolanes_handle_invite' );
add_action( 'admin_post_cxolanes_invite_submit', 'cxolanes_handle_invite' );

// ─── Admin: Invite Requests columns ────────────────────────
function cxolanes_invite_columns( $columns ) {
	return array(
		'cb'          => '<input type="checkbox" />',
		'title'       => __( 'Name — Company', 'cxolanes' ),
		'email'       => __( 'Email', 'cxolanes' ),
		'designation' => __( 'Designation', 'cxolanes' ),
		'date'        => __( 'Date', 'cxolanes' ),
	);
}
add_filter( 'manage_invite_request_posts_columns', 'cxolanes_invite_columns' );

function cxolanes_invite_column_data( $column, $post_id ) {
	if ( 'email' === $column ) {
		echo esc_html( get_post_meta( $post_id, '_invite_email', true ) );
	}
	if ( 'designation' === $column ) {
		echo esc_html( get_post_meta( $post_id, '_invite_designation', true ) );
	}
}
add_action( 'manage_invite_request_posts_custom_column', 'cxolanes_invite_column_data', 10, 2 );
