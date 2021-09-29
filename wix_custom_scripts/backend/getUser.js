// Filename: 'backend/getUser.jsw'

import wixUsersBackend from 'wix-users-backend';

export async function getUser() {
	const id = wixUsersBackend.currentUser.id;
	return wixUsersBackend.getUser(id)
	.then((user) => {
		return JSON.stringify(user);
	});
}

export async function getUserName() {
	const id = wixUsersBackend.currentUser.id;
	return wixUsersBackend.getUser(id) // Search for the user's id
	.then((user) => {
		return user.nickname;  // Return their nickname
	});
}