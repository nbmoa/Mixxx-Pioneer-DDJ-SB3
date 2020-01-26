var midi = {

    sendShortMsg: function (a, b, c) {
        console.log("a " + a + "b " + b + "c " + c);

    },

    sendSysexMsg: function (a, b) {
        console.log("a " + a + "b " + b);

    }
};

module.exports = midi;
