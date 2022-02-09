const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArtSchema = new Schema({

    title: { 
        type: String, 
    },

    description: { 
        type: String, 

    },
    select: {
        type: String, 
    },
    
    image: {
        type: String,
    }, 
    timestamps: {
        createdAt: Date,
        updatedAt: Date,
    }
    

    // timestamps: true
})



const User = mongoose.model("Artworks", ArtSchema)

module.exports = User