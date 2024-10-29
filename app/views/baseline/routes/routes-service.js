const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()
const parentDir = '/baseline'

// Add your routes here
router.post(`${parentDir}/service/generate-url`, (req, res) => {
	const { whichConfidence } = req.body; // Get the form data sent with POST

	// Construct the query string and user-readable output
	const buildQueryString = Array.isArray(whichConfidence) ? whichConfidence.join(',') : whichConfidence;
	const buildUserReadout = Array.isArray(whichConfidence)
		? whichConfidence.join(' ➔ ')
		: whichConfidence;

	// Construct the complete URI
	const startURI = req.protocol + '://' + req.get('host');
	const userURI = `${startURI}${parentDir}/customise-example?confidence=${buildQueryString}`;

	// Render a response, passing the generated URL and readable text
	res.render(`${parentDir}/service/customise`, { userURI, buildUserReadout });
})

module.exports = router;
