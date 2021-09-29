// Filename: 'public/cartManagement.js'
// This file is clientside because wix-storage only works clientside

/* The cart is an array containing product objects. It has the following format:
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

// addToCart(productInfo) inserts a product into the current user's cart, or updates the quantity if it already exists
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

// sumCartSize(cartArray) sums all item quantities within the current user's cart
export function sumCartSize(cartArray) {

	let cartLength = 0;
	for (let i = 0; i < cartArray.length; i++) {
		cartLength += cartArray[i].quantity;
	}

	return cartLength;
}

// getCartSize() returns number of products in the current user's cart, or 0 if no cart exists
export function getCartSize() {

	const cart = local.getItem("cart");
	if (cart) {
		// Ensure cart is an array and not an object like in the previous version of the code
		const json = JSON.parse(cart);
		if (Array.isArray(json)) return sumCartSize(json);
	}

	return 0;
}

// getCart() returns the cart array of the current user, or a blank array if no cart exists
export function getCart() {

	const cart = local.getItem("cart");
	if (cart) {
		// Ensure cart is an array and not an object like in the previous version of the code
		const json = JSON.parse(cart);
		if (Array.isArray(json)) return json;
	}

	return [];
}

// clearCart() clears the cart array of the current user
export function clearCart() {
	
	// Clear all local storage
	local.clear();

	// Set cart label to 0
	$w("#button3").label = "0";
}

// setCart(cartArray) changes the cart of the current user to the provided array
export function setCart(cartArray) {
	local.setItem("cart", JSON.stringify(cartArray));
}