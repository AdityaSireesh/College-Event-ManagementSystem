import mongoose from 'mongoose'

mongoose.connect("") // Add connection string
.then(() => {
    console.log("Db connected");
})
.catch((err) => {
    console.log(err);
});
