const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()
const parentDir = '/open-banking'

// Add your routes here
router.post(`${parentDir}/service/generate-url`, (req, res) => {
	const { whichConfidence, dlID, whichKBV, hmrcSets, passFailKBV, experianKBV, continuityIdentity } = req.body; // Get the form data sent with POST

	// Construct query strings and filter out '_unchecked' values
	const buildConfidenceString = Array.isArray(whichConfidence) ? whichConfidence.join(',') : whichConfidence || '';
	const buildIDString = Array.isArray(dlID) ? dlID.join(',') : dlID || '';
	const buildKBVString = Array.isArray(whichKBV) ? whichKBV.join(',') : whichKBV || '';
	const filteredHMRC = Array.isArray(hmrcSets) ? hmrcSets.filter(item => item !== '_unchecked') : [];
	const buildExperianKBVString = Array.isArray(experianKBV) ? experianKBV.join(',') : experianKBV || '';
	const buildHMRCString = filteredHMRC.join(',');
	const buildPassFailString = Array.isArray(passFailKBV) ? passFailKBV.join(',') : passFailKBV || '';
	const buildcontinuityIdentity = Array.isArray(continuityIdentity) ? continuityIdentity.join(',') : continuityIdentity || '';

	// Build the user-readable output
	const buildUserReadout = `${buildConfidenceString} ➔ ${buildIDString} ➔ ${buildKBVString} ➔ ${buildPassFailString} ➔ ${buildExperianKBVString} ➔ ${buildcontinuityIdentity}` + (buildHMRCString ? ` ➔ ${buildHMRCString}` : '');

	// Construct the URI conditionally
	const startURI = req.protocol + '://' + req.get('host');
	let userURI = `${startURI}${parentDir}/service/service-start?confidence=${buildConfidenceString}&drivingLicence=${buildIDString}&kbv=${buildKBVString}&passFail=${buildPassFailString}&experianKBV=${buildExperianKBVString}&continuityIdentity=${buildcontinuityIdentity}`;
	if (buildHMRCString) {
		userURI += `&hmrcSet=${buildHMRCString}`;
	}

	// Render a response, passing the generated URL and readable text
	res.render(`${parentDir}/service/customise`, { userURI, buildUserReadout });
})

module.exports = router;
