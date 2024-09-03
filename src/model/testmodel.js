// define a schema
import mongoose from "mongoose";
import User from "./user.mode.js";
const animalSchema = new mongoose.Schema({ name: String, type: String },
    {
        // Assign a function to the "statics" object of our animalSchema through schema options.
        // By following this approach, there is no need to create a separate TS type to define the type of the statics functions.
        statics: {
            findByName(name) {
                return this.find({ name: new RegExp(name, 'i') });
            },
            findAll() {
                return this.find({});
            }
        }
    });

// Or, Assign a function to the "statics" object of our animalSchema
animalSchema.statics.findByName = function (name) {
    return this.find({ name: new RegExp(name, 'i') });
};
// Or, equivalently, you can call `animalSchema.static()`.
animalSchema.static('findByBreed', function (breed) { return this.find({ breed }); });

const Animal = mongoose.model('Animal', animalSchema);
mongoose.connect('mongodb://localhost/test').then(async function () {
    let animals = await Animal.findByName('fido');
    animals = animals.concat(await Animal.findByBreed('Poodle'));
    console.log(animals);
});
mongoose.connect('mongodb://localhost/test').then(async function () {
    let users = await User.findAllUsers();
    console.log(users);
});
