// Filename: 'backend/ticketManagement.jsw';

import wixData from 'wix-data';
import {givePointsId} from 'backend/pointManagement.jsw';

// refund(orderID) returns the payment for an order if possible
export async function refund(orderID) {
	return wixData.query("orderReceipts")
	.eq("_id", orderID)
	.find()
	.then(async (result) => {
		if (result.items.length > 0) {

			const item = result.items[0];

			// Ensure item is not already refunded
			if (item.refunded) return "Already refunded!";

			// Refund cost of item to user by ID
			await givePointsId(item.userId, item.totalPrice);

			// Update item status to refunded
			item.refunded = true;
			wixData.update("orderReceipts", item).then(console.log).catch(console.error);
			return "Success!";
		} else {
			return "No such ID!";
		}
	});
}