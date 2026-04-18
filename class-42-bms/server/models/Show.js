import mongoose from "mongoose";

const showSchema = new mongoose.Schema({
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "movies",
        required: true
    },
    theatre: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "theatres",
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    ticketPrice: {
        type: Number,
        required: true
    },
    bookedSeats: {
        type: [String],
        default: []
    }
}, { timestamps: true });

const Show = mongoose.model("shows", showSchema);

export default Show;