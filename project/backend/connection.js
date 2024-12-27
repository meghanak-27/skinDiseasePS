const mongoose = require("mongoose");

async function connectDB() {
    const uri = `mongodb+srv://kandagatlameghana9:${process.env.DB_PASSWORD}@cluster0.5fdkl.mongodb.net/skin-disease?retryWrites=true&w=majority`;

    try {
        // Connect to MongoDB Atlas using mongoose
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to MongoDB Atlas successfully.");
    } catch (err) {
        console.error("Error connecting to MongoDB Atlas:", err);
        process.exit(1); 
    }
}

module.exports = { connectDB };
