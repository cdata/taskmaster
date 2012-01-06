var argv = require('optimist').argv,
    path = require('path'),
    fs = require('fs'),
    q = require('q'),
    colors = require('colors');

function log(out) {

    console.log('task '.blue + '  log '.cyan + out);
}

function task(name, out) {

    log(name.yellow + ' ' + out);
}

function error(name, out) {

    var passedName = name;

    name = out ? name : undefined;
    out = out ? out : passedName;

    console.log('task '.blue + 'error'.red.inverse + ' ' + (name ? name.yellow + ' ' : '') + out);
}

function okay(name, out) {

    var passedName = name;

    name = out ? name : undefined;
    out = out ? out : passedName;

    console.log('task '.blue + ' okay '.green + (name ? name.yellow + ' ' : '') + out);
}

fs.readdir(
    path.resolve('./tasks'),
    function(err, files) {

        if(err)
            error("Cannot find a 'tasks' directory at the current path.");
        else if(!files.length)
            error("No tasks available.");
        else {

            var askedForHelp = argv._[0] === 'help',
                taskName = askedForHelp ? argv._[1] : argv._[0],
                taskMatcher = /(.*)\.js$/i,
                runTask = function() {

                    try {

                        var resolvedTask = require(path.resolve('./tasks/' + taskName)),
                            showUsage = function() {

                                var usage = resolvedTask.usage;

                                if(usage) {
                                    task(taskName, "Usage: ");
                                    task(taskName, usage);
                                }
                            },
                            result = q.defer();

                        if(askedForHelp)
                            showUsage();
                        else {
                            try {

                                task(taskName, "Running...");
                                resolvedTask.run(argv, result);
                                result.promise.then(
                                    function() {

                                        okay(taskName, "Task was completed successfully.");
                                    },
                                    function(reason) {

                                        error(taskName, "There was an error while performing the task. " + (reason ? reason.toString() : ''));
                                        showUsage();
                                    }
                                );
                            } catch(e) {

                                error(taskName, "Task exited prematurely during execution. " + e.message);
                                showUsage();
                            }
                        }

                    } catch(e) {

                        error(taskName, "There was an error loading the task. " + e.message);
                    }
                },
                listAvailableTasks = function() {

                    log("Available tasks:");
                    log( 
                        files.reduce(
                            function(previous, file) {

                                var match = file.match(taskMatcher)

                                if(match && match[1])
                                    return (previous && (previous + ", ")) + match[1];

                                return previous;
                            },
                            ''
                        )
                    );
                    log("To view usage for a task:");
                    log("task help <task name>");
                };
 
            if(!taskName) {

                if(!askedForHelp)
                    error("You must specify a task to run.");

                listAvailableTasks();
            } else
                runTask();
        }
    }
);
