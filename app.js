const feathers = require('@feathersjs/feathers')
const express = require('@feathersjs/express')
const socketio = require('@feathersjs/socketio')
const moment = require('moment');
const cors = require('cors')

//  Idea service
class IdeaService {
    constructor() {
        this.ideas = [];

    }

    async find() {
        return this.ideas;
    }

    async create(data) {
        const idea = {
            id: this.ideas.length,
            text: data.text,
            tech: data.tech,
            viewer: data.viewer
        }
        idea.time = moment().format('h:mm:ss a');

        this.ideas.push(idea)


        return idea;
    }
}
 

const app = express(feathers())

// parse middlewares
app.use(express.json())
app.use(cors())

//  Config Socket.io realtime APIs
app.configure(socketio())

//Enable REST services
app.configure(express.rest())

// register services
app.use('/ideas', new IdeaService());

//  new connection connects to stream channel
app.on('connection', conn => app.channel('stream').join(conn))

// Publish events to stream
app.publish(data => app.channel('stream'));

const PORT = process.env.PORT || 3030;

app.listen(PORT).on('listening', () => {
    console.log(`Real time Server running on port ${PORT}`)
})

// app.service('ideas').create({
//     text: 'build a cool app',
//     tech: "Node.js",
//     veiwer: "John Doe",
//     time: moment().format('h:mm:ss a')
// })
 