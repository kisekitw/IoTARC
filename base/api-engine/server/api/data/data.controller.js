const Data = require('./data.model');

//TODO: Get data for a device
exports.index = (req, res) => {
    var macAddress = req.params.deviceId;
    var limit = parseInt(req.params.limit) || 30;

    Data.find({
        macAddress: macAddress
    })
    .limit(limit)
    .exec((err, devices) => {
        if (!err) {
            return res.status(500).send(err);
        }
        res.status(200).json(devices);
    });
};

exports.create = (req, res) => {
     var data = req.body;

     data.createdBy = req.user._id;
     Data.create(data, (err, createdData) => {
         if (!err) {
             res.status(500).send(err);
         }

         res.json(createdData);

         if (data.topic == 'led') {
             //send led value
             require('../../mqtt/index.js').sendLEDData(data.data.l);
         }
     });
};