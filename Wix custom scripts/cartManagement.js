// Filename: public/cartManagement.js 

/* The cart is an array containing product objects:
	
	[
		{
			_id: "Product 1 id",
			name: "Product 1 name",
			description: "Product 1 description",
			... all other attributes from storeProducts table
			quantity: 4
		},
		{
			_id: "Product 2 id",
			name: "Product 2 name",
			description: "Product 2 description",
			... all other attributes from storeProducts table
			quantity: 2
		}
	]

*/

import {local} from 'wix-storage';

export function addToCart(productInfo) {

	// Get existing cart if possible
	const currentCart = local.getItem("cart");

	// Parse cart to JSON
	let cartArray = [];
	if (currentCart) {
		// Ensure cart is an array and not an object like in the previous version of the code
		const json = JSON.parse(currentCart);
		if (Array.isArray(json)) {
			cartArray = json;
		}
	}

	// Check if item already exists
	let existingItem = cartArray.find((elem) => elem._id === productInfo._id);

	if (existingItem) {
		// Add to the quantity for this item
		existingItem.quantity++;
	} else {
		// Insert a new item into the cart
		productInfo.quantity = 1;
		cartArray.push(productInfo);
	}

	// Adjust displayed cart size
	const newCount = sumCartSize(cartArray);
	$w("#button3").label = newCount.toString();

	// Save the new cart
    setCart(cartArray);
}

// Sum of all item quantities within the cart
export function sumCartSize(arr) {

	let cartLength = 0;

	for (let i = 0; i < arr.length; i++) {
		cartLength += arr[i].quantity;
	}

	return cartLength;
}

// Get cart size, returning 0 if no cart exists
export function getCartSize() {

	const cart = local.getItem("cart");

	if (cart) {
		// Ensure cart is an array and not an object like in the previous version of the code
		const json = JSON.parse(cart);
		return Array.isArray(json) ? sumCartSize(json) : 0
	}

	return 0;
}

// Get cart, returning an empty array if no cart exists
export function getCart() {

	const cart = local.getItem("cart");

	if (cart) {
		// Ensure cart is an array and not an object like in the previous version of the code
		const json = JSON.parse(cart);
		return Array.isArray(json) ? json : [];
	}

	return [];
}

export function clearCart() {
	
	// Clear all local storage
	local.clear();

	// Set cart label to 0
	$w("#button3").label = "0";
}

export function setCart(arr) {
    // Update stored cart
    local.setItem("cart", JSON.stringify(arr));
}