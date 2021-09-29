// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/1-hello-world

import {getUserPoints} from 'backend/pointManagement.jsw';
import wixUsers from 'wix-users';

$w.onReady(function() {
	if (wixUsers.currentUser.loggedIn) {
		// Get points of the current user
		getUserPoints().then((points) => {
			$w("#text13").text = `You currently have ${points} Dream Points. Fly with FlyDreamAir to earn more.`;
		});
	}
});