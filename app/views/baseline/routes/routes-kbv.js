const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()
const parentDir = '/baseline'
const fs = require('fs-extra') // needed to import the json data

// Add your routes here

// Load JSON data from file
function loadJSONFromFile(fileName, path = 'app/data/') {
	let jsonFile = fs.readFileSync(path + fileName)
	return JSON.parse(jsonFile) // Return JSON as object
}

router.get(`${parentDir}/kbv-cri/get-hmrc-question`, function (req, res) {
	// if the journey hasn't got specific questions set

	// create a default if the sequence isn’t set
	if (req.session.data['sequence'] === undefined) {
		req.session.data['sequence'] = 'payslip-ni,payslip-tax,taxcredit-1,taxcredit-2';
	}

	// Initialize journey length to 0
	let journeyLength = 0;
	console.log('journeyLength: ' + journeyLength);

	// examine the sequence and start working through it
	let progressTracker = req.session.data['progressTracker'];
	let journeyTracker = req.session.data['sequence'].split(',');
	let journeyLength2 = journeyTracker.length;
	console.log('journeyLength: ' + journeyLength2);

	let currentQuestionType = journeyTracker[progressTracker];

	// keep asking questions until they are all answered, then redirect to the success page
	if (progressTracker < journeyTracker.length) {
		req.session.data['progressTracker']++;
	} else {
		return res.redirect('../ipv-core/page-ipv-success');
	}

	// load our questions
	let hmrcFile = 'hmrc-questions.json'
	let path = 'app/data/'
	let HMRCquestions = loadJSONFromFile(hmrcFile, path);

	// show the user the first HMRC question unless...
	// we can find the specific one we want to show them

	for (i = 0; i < HMRCquestions.questions.length; i++) {
		if (HMRCquestions.questions[i].code == currentQuestionType) {
			currentQuestion = i;
		}
	}

	let code = HMRCquestions.questions[currentQuestion].code;
	let title = HMRCquestions.questions[currentQuestion].title;
	let subtitle = HMRCquestions.questions[currentQuestion].subtitle;
	let instructions = HMRCquestions.questions[currentQuestion].instructions;
	let instructionsParagraph = HMRCquestions.questions[currentQuestion].instructionsParagraph;
	let derivation = HMRCquestions.questions[currentQuestion].derivation;
	let formRadios = HMRCquestions.questions[currentQuestion].formRadios;
	let formCodeVisible = HMRCquestions.questions[currentQuestion].formCode.visible;
	let formCodePreCustomHtml = HMRCquestions.questions[currentQuestion].formCode.preCustomHtml;
	let formCodePostCustomHtml = HMRCquestions.questions[currentQuestion].formCode.postCustomHtml;
	let formCodeHeading = HMRCquestions.questions[currentQuestion].formCode.heading;
	let formCodeHint = HMRCquestions.questions[currentQuestion].formCode.hint;
	let formCodeInputPrefix = HMRCquestions.questions[currentQuestion].formCode.inputPrefix;
	let formInputClass = HMRCquestions.questions[currentQuestion].formCode.inputClass;


	let postQuestionSummaryText = '';
	let postQuestionHtml = '';

	let preQuestionSummaryText = '';
	let preQuestionHtml = '';

	if (HMRCquestions.questions[currentQuestion].postQuestionDetails.summaryText !== "") {
		postQuestionSummaryText = HMRCquestions.questions[currentQuestion].postQuestionDetails.summaryText;
		postQuestionHtml = HMRCquestions.questions[currentQuestion].postQuestionDetails.html;
	}

	if (HMRCquestions.questions[currentQuestion].preQuestionDetails.summaryText !== "") {
		preQuestionSummaryText = HMRCquestions.questions[currentQuestion].preQuestionDetails.summaryText;
		preQuestionHtml = HMRCquestions.questions[currentQuestion].preQuestionDetails.html;
	}

	let formFields = HMRCquestions.questions[currentQuestion].formCode.formFields;

	// send all the JSON data to the nunjucks template

	return res.render('../kbv-cri/hmrc-question', {
		'code': code,
		'title': title,
		'subtitle': subtitle,
		'instructions': instructions,
		'instructionsParagraph': instructionsParagraph,
		'derivation': derivation,
		'postQuestionSummaryText': postQuestionSummaryText,
		'postQuestionHtml': postQuestionHtml,
		'preQuestionSummaryText': preQuestionSummaryText,
		'preQuestionHtml': preQuestionHtml,
		'formCodeVisible': formCodeVisible,
		'formRadios': formRadios,
		'formCodePreCustomHtml': formCodePreCustomHtml,
		'formCodePostCustomHtml': formCodePostCustomHtml,
		'formCodeHeading': formCodeHeading,
		'formCodeHint': formCodeHint,
		'formCodeInputPrefix': formCodeInputPrefix,
		'formInputClass': formInputClass,
		'formFields': formFields

	})
})

module.exports = router;
