const mongoose = require('mongoose');
var mongoDb = process.env.DB_MONGO;
mongoose.Promise = global.Promise;

mongoose.set('useFindAndModify', false);
mongoose.connect(mongoDb, {useNewUrlParser : true,useUnifiedTopology: true});

mongoose.connection.on('error', (err) => {
	console.log('DB connection error');
})

mongoose.connection.on('connected', (err) => {
	console.log('DB connected');
})