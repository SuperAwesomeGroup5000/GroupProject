// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/1-hello-world

import {getUserName} from 'backend/getUser.jsw';
import {getUserPoints} from 'backend/pointManagement.jsw';
import {addToCart} from 'public/cartManagement.js';
import wixUsers from 'wix-users';
import wixData from 'wix-data';
import wixWindow from 'wix-window';

// This method is separated so the content updates when a user logs in
// See https://www.wix.com/velo/forum/coding-with-velo/how-to-auto-refresh-page-onevent
function setupPage(user) {

	// Sorting depends on whether a user is logged in, as sorting by price depends on whether prices are displayed in points or dollars
	$w("#dropdown1").onChange((e) => {
		switch (e.target.value) {
			case "nameAscending":
				$w("#dynamicDataset").setSort(wixData.sort().ascending("name"));
				break;

			case "nameDescending":
				$w("#dynamicDataset").setSort(wixData.sort().descending("name"));
				break;

			case "priceAscending":
				// Sort by points if logged in, or by dollars if logged out
				$w("#dynamicDataset").setSort(wixData.sort().ascending(user.loggedIn ? "price" : "priceDollars"));
				break;

			case "priceDescending":
				// Sort by points if logged in, or by dollars if logged out
				$w("#dynamicDataset").setSort(wixData.sort().descending(user.loggedIn ? "price" : "priceDollars"));
				break;
		}
	});

	// Update displayed text
	if (user.loggedIn) {

		// Display name and points of the current user
		$w("#text14").text = "Points:";

		// Allow both queries to operate simultaneously
		let name, points;
		getUserPoints().then((p) => {
			points = p;
			if (name !== undefined && points !== undefined) {
				$w("#text19").text = `${name}, you have ${points} Dream Points.`;
			} else {
				$w("#text19").text = `You have ${points} Dream Points.`;
			}
		})
		getUserName().then((n) => {
			name = n;
			if (name !== undefined && points !== undefined) {
				$w("#text19").text = `${name}, you have ${points} Dream Points.`;
			} else {
				$w("#text19").text = `Welcome, ${name}`;
			}
		})

	} else {

		// Ask user to log in
		$w("#text14").text = "Price:";
		$w("#text19").text = "To purchase items with Dream Points, please log in at the top right.";
	}

}

$w.onReady(function() {

	// Fix aspect ratio of store images
	$w("#image1").fitMode = "fixedWidth";

	$w("#repeater1").onItemReady(($item, data) => {

		// Items cost dollars instead of points when logged out
		$item("#text13").text = wixUsers.currentUser.loggedIn ? data.price.toString() : `$${data.priceDollars}`;

		// Make each button add to the cart, clientside only
		if (wixWindow.rendering.env === "browser") {
			$item("#button1").enable();
			$item("#button1").onClick(() => {
				addToCart(data);
			});
		}
	});

	// Setup page normally
	setupPage(wixUsers.currentUser);

	// Refresh page whenever a user logs in
	wixUsers.onLogin((e) => {

		$w("#repeater1").forEachItem(($item, data) => {
			// Items cost dollars instead of points when logged out
			$item("#text13").text = e.loggedIn ? data.price.toString() : `$${data.priceDollars}`;
		});

		setupPage(e);
	});
});