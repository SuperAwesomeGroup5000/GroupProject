// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/1-hello-world

import {getCart, setCart, clearCart, sumCartSize} from 'public/cartManagement';
import {spendPoints, getUserPoints} from 'backend/pointManagement.jsw';
import {addReceipt} from 'backend/receiptManagement.jsw';
import wixUsers from 'wix-users';
import wixWindow from 'wix-window';

// Sum depends on whether a user is logged in since prices can be in dollars or points
function sumProducts(cartArray, loggedIn) {

	let total = 0;
	for (let i = 0; i < cartArray.length; i++) {
		total += (loggedIn ? cartArray[i].price : cartArray[i].priceDollars) * cartArray[i].quantity;
	}

	return total;
}

function updateCheckoutButton(balance, grandTotal) {

	// Only run when both variables are initialized
	if (balance === 0 || grandTotal === 0) return;

	// Ensure the user has enough balance
	if (balance >= grandTotal) {
		$w("#button5").enable();
		$w("#text27").collapse();
	} else {
		$w("#button5").disable();
		$w("#text27").expand();
		$w("#text27").text = "You don't have enough balance to complete the purchase.";
	}
}

function clearProducts(dollarSign) {

	// Clear stored items
	clearCart();

	// Hide button
	$w("#button4").collapse();

	// Hide product list
	$w("#repeater1").collapse();

	// Display label
	$w("#text27").expand();
	$w("#text27").text = "Your cart contains no items.";

	// Reset grand total
	$w("#text36").text = `${dollarSign}0`;
}

$w.onReady(function() {

	// Fix aspect ratio of images
	$w("#image1").fitMode = "fixedWidth";

	// Initially hide stuff
	$w("#repeater1").collapse();
	$w("#button4").collapse();

	// Placeholders to store balance and grand total
	let balance = 0;
	let grandTotal = 0;

	// Check whether user is logged in
	const loggedIn = wixUsers.currentUser.loggedIn;

	// Only append a dollar sign when logged out
	const dollarSign = loggedIn ? "" : "$";

	// Only run the following on the client, not the server
	if (wixWindow.rendering.env === "browser") {

		// Clear items button
		$w("#button4").onClick(() => {
			clearProducts(dollarSign);
		});

		// Get contents of cart
		let cartArray = getCart();

		// Purchase button
		$w("#button5").onClick(() => {

			// Wait for purchase to complete
			$w("#button5").disable();
			$w("#button5").label = "Confirming...";

			// Attempt to spend points
			spendPoints(grandTotal).then((result) => {
				if (result) {

					// Display success message
					$w("#button5").label = "Success!";

					// Update displayed balance
					$w("#text39").text = (balance - grandTotal).toString();

					// Add receipt
					addReceipt(cartArray);

					// Show receipt button
					$w("#button6").expand();

					// Clear contents of cart
					clearProducts(dollarSign);
				} else {
					$w("#button5").label = "Failure!";
				}
			});
		});

		// Update grand total
		grandTotal = sumProducts(cartArray, loggedIn);
		$w("#text36").text = `${dollarSign}${grandTotal}`;
		updateCheckoutButton(balance, grandTotal);

		// Populate repeater with data from array
		$w("#repeater1").onItemReady(($item, data) => {

			// Get item name
			$item("#text25").text = data.name;

			// Get item image
			$item("#image1").src = data.mainMedia;
			$item("#image1").alt = data.name;

			// Display different price depending on whether user is logged in
			$item("#text32").text = loggedIn ? "Points" : "Price";

			const unitPrice = loggedIn ? data.price : data.priceDollars;
			$item("#text31").text = `${dollarSign}${unitPrice}`;

			let totalPrice = unitPrice * data.quantity;
			$item("#text34").text = `${dollarSign}${totalPrice}`;

			// Get item quantity
			$item("#input1").value = data.quantity.toString();
			$item("#input1").onInput((e) => {

				// Get quantity as number
				const quantity = parseInt(e.target.value);
				if (quantity) {

					// Update total to reflect change
					totalPrice = unitPrice * quantity;
					$item("#text34").text = `${dollarSign}${totalPrice}`;

					// Update cart number
					for (let i = 0; i < cartArray.length; i++) {
						if (cartArray[i]._id === data._id) {
							cartArray[i].quantity = quantity;
							break;
						}
					}
					$w("#button3").label = sumCartSize(cartArray).toString();

					// Update grand total
					grandTotal = sumProducts(cartArray, loggedIn);
					$w("#text36").text = `${dollarSign}${grandTotal}`;
					updateCheckoutButton(balance, grandTotal);

					// Store the new cart
					setCart(cartArray);
				}
			});

			// Clear item
			$item("#vectorImage1").onClick(() => {

				// Update cart contents and size
				for (let i = 0; i < cartArray.length; i++) {
					if (cartArray[i]._id === data._id) {
						// Delete item from cart array
						cartArray.splice(i, 1);
						break;
					}
				}
				$w("#button3").label = sumCartSize(cartArray).toString();

				// Update grand total
				grandTotal = sumProducts(cartArray, loggedIn);
				$w("#text36").text = `${dollarSign}${grandTotal}`;
				updateCheckoutButton(balance, grandTotal);

				// Store the new cart
				$w("#repeater1").data = cartArray;
				setCart(cartArray);

			});
		});

		if (cartArray.length) {

			// Ensure cart is displayed
			$w("#repeater1").expand();
			$w("#repeater1").data = cartArray;
			$w("#text27").collapse();
			$w("#button4").expand();

		} else {
			
			// Ensure cart is not displayed
			$w("#repeater1").collapse();
			$w("#text27").text = "Your cart contains no items.";
			$w("#button4").collapse();
		}
	}

	if (loggedIn) {

		// Display available balance
		getUserPoints().then((points) => {
			balance = points;
			$w("#text39").text = balance.toString();
			updateCheckoutButton(balance, grandTotal);
		});

	} else {

		// Hide available balance
		$w("#text38").collapse();
		$w("#text39").collapse();
	}
});