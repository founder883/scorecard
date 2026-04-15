<?php
/**
 * Theme Customizer — Admin Panel for all front-page content
 *
 * @package CXOLanes
 */

defined( 'ABSPATH' ) || exit;

function cxolanes_customize_register( $wp_customize ) {

	// ═══════════════════════════════════════════════════════
	// PANEL: CXO Lanes Settings
	// ═══════════════════════════════════════════════════════
	$wp_customize->add_panel( 'cxolanes_panel', array(
		'title'    => __( 'CXO Lanes Settings', 'cxolanes' ),
		'priority' => 30,
	) );

	// ─── Section: General ───────────────────────────────────
	$wp_customize->add_section( 'cxolanes_general', array(
		'title' => __( 'General', 'cxolanes' ),
		'panel' => 'cxolanes_panel',
	) );

	$wp_customize->add_setting( 'cxolanes_logo_mark', array( 'default' => 'CXO', 'sanitize_callback' => 'sanitize_text_field' ) );
	$wp_customize->add_control( 'cxolanes_logo_mark', array(
		'label'   => __( 'Logo Mark Text', 'cxolanes' ),
		'section' => 'cxolanes_general',
		'type'    => 'text',
	) );

	$wp_customize->add_setting( 'cxolanes_signin_url', array( 'default' => '#', 'sanitize_callback' => 'esc_url_raw' ) );
	$wp_customize->add_control( 'cxolanes_signin_url', array(
		'label'   => __( 'Sign In URL', 'cxolanes' ),
		'section' => 'cxolanes_general',
		'type'    => 'url',
	) );

	$wp_customize->add_setting( 'cxolanes_invite_url', array( 'default' => '#invite', 'sanitize_callback' => 'esc_url_raw' ) );
	$wp_customize->add_control( 'cxolanes_invite_url', array(
		'label'   => __( 'Invite Button URL', 'cxolanes' ),
		'section' => 'cxolanes_general',
		'type'    => 'url',
	) );

	// ─── Section: Hero ──────────────────────────────────────
	$wp_customize->add_section( 'cxolanes_hero', array(
		'title' => __( 'Hero Section', 'cxolanes' ),
		'panel' => 'cxolanes_panel',
	) );

	$hero_fields = array(
		'cxolanes_hero_badge'    => array( "India's Largest C-Suite Network", 'Badge Text' ),
		'cxolanes_hero_headline' => array( 'Where <span class="text-gradient">Senior Leaders</span> Connect, Collaborate &amp; Grow', 'Headline (HTML allowed)' ),
		'cxolanes_hero_subtitle' => array( "Join 4L+ senior professionals on India's premier invite-only executive network.", 'Subtitle' ),
		'cxolanes_hero_cta_text' => array( 'Request an Invite', 'CTA Button Text' ),
		'cxolanes_hero_cta_url'  => array( '#invite', 'CTA Button URL' ),
	);

	foreach ( $hero_fields as $id => $data ) {
		$wp_customize->add_setting( $id, array( 'default' => $data[0], 'sanitize_callback' => 'wp_kses_post' ) );
		$wp_customize->add_control( $id, array(
			'label'   => $data[1],
			'section' => 'cxolanes_hero',
			'type'    => 'textarea',
		) );
	}

	// Hero stats
	for ( $i = 1; $i <= 4; $i++ ) {
		$defaults = array(
			1 => array( '4L+', 'Senior Professionals' ),
			2 => array( '500+', 'Companies' ),
			3 => array( '50+', 'Industries' ),
			4 => array( '12+', 'CXO Categories' ),
		);
		$wp_customize->add_setting( "cxolanes_stat{$i}_value", array( 'default' => $defaults[ $i ][0], 'sanitize_callback' => 'sanitize_text_field' ) );
		$wp_customize->add_control( "cxolanes_stat{$i}_value", array(
			'label'   => sprintf( __( 'Stat %d Value', 'cxolanes' ), $i ),
			'section' => 'cxolanes_hero',
			'type'    => 'text',
		) );
		$wp_customize->add_setting( "cxolanes_stat{$i}_label", array( 'default' => $defaults[ $i ][1], 'sanitize_callback' => 'sanitize_text_field' ) );
		$wp_customize->add_control( "cxolanes_stat{$i}_label", array(
			'label'   => sprintf( __( 'Stat %d Label', 'cxolanes' ), $i ),
			'section' => 'cxolanes_hero',
			'type'    => 'text',
		) );
	}

	// ─── Section: Features ──────────────────────────────────
	$wp_customize->add_section( 'cxolanes_features', array(
		'title' => __( 'Features Section', 'cxolanes' ),
		'panel' => 'cxolanes_panel',
	) );

	$wp_customize->add_setting( 'cxolanes_features_title', array( 'default' => 'Your C-Suite <span class="text-gradient">Collaboration</span> Network', 'sanitize_callback' => 'wp_kses_post' ) );
	$wp_customize->add_control( 'cxolanes_features_title', array(
		'label'   => __( 'Section Title', 'cxolanes' ),
		'section' => 'cxolanes_features',
		'type'    => 'textarea',
	) );

	$wp_customize->add_setting( 'cxolanes_features_desc', array( 'default' => 'Everything you need to connect, grow, and lead at the highest level.', 'sanitize_callback' => 'sanitize_text_field' ) );
	$wp_customize->add_control( 'cxolanes_features_desc', array(
		'label'   => __( 'Section Description', 'cxolanes' ),
		'section' => 'cxolanes_features',
		'type'    => 'textarea',
	) );

	$feat_defaults = array(
		1 => array( 'Executive Networking', 'Connect with verified CXOs and senior leaders across industries.' ),
		2 => array( 'Leadership Moves', "Stay updated on the latest C-suite appointments and transitions." ),
		3 => array( 'Industry Intelligence', 'Access exclusive insights and strategic intelligence.' ),
		4 => array( 'Executive Brand', 'Amplify your personal brand with a verified executive profile.' ),
		5 => array( 'Exclusive Events', 'Get invited to curated roundtables and leadership dinners.' ),
		6 => array( 'Career Opportunities', 'Discover confidential leadership roles and board positions.' ),
	);
	for ( $i = 1; $i <= 6; $i++ ) {
		$wp_customize->add_setting( "cxolanes_feat{$i}_title", array( 'default' => $feat_defaults[ $i ][0], 'sanitize_callback' => 'sanitize_text_field' ) );
		$wp_customize->add_control( "cxolanes_feat{$i}_title", array(
			'label'   => sprintf( __( 'Feature %d Title', 'cxolanes' ), $i ),
			'section' => 'cxolanes_features',
			'type'    => 'text',
		) );
		$wp_customize->add_setting( "cxolanes_feat{$i}_desc", array( 'default' => $feat_defaults[ $i ][1], 'sanitize_callback' => 'sanitize_text_field' ) );
		$wp_customize->add_control( "cxolanes_feat{$i}_desc", array(
			'label'   => sprintf( __( 'Feature %d Description', 'cxolanes' ), $i ),
			'section' => 'cxolanes_features',
			'type'    => 'textarea',
		) );
	}

	// ─── Section: Leadership ────────────────────────────────
	$wp_customize->add_section( 'cxolanes_leadership', array(
		'title' => __( 'Leadership Section', 'cxolanes' ),
		'panel' => 'cxolanes_panel',
	) );

	$wp_customize->add_setting( 'cxolanes_leadership_title', array( 'default' => 'Leadership <span class="text-gradient">Moves</span>', 'sanitize_callback' => 'wp_kses_post' ) );
	$wp_customize->add_control( 'cxolanes_leadership_title', array(
		'label'   => __( 'Section Title', 'cxolanes' ),
		'section' => 'cxolanes_leadership',
		'type'    => 'textarea',
	) );

	$wp_customize->add_setting( 'cxolanes_leadership_desc', array( 'default' => "Track the latest C-suite appointments and executive transitions.", 'sanitize_callback' => 'sanitize_text_field' ) );
	$wp_customize->add_control( 'cxolanes_leadership_desc', array(
		'label'   => __( 'Section Description', 'cxolanes' ),
		'section' => 'cxolanes_leadership',
		'type'    => 'textarea',
	) );

	// ─── Section: Why / Network ─────────────────────────────
	$wp_customize->add_section( 'cxolanes_why', array(
		'title' => __( 'Why CXO Lanes', 'cxolanes' ),
		'panel' => 'cxolanes_panel',
	) );

	$wp_customize->add_setting( 'cxolanes_why_title', array( 'default' => 'Built for leaders,<br /><span class="text-gradient">by leaders</span>', 'sanitize_callback' => 'wp_kses_post' ) );
	$wp_customize->add_control( 'cxolanes_why_title', array(
		'label'   => __( 'Section Title', 'cxolanes' ),
		'section' => 'cxolanes_why',
		'type'    => 'textarea',
	) );

	$wp_customize->add_setting( 'cxolanes_why_desc', array( 'default' => "CXO Lanes is a curated, invite-only ecosystem for India's senior-most professionals.", 'sanitize_callback' => 'sanitize_text_field' ) );
	$wp_customize->add_control( 'cxolanes_why_desc', array(
		'label'   => __( 'Description', 'cxolanes' ),
		'section' => 'cxolanes_why',
		'type'    => 'textarea',
	) );

	for ( $i = 1; $i <= 5; $i++ ) {
		$benefit_defaults = array(
			1 => 'Verified executive profiles — no noise, only senior leaders',
			2 => 'Confidential leadership opportunities shared within the network',
			3 => 'Curated industry intelligence and executive insights',
			4 => "Invitation-only events with India's top business leaders",
			5 => 'Board and advisory position matching',
		);
		$wp_customize->add_setting( "cxolanes_benefit_{$i}", array( 'default' => $benefit_defaults[ $i ], 'sanitize_callback' => 'sanitize_text_field' ) );
		$wp_customize->add_control( "cxolanes_benefit_{$i}", array(
			'label'   => sprintf( __( 'Benefit %d', 'cxolanes' ), $i ),
			'section' => 'cxolanes_why',
			'type'    => 'text',
		) );
	}

	// Testimonials
	for ( $i = 1; $i <= 2; $i++ ) {
		foreach ( array( 'quote', 'name', 'role', 'initials' ) as $field ) {
			$key = "cxolanes_testimonial{$i}_{$field}";
			$wp_customize->add_setting( $key, array( 'default' => '', 'sanitize_callback' => 'sanitize_text_field' ) );
			$wp_customize->add_control( $key, array(
				'label'   => sprintf( __( 'Testimonial %d %s', 'cxolanes' ), $i, ucfirst( $field ) ),
				'section' => 'cxolanes_why',
				'type'    => 'text' === $field || 'initials' === $field ? 'text' : 'textarea',
			) );
		}
	}

	// ─── Section: CTA ───────────────────────────────────────
	$wp_customize->add_section( 'cxolanes_cta', array(
		'title' => __( 'CTA / Invite Section', 'cxolanes' ),
		'panel' => 'cxolanes_panel',
	) );

	$wp_customize->add_setting( 'cxolanes_cta_title', array( 'default' => 'Ready to join India\'s most<br /><span class="text-gradient">exclusive executive network?</span>', 'sanitize_callback' => 'wp_kses_post' ) );
	$wp_customize->add_control( 'cxolanes_cta_title', array(
		'label'   => __( 'CTA Title', 'cxolanes' ),
		'section' => 'cxolanes_cta',
		'type'    => 'textarea',
	) );

	$wp_customize->add_setting( 'cxolanes_cta_desc', array( 'default' => 'Request an invite to connect with 4L+ senior professionals.', 'sanitize_callback' => 'sanitize_text_field' ) );
	$wp_customize->add_control( 'cxolanes_cta_desc', array(
		'label'   => __( 'CTA Description', 'cxolanes' ),
		'section' => 'cxolanes_cta',
		'type'    => 'textarea',
	) );

	$wp_customize->add_setting( 'cxolanes_cta_form_shortcode', array( 'default' => '', 'sanitize_callback' => 'sanitize_text_field' ) );
	$wp_customize->add_control( 'cxolanes_cta_form_shortcode', array(
		'label'       => __( 'Form Shortcode (optional)', 'cxolanes' ),
		'description' => __( 'Paste a CF7 or WPForms shortcode to replace the default form.', 'cxolanes' ),
		'section'     => 'cxolanes_cta',
		'type'        => 'text',
	) );

	// ─── Section: Social / Footer ───────────────────────────
	$wp_customize->add_section( 'cxolanes_social', array(
		'title' => __( 'Social & Footer', 'cxolanes' ),
		'panel' => 'cxolanes_panel',
	) );

	$socials = array( 'linkedin', 'twitter', 'instagram', 'facebook' );
	foreach ( $socials as $s ) {
		$wp_customize->add_setting( "cxolanes_{$s}", array( 'default' => '', 'sanitize_callback' => 'esc_url_raw' ) );
		$wp_customize->add_control( "cxolanes_{$s}", array(
			'label'   => ucfirst( $s ) . ' URL',
			'section' => 'cxolanes_social',
			'type'    => 'url',
		) );
	}

	$wp_customize->add_setting( 'cxolanes_footer_tagline', array( 'default' => "India's premier invite-only network for senior professionals.", 'sanitize_callback' => 'sanitize_text_field' ) );
	$wp_customize->add_control( 'cxolanes_footer_tagline', array(
		'label'   => __( 'Footer Tagline', 'cxolanes' ),
		'section' => 'cxolanes_social',
		'type'    => 'textarea',
	) );

	$wp_customize->add_setting( 'cxolanes_footer_location', array( 'default' => 'Gurugram, India', 'sanitize_callback' => 'sanitize_text_field' ) );
	$wp_customize->add_control( 'cxolanes_footer_location', array(
		'label'   => __( 'Footer Location', 'cxolanes' ),
		'section' => 'cxolanes_social',
		'type'    => 'text',
	) );
}
add_action( 'customize_register', 'cxolanes_customize_register' );
