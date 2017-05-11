import * as express from 'express'
export let router = express.Router();

import * as request from 'request'

import { Submission } from '../../submission'

interface PostData {
	fullname: string;
	email: string;
	address: string;
	address2: string;
	city: string;
	state: string;
	zip: string;
	comment: string;
}

router.post('/', function(req, res) {
	let postData: PostData = req.body;
	res.send('Your filing has been queued. You should receive a confirmation email at ' + postData.email + ' when your filing has processed.');
	let processSubmission = () => {
		return new Promise((resolve, reject) => {
			let submission = new Submission();
			submission.data.filers[0].name = postData.fullname;
			submission.data.addressentity.address_line_1 = postData.address;
			submission.data.addressentity.address_line_2 = postData.address2;
			submission.data.addressentity.city = postData.city;
			submission.data.addressentity.state = postData.state;
			submission.data.addressentity.zip_code = postData.zip;
			submission.data.text_data = postData.comment;
			let options: request.CoreOptions = {
				headers: {
					'Pragma': 'no-cache',
					'Origin': 'https://www.fcc.gov',
					'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36',
					'Content-Type': 'application/json;charset=UTF-8',
					'Referer': 'https://www.fcc.gov/ecfs/filings/express/review',
				},
				body: JSON.stringify(submission.data),
			}
			request.post('https://ecfsapi.fcc.gov/filings', options, (error, response, body) => {
				if (error) {
					reject(error);
				}
				if (response.statusCode < 200 || response.statusCode > 299) {
					reject(response.statusCode);
				}
				resolve(body);
			})
		}).then((body) => {
			return 'Success!';
		}).catch((err) => {
			// log error and retry in five seconds
			console.trace(err);
			return new Promise((resolve) => {
				setTimeout(() => {
					resolve()
				}, 5000);
			}).then(processSubmission);
		});
	};
	processSubmission();
});

export let FccQueueRouter = router
