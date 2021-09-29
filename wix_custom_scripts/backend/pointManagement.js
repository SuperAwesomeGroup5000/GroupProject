// Filename: 'backend/pointManagement.jsw'

import wixData from 'wix-data';
import wixUsersBackend from 'wix-users-backend';

// getUserPoints() returns the points of the current user, or inserts if no record exists
export async function getUserPoints() {

	const id = wixUsersBackend.currentUser.id;

	return wixData.query("userPoints")
	.eq("title", id)
	.find()
	.then((result) => {
		if (result.items.length > 0) {
			// Return existing points
			return result.items[0].points;
		} else {
			// Insert points into database
			wixData.insert("userPoints", {
				"title": id.toString(),
				"points": 0
			});
			return 0;
		}
	});
}

// spendPoints(points) subtracts points from the current user's balance if possible
// Returns true if points were deducted, false if balance was too low
export async function spendPoints(points) {

	const id = wixUsersBackend.currentUser.id;

	return wixData.query("userPoints") // Get the current user
	.eq("title", id)
	.find()
	.then((result) => {
		
		if (result.items.length > 0) {
			
			// Change existing user
			let currentUser = result.items[0]; // Store the current user's data
			currentUser.points -= points; // Subtract points from the user's data

			if (currentUser.points < 0) {
				console.error(`${id} does not have sufficient funds to complete the purchase!`);
				return false;
			}

			// Push update on user's points data
			wixData.update("userPoints", currentUser).then(console.log).catch(console.error);
			return true;

		} else {

			// Insert new user
			wixData.insert("userPoints", {
				"title": id.toString(),
				"points": 0
			}).catch(console.error);

			console.log(`Added user ${id} to points database.`);
			
			if (points <= 0) {
				// This item is free, so the user can purchase it
				return true;
			} else {
				console.error(`${id} does not have sufficient funds to complete the purchase!`);
				return false;
			}
		}
		
	}).catch(console.error);
}

// givePoints(points) adds points to the current user's balance
export async function givePoints(points) {

	const id = wixUsersBackend.currentUser.id;

	return wixData.query("userPoints") // Get the current user
	.eq("title", id)
	.find()
	.then((result) => {

		// Change existing user
		if (result.items.length > 0) {
			
			let currentUser = result.items[0]; // Store the current user's data
			currentUser.points += points; // Add points to the user's data

			// Push update on user's points data
			return wixData.update("userPoints", currentUser).then(console.log).catch(console.error);

		} else {

			console.log(`Added user ${id} to points database.`);

			// Insert new user
			return wixData.insert("userPoints", {
				"title": id.toString(),
				"points": points
			}).catch(console.error);
		}
		
	}).catch(console.error);
}