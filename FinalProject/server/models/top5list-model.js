const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Top5ListSchema = new Schema(
    {
        name: { type: String, required: true},
        items: { type: [String], required: true},
        loginName: {type: String},
        community: {type: Boolean, required: true},
        views: {type: Number},
        publishedDate: {type: Date},
        published: {type: Boolean},
        itemSort: {type: [Object]},
        comments: {type: [Object]},
        likes: {type: [String]},
        dislikes: {type: [String]}
    },
    { timestamps: true },
)

module.exports = mongoose.model('Top5List', Top5ListSchema)
