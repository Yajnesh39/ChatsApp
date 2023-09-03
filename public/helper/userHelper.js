const users = [];

//join user to chat
function newUser(id, username, room) {
  const user = { id, username, room };
  users.push(user);
  return user;
}

//get current user
function getActiveUser(id) {
  return users.find(user => user.id === id);
}

//user leaves chat
function exitRoom(id) {
  const index = users.findIndex(user => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

//get room users
function getIndividualRoomUsers(room) {
  return users.filter(user => user.room === room);
}

module.exports = {
  newUser,
  getActiveUser,
  exitRoom,
  getIndividualRoomUsers
};