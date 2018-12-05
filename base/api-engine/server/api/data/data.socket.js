/** 
 * Broadcast updates to client when the model changes 
 */ 

const data = require('./data.model');
var socket = undefined;

exports.register = (_socket) => {
    socket = _socket;
};

function onSave(doc) {
    //TODO: Send data to only the intended device
    socket.emit('data:save:' + doc.macAddress, doc);
}

module.exports.onSave = onSave;