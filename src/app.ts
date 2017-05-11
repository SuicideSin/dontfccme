import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as http from 'http'
import * as path from 'path'
import { ApiRouter } from './api/'

var app = express();
app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/api', ApiRouter);

http.createServer(app).listen(app.get('port'), function () {
	console.log('Express server running on http://localhost:' + app.get('port'));
});
