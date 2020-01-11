const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes)

app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404);
    throw error;
})

app.use((error, req, res, next) => {
    if(res.headerSent) {
        // check if our response has already been sent
        // if this is the case we return next with the error (which mean we don't send an error of our own becaue we can only send one response total)
        return next(error)
    }
    res.status(error.code || 500);
    res.json({message: error.message || 'An unknown error occured!'});

    /* How to use this function?
        Either we trigger it by throwing an error in our route or we call next() and pass it our error
        both work but one difference, if we are in unsync code then we have to use the next(error)
    */
});

mongoose
    .connect(
        'mongodb://localhost:27017/visitedMERN',
        {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        })
    .then(() => {
        const PORT = 5000;

        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    })
    .catch(err => {
        console.log(err)
    })

