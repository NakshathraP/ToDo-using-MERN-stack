const findAllItems = (collection) => {
    return new Promise((resolve, reject) => {
        collection.find({}).toArray()
        .then((todoItems) => {
            resolve(todoItems);
        })
        .catch((err) => reject(err))
    })
}

const createTodo = (collection, todoItem) => {
    return new Promise((resolve, reject) => {
        collection.insertOne(todoItem, (err, msg) => {
            if(err) console.log(err);

            findAllItems()
            .then((todoItems) => resolve({todoItems, msg}))
            .catch((err) => reject(err))
        });
    });
}

module.exports = {
    createTodo,  findAllItems
}













