// Filename: 'backend/getUser.jsw'

import wixUsersBackend from 'wix-users-backend';

// getUser() returns the properties of the current user for debugging
export async function getUser() {
	const id = wixUsersBackend.currentUser.id;
	return wixUsersBackend.getUser(id) // Search for the user's id
	.then((user) => {
		return JSON.stringify(user); // Return their properties
	});
}

// getUserName() returns the nickname of the current user
export async function getUserName() {
	const id = wixUsersBackend.currentUser.id;
	return wixUsersBackend.getUser(id) // Search for the user's id
	.then((user) => {
		return user.nickname;  // Return their nickname
	});
}