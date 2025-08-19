const {Schema, model} = require("mongoose")

const commntSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    blogId: {
        type: Schema.Types.ObjectId,
        ref: "blog",
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "user"
    }
}, {timestamps: true});

const Comment = model("comment", commntSchema);

module.exports = Comment;