const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Top5ListSchema = new Schema(
    {
        name: { type: String, required: true },
        items: { type: [String], required: true },
        loginName: {type: String, required: true},
        community: {type: Boolean, required: true},
        view: {type: Number},
        publishedDate: {type: Date},
        itemSort: { type: Object },
        comments: {type: [String]},
        likes: {type: Number},
        dislikes: {type: Number}
    },
    { timestamps: true },
)

module.exports = mongoose.model('Top5List', Top5ListSchema)
