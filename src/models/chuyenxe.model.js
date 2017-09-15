import mongoose, { Schema } from 'mongoose';

const chuyen = new Schema({
    sochuyen:{
        type: String,
        unique: true,
    },
    inTrip:{
        type: Schema.Types.ObjectId,
        ref:'trips'
    },
    laixevaphuxe:{
        type: Schema.type.ObjectId,
        ref:'users'
    },
    coach:{
        type: Schema.Types.ObjectId,
        ref: 'coachs'
    },
    ticketsInChuyen:[
        {
            type: Schema.Types.ObjectId,
            ref: 'tickets'
        }
    ],
    tinhtrang:[

    ]
}, { timestamps: true });