const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'))

let items = [];
let id = 0;

let PRIORITY_MAX = 5;

app.get('/api/items', (req, res) => {
    res.send(items);
});

app.get('/api/priority', (req, res) => {
    let data = {priority: PRIORITY_MAX};
    res.send(data);
});

app.post('/api/items', (req, res) => {
    id = id + 1;
    let item = {id:id, text:req.body.text, completed: req.body.completed, priority: req.body.priority};
    items.push(item);
    res.send(item);
});

app.put('/api/items/:id', (req, res) => {
    // Pull the ID from the request parameters
    // This is the thing that's specified by a colon in the API url call
    let id = parseInt(req.params.id);

    let item = null;

    if (id >= 0) {
        // Map the items to their ID
        let itemsMap = items.map(item => { return item.id; });
        let index = itemsMap.indexOf(id);
        // Retrieve the desired Item
        item = items[index];
        // Modify the selected Items data to match the passed info
        item.completed = req.body.completed;
        item.text = req.body.text;

        // handle drag and drop re-ordering
        if (req.body.orderChange) { // If the client specified an order change
            let indexTarget = itemsMap.indexOf(req.body.orderTarget); // Grab the desired ending pos of the item
            items.splice(index,1);
            items.splice(indexTarget,0,item);
        }

        if (req.body.priorityChange) {
            let priority = req.body.priority;
            if (priority < 1 || priority > PRIORITY_MAX) {
                res.status(404).send("Invalid priority number");
                return;
            }
            else {
                item.priority = priority; // Modify the priority
            }
        }
    }

    // Handle the sorting of priorities
    if (req.body.prioritySort) {
        items.sort(function(a, b) { return b.priority - a.priority});
    }

    // Send that puppy as a respone, apparently lol
    if (item) {
        res.send(item);
    }
    else {
        res.send("LUL");
    }

});

// Support for deleting an Item
app.delete('/api/items/:id', (req, res) => {
    let id = parseInt(req.params.id);
    let removeIndex = items.map(item => { return item.id; }).indexOf(id);
    if (removeIndex === -1) {
        // If Item doesn't exist in our list, send an error message and return a 404
        res.status(404).send("Sorry, that item doesn't exist");
        return;
    }
    items.splice(removeIndex, 1);
    res.sendStatus(200);
});
