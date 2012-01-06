
exports.usage = "task example <your name>";

exports.run = function(argv, result) {

    if(argv._[1]) {
        console.log("Hello there, " + argv._[1]);
        result.resolve();
    } else
        result.reject("You must specify a name for me to use.");
};
