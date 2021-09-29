// The code in this file will load on every page of your site
// Filename: 'masterPage.js'

import {getCartSize} from 'public/cartManagement.js';
import wixWindow from 'wix-window';

// Ensures label only changes on the client and not on the server
// See https://www.wix.com/velo/forum/tips-tutorials-examples/we-re-getting-faster-learn-how-to-get-your-site-ready

$w.onReady(function() {

	if (wixWindow.rendering.env === "browser") {

		// Update displayed cart number
		$w("#button3").label = getCartSize().toString();
	}
});