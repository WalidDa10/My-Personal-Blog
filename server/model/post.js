const mongoose = require( 'mongoose');
const { Schema } = mongoose;

const postSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    body: {
        type : String,
        required: true,
    },
    excerpt:{
        type: String,
        required: false
    },
    createdAt: { type: Date , default: Date.now() },
    updatedAt: { type: Date , default: Date.now() }
});

module.exports = mongoose.model('Post' ,postSchema )