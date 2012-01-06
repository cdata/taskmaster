# Taskmaster

Taskmaster is a simple tool to enable sane, simple and asynchronous build / deploy tasks in NodeJS-heavy projects.

## Installing

    npm install -g taskmaster

## How does it work

Tasks are NodeJS modules that export a simple interface. Example:

    exports.usage = "task greet <your name>";

    exports.run = function(argv, result) {

        if(argv._[1]) {

            console.log("Hello, " + argv._[1]);
            result.resolve();
        } else
            result.reject("Give me your name, task-master, and I shall give you mine.");
        
    };

Tasks are located inside a "tasks/" directory within your project. When a user types the command "task" in your project directory, Taskmaster takes care of the boilerplate busy work related to informing the user about the universe of options:

    $ cd ./some/cool/project
    $ task
    task error You must specify a task to run.
    task   log Available tasks:
    task   log greeter
    task   log To view usage for a task:
    task   log task help <task name>  

A user can ask for usage related to a specific task:

    $ task help greeter
    task   log greeter Usage:
    task   log greeter task greet <your name>

## Moving forward

This project is still young and naive, and there is much potential robustness to be explored in the exported interface of tasks. Please don't hesitate contact me with any requests or suggestions :)
