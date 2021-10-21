// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/1-hello-world

import {getReceipts} from 'backend/receiptManagement.jsw';

function updateTotalSpent(items) {

	// Sum all items together
	let totalSpent = 0;
	for (let i = 0; i < items.length; i++) {
		// Only consider non-refunded products
		if (!items[i].refunded) {
			totalSpent += items[i].totalPrice;
		}
	}

	// Update label
	$w("#text42").text = totalSpent.toString();
}

$w.onReady(function () {

	// Fix image aspect ratio
	$w("#image1").fitMode = "fixedWidth";

	// Initially hide the list
	$w("#repeater1").collapse();

	$w("#repeater1").onItemReady(($item, data) => {

		// Display differently when refunded
		if (data.refunded) {
			$item("#text33").text = "Refunded";
			$item("#vectorImage1").expand();
		}

		// Set product title
		$item("#text25").text = `${data.productName} x${data.quantity}`;

		// Set product image
		$item("#image1").src = data.productImage;
		$item("#image1").alt = data.productName;

		// Set order ID
		$item("#text31").text = data.refunded ? "Order refunded!" : data._id;

		// Set order date
		$item("#text38").text = new Intl.DateTimeFormat("en", {
			timeStyle: "long",
			dateStyle: "long"
		}).format(data._createdDate);

		// Set amount spent
		$item("#text34").text = data.totalPrice.toString();
	});

	getReceipts().then((result) => {

		if (result.items.length > 0) {

			// Hide help text
			$w("#text27").collapse();

			$w("#repeater1").data = result.items;
			$w("#repeater1").expand();

			updateTotalSpent(result.items);

		} else {
			$w("#text27").text = "You have not purchased anything.";
		}
	}).catch(console.error);
});