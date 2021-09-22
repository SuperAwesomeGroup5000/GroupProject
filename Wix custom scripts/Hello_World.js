// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/1-hello-world

import wixUsers from 'wix-users';
import wixData from 'wix-data';

import {getUserName} from 'backend/getUser.jsw'
import {getUser} from 'backend/getUser.jsw'

$w.onReady(async function () {
	
	$w('#testMessage').text = 'Test Text';

	$w('#helloWorldButton').label = 'press me';

	// Click "Preview" to run your code
	$w('#helloWorldButton').onClick( () => {
			//$w('#testMessage').text = getUser();
			
		//$w('#testMessage').text = getUserName("cd99b9a1-756f-4179-9ebb-fcc3b3943914");

      UpdatePage();
	})

});


async function UpdatePage(){ //needs to be an async function to work with database

   let currentUser = wixUsers.currentUser;
   let id = currentUser.id;

   let x = await getUserName(id);
   $w('#testMessage').text = x.toString();
   console.log("C - " + x.toString());
   return x.toString();

}
