// Filename: 'backend/receiptManagement.jsw';

import wixData from 'wix-data';
import wixUsersBackend from 'wix-users-backend';

// addReceipt(cartArray) adds receipts to the database based the current user and their cart contents
export async function addReceipt(cartArray) {

	const id = wixUsersBackend.currentUser.id;

	// Build list of ordered products
	let orderedProducts = [];

	for (let i = 0; i < cartArray.length; i++) {
		const product = cartArray[i];
		orderedProducts.push({
			"userId": id,
			"productId": product._id,
			"productName": product.name,
			"productImage": product.mainMedia,
			"quantity": product.quantity,
			"totalPrice": product.price * product.quantity
		});
	}

	// Insert receipts for each ordered product
	return wixData.bulkInsert("orderReceipts", orderedProducts).then(console.log).catch(console.error);

}

// getReceipts() returns all receipts stored in the database for the current user
export async function getReceipts() {

	const id = wixUsersBackend.currentUser.id;

	// Return a promise of all the receipts for a user
	return wixData.query("orderReceipts").eq("userId", id).find();
}