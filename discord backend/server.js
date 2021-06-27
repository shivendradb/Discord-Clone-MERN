import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import mongoData from './mongoData.js';
import Pusher from 'pusher';

//app config
const app = express();
const port = process.env.PORT || 8002;

const pusher = new Pusher({
    appId: "1206392",
    key: "1706679fc82537bb8053",
    secret: "9a8fd1b49302f8c30a2d",
    cluster: "ap2",
    useTLS: true
});


//Middlewares
app.use(express.json());
app.use(cors());


//db config
const mongoURI = 'mongodb+srv://admin:km4ooDkp0wwvxKMM@cluster0.doqwc.mongodb.net/DiscordDB?retryWrites=true&w=majority';

mongoose.connect(mongoURI, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.once("open", () => {
    console.log("DB connected");

    const changeStream = mongoose.connection.collection("conversations").watch()

    changeStream.on("change", (change) => {
        if (change.operationType === "insert") {
            pusher.trigger("channels", "newChannel", {
                "change": change
            });
        }
        else if (change.operationType === "update") {
            pusher.trigger("conversation", "newMessage", {
                "change": change
            });
        }
        else {
            console.log("Error triggering Pusher");
        }
    })
})




//api routes
app.get("/", (req, res) => {
    res.status(201).send("Great. You got till here!!");
});



app.get("/get/channelList", (req, res) => {

    mongoData.find((err, data) => {
        if (err) {
            res.status(500).send(err);
        }
        else {
            let channels = []

            data.map((channelData) => {
                const channelInfo = {
                    id: channelData._id,
                    name: channelData.channelName,
                }
                channels.push(channelInfo);
            })

            res.status(200).send(channels);
        }
    })
})


app.get('/get/data', (req, res) => {
    mongoData.find((err, data) => {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.status(200).send(data);
        }
    })
})


app.get('/get/conversation', (req, res) => {
    const id = req.query.id;

    mongoData.find({ _id: id }, (err, data) => {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.status(201).send(data);
        }
    })
})


app.post('/new/channel', (req, res) => {
    const dbData = req.body
    console.log(dbData);
    // const dbChannel = dbData.toString();
    mongoData.create(dbData, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(data)
            console.log(data);
        }
    })
})




app.post('/new/message', (req, res) => {
    const newMessage = req.body

    mongoData.updateOne(
        { _id: req.query.id },
        { $push: { conversation: req.body } },

        (err, data) => {

            if (err) {
                res.status(500).send(err);
            }
            else {
                res.status(201).send(data);
            }
        }
    )
})

//listen
app.listen(port, () => {
    console.log("Server started on port: %d", port);
})

