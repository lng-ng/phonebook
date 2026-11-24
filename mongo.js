const mongoose = require('mongoose')



mongoose.set('strictQuery', false)

const phonebookSchema = new mongoose.Schema({
    name: String,
    number: String,
})
const Entry = mongoose.model('Entry', phonebookSchema)

const addNewEntry = (name, number) => {
    const newEntry = Entry({
        name,
        number
    })
    newEntry.save().then(result => {
        console.log("new entry saved")
        mongoose.connection.close()
    })
}

const listAllEntries = () => {
    console.log("listing all entries")
    Entry.find({}).then(result => {
        result.forEach(entry => {
            console.log(entry)
        })
        mongoose.connection.close()
    })
}





const [_, __, password, name, number] = process.argv
const dbURL = `mongodb+srv://longnth2000_db_user:${password}@cluster0.zwjuxij.mongodb.net/phonebook`


if (process.argv.length < 3) {
    console.log('not enough args')
    process.exit(1)
}

mongoose.connect(dbURL, {family: 4})
if (name && number) {
    addNewEntry(name, number)
}
else {
    listAllEntries()
}


