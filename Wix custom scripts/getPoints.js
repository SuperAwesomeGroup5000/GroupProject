// Filename: public/getUser.js

import wixData from 'wix-data';

// This is clientside instead of serverside for faster load times
export async function getUserPoints(id) {
  
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
