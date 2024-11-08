const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()
const parentDir = '/baseline'

// Add your routes here
router.post(`${parentDir}/service/generate-url`, (req, res) => {
	const { whichConfidence, whichKBV, hmrcSets, passFailKBV, experianKBV } = req.body; // Get the form data sent with POST

	// Construct query strings and filter out '_unchecked' values
	const buildConfidenceString = Array.isArray(whichConfidence) ? whichConfidence.join(',') : whichConfidence || '';
	const buildKBVString = Array.isArray(whichKBV) ? whichKBV.join(',') : whichKBV || '';
	const filteredHMRC = Array.isArray(hmrcSets) ? hmrcSets.filter(item => item !== '_unchecked') : [];
	const buildExperianKBVString = Array.isArray(experianKBV) ? experianKBV.join(',') : experianKBV || '';
	const buildHMRCString = filteredHMRC.join(',');
	const buildPassFailString = Array.isArray(passFailKBV) ? passFailKBV.join(',') : passFailKBV || '';

	// Build the user-readable output
	const buildUserReadout = `${buildConfidenceString} ➔ ${buildKBVString} ➔ ${buildPassFailString} ➔ ${buildExperianKBVString}` + (buildHMRCString ? ` ➔ ${buildHMRCString}` : '');

	// Construct the URI conditionally
	const startURI = req.protocol + '://' + req.get('host');
	let userURI = `${startURI}${parentDir}/authentication/gov-account?confidence=${buildConfidenceString}&kbv=${buildKBVString}&passFail=${buildPassFailString}&experianKBV=${buildExperianKBVString}`;
	if (buildHMRCString) {
		userURI += `&hmrcSet=${buildHMRCString}`;
	}

	// Render a response, passing the generated URL and readable text
	res.render(`${parentDir}/service/customise`, { userURI, buildUserReadout });
})

module.exports = router;
