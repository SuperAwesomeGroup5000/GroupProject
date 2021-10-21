// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/1-hello-world

import {refund} from 'backend/ticketManagement.jsw';

$w.onReady(function() {
	$w("#button4").onClick(() => {

		// Get order ID from textbox
		const orderID = $w("#input1").value;

		// Attempt to refund order
		refund(orderID).then((status) => {
			$w("#button4").label = status;
		});
	});
});