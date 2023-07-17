<?php

/* Wordpress */
add_filter('show_admin_bar', '__return_false', 1000);
function get_current_wp_version()
{
	global $wp_version;
	return array("version" => $wp_version);
}

add_action('rest_api_init', function () {
	register_rest_route(
		'wp/v1',
		'/version',
		array(
			'methods' => 'GET',
			'callback' => 'get_current_wp_version',
		)
	);
});

add_action('wp_head', function () {
	?>
	<meta http-equiv="refresh" content="0; url='http://192.168.64.7'" />
	<?php
}, 1);

/* Start Woocommerce */
add_filter('woocommerce_persistent_cart_enabled', '__return_false');
add_filter('woocommerce_set_cookie_enabled', '__return_false');

add_action('woocommerce_load_cart_from_session', function () {
	// Bail if there isn't any data
	if (!isset($_GET['session_id'])) {
		return;
	}

	$session_id = sanitize_text_field($_GET['session_id']);

	try {

		$handler = new \WC_Session_Handler();
		$session_data = $handler->get_session($session_id);

		// We were passed a session ID, yet no session was found. Let's log this and bail.
		if (empty($session_data)) {
			throw new \Exception('Could not locate WooCommerce session on checkout');
		}

		// Go get the session instance (WC_Session) from the Main WC Class
		$session = WC()->session;

		// Set the session variable
		foreach ($session_data as $key => $value) {
			$session->set($key, unserialize($value));
		}

	} catch (\Exception $exception) {
		error_log(print_r($exception, true));
	}
});


add_action('woocommerce_checkout_after_customer_details', function () {
	// Bail if there isn't any data
	if (!isset($_GET['session_id'])) {
		return;
	} ?>

	<input type="hidden" name="headless-session" value="<?= esc_attr($_GET['session_id']) ?>" />
	<?php
});

add_action('woocommerce_payment_complete', function () {
	// Bail if there isn't any data
	if (!isset($_POST['headless-session'])) {
		return;
	}

	// Delete the headless session we set on POST during the checkout
	WC()->session->delete_session(sanitize_text_field($_POST['headless-session']));
});

/* GraphQL */
add_filter('graphql_woocommerce_cart_session_http_header', function () {
	return 'shopping-session';
});

add_action('graphql_response_headers_to_send', function ($headers) {
	//$headers['Access-Control-Allow-Origin'] = 'http://your-frontend.com';
	unset($headers['X-Robots-Tag']);
	unset($headers['X-GraphQL-Query-ID']);
	unset($headers['X-GraphQL-Keys']);
	unset($headers['X-GraphQL-URL']);

	error_log(print_r($headers, true));
	return $headers;
}, 999);
/* End Woocommerce */