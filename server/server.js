// FIXME: Feel free to remove this :-)
console.log('\n\nGood Luck! 😅\n\n');
import Todo from './todo';

const fs = require('fs');
const firstTodos = require('../data');
let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);

let DB = firstTodos.map((t,i) => {
    // Form new Todo objects
    return new Todo(i,t.title);
});

http.listen(3003, function(){
    console.log('listening on *:3003');
});

io.on('connection', (client) => {
    console.log('[*] A client connected');
    // This is going to be our fake 'database' for this application
    // Parse all default Todo's from db
    // FIXME: DB is reloading on client refresh. It should be persistent on new client connections from the last time the server was run...


    // Sends a message to the client to reload all todos
    const reloadTodos = () => {
        io.emit('load', DB);
    };

    // Accepts when a client makes a new todo
    client.on('make', (t) => {
        // Make a new todo
        let current_id = 0;
        if (DB.length > 0){
            current_id = DB[DB.length - 1].id + 1;
        }

        const newTodo = new Todo(current_id, t.title);

        // Push this newly created todo to our database
        DB.push(newTodo);

        // Send the latest todos to the client
        // Done: neFIXME: This sends all todos every time, could this be more efficient?
        fs.writeFile('../data.json', JSON.stringify(DB), 'utf8', function(err){
            if (err){
                console.log(err);
                throw err;
            }else {
                io.emit('new', newTodo);
            }
        });

    });

    // Delete a single todo based on id
    client.on('delete', (id) => {
        DB = DB.filter(todo => todo.id !== id);

        fs.writeFile('../data.json', JSON.stringify(DB), 'utf8', function(err){
            if (err){
                console.log(err);
                throw err;
            }else {
                console.log("Deleted item with id: " + id);
                io.emit('delete:sync', id);
            }
        });

    });

    client.on('delete_all', () => {

        DB = [];

        fs.writeFile('../data.json', JSON.stringify(DB), 'utf8', function(err){
            if (err){
                console.log(err);
                throw err;
            }else {
                console.log("Deleted all");
                io.emit('delete_all:sync');
            }
        });

    });

    client.on('complete_all', () => {

        DB.forEach(todo=>todo.completed=true);
        fs.writeFile('../data.json', JSON.stringify(DB), 'utf8', function(err){
            if (err){
                console.log(err);
                throw err;
            }else {
                console.log("completed all");
                io.emit('complete_all:sync');
            }
        });
    });

    client.on('complete', (id) => {

        let index = DB.findIndex(todo => todo.id === id);
        DB[index].completed = true;
        fs.writeFile('../data.json', JSON.stringify(DB), 'utf8', function(err){
            if (err){
                console.log(err);
                throw err;
            }else {
                console.log("Completed item with id: " + id);
                io.emit('complete:sync', id);
            }
        });
    });

    // Send the DB downstream on connect
    reloadTodos();
});

console.log('Waiting for clients to connect');
