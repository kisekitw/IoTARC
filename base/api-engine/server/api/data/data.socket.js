/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var data = require('./data.model');
var socket = undefined;

exports.register = function(_socket) {
   socket = _socket;
}

function onSave(doc) {
    //console.log('API ENGINE onSave');
    if (!socket) {
        console.log('OH NO');
        return;
    }
    // send data to only the intended device
    console.log('Emit data:save:'.concat(doc.macAddress));
    socket.emit('data:save:'.concat(doc.macAddress), doc);
}

module.exports.onSave = onSave;
