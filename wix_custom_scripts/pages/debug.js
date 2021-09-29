// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/1-hello-world

import {getUserName} from 'backend/getUser.jsw';
import {givePoints, getUserPoints} from 'backend/pointManagement.jsw';
import wixUsers from 'wix-users';
import wixWindow from 'wix-window';

$w.onReady(function() {
	
	$w('#testMessage').text = 'Test Text';

	$w('#helloWorldButton').label = 'click button below me';
	
	// wait until client has loaded
	if (wixWindow.rendering.env === "browser") {
		UpdatePage();
	}

	// Gain 1000 points button
	$w("#button4").onClick(() => {

		// Disable button until thing completes
		$w("#button4").disable();
		$w("#button4").label = "UPDATING...";

		// Enable button later
		givePoints(1000).then(() => {
			UpdatePage();
			$w("#button4").enable();
			$w("#button4").label = "GAIN 1000 POINTS";
		});
	});

	$w('#helloWorldButton').onClick(() => {
			//$w('#testMessage').text = getUser();
			
		//$w('#testMessage').text = getUserName("cd99b9a1-756f-4179-9ebb-fcc3b3943914");

		UpdatePage();
	});

	// Refresh stuff when logged in
	wixUsers.onLogin(UpdatePage);

});

function UpdatePage() { //needs to be an async function to work with database

	// this code has been illegally modified without consent from kaleb
	// you can't catch me i'm the gingerbread man

	if (wixUsers.currentUser.loggedIn) {
		
		// logged in
		$w("#button4").enable();
		$w("#button4").label = "GAIN 1000 POINTS";

		getUserPoints().then((points) => {
			$w('#testPoints').text = points.toString();
			console.log("C - " + points);
		});
		
		getUserName().then((name) => {
			$w('#testMessage').text = name;
		});
	
	} else {
		// not logged in
		$w("#testMessage").text = "Not logged in";

		$w("#button4").label = "U have to log in first";
	}
}