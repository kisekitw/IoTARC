const Device = require('./device.model');

//TODO: Get all devices
exports.index = function (req, res) {
    //TODO: Get current user
    var currentUser = req.user._id;

    //TODO: Get only devices related to the current user
    Device.find({
        createdBy: currentUser
    }, (err, devices) => {
        
        if (err) {
            return res.status(500).send(err);
        }

        res.status(200).json(devices);
    });
};

//TODO: Add a new device
exports.create = function (req, res) {
    console.log('aaaaa');
    var newDevice = req.body;

    //TODO: this device is created by the current user
    newDevice.createdBy = req.user._id;
    Device.create(newDevice, (err, device) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(device);
    });
};

//TODO: Get a single device
// exports.show = function (req, res, next) {
//     var deviceId = req.params.id;

//     Device.findOne({
//         _id: deviceId,
//         createdBy: req.user._id
//     }, (err, device) => {
//         if (!err) {
//             return res.status(500).send(err);
//         }

//         if (!device) {
//             return res.status(404).end();
//         }

//         res.json(device);
//     });
// };
/** 
 * Get a single device 
 */ 
exports.show = function(req, res, next) { 
    var deviceId = req.params.id; 
    // the current user should have created this device 
    Device.findOne({ 
        _id: deviceId, 
        createdBy: req.user._id 
    }, function(err, device) { 
        if (err) return res.status(500).send(err); 
        if (!device) return res.status(404).end(); 
        res.json(device); 
    }); 
};

//TODO: Update a device
exports.update = (req, res, next) => {
    var deviceId = req.params.id;
    var device = req.body;
    device.createdBy = req.user._id;

    Device.findOne({
        _id: deviceId,
        createdBy: req.user._id
    }, (err, device) => {
        if (!err) {
            
            return res.status(500).send(err);
        }
        if (!device) {
            return res.status(404).end()
        }

        device.save((err, updatedDevice) => {
            if (!err) {
                return res.status(500).send(err);
            }

            return res.status(200).json(updatedDevice);
        });
    });
};

exports.destroy = function(req, res) { 
    Device.findOne({ 
        _id: req.params.id, 
        createdBy: req.user._id 
    }, function(err, device) { 
        if (err) return res.status(500).send(err); 
 
        device.remove(function(err) { 
            if (err) return res.status(500).send(err); 
            return res.status(204).end(); 
        }); 
    }); 
};



