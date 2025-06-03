let queue = [];

function addToQueue(user) {
  if (!queue.some((u) => u.userId === user.userId)) {
    queue.push(user);
    return true;
  }
  return false;
}

function removeFromQueue(socketId) {
  queue = queue.filter((user) => user.socketId !== socketId);
}

function getNextInQueue() {
  return queue.shift(); // Removes and returns first item
}

function getQueue() {
  return [...queue];
}

export { addToQueue, removeFromQueue, getNextInQueue, getQueue };
