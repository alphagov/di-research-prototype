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

// Sets the KBV question routing based on customisation questions
router.post(`${parentDir}/fraud-cri/kbv-question-selection`, function (req, res) {
	var kbvQuestionSet = req.session.data['kbv']
	if (kbvQuestionSet == "experian") {
		res.redirect('../kbv-cri/experian-kbv-start')
	} else if (kbvQuestionSet == "hmrc") {
		res.redirect('../nino-cri/enter-ni-number')
	} else if (kbvQuestionSet == "dwp") {
		res.redirect('../ipv-core/personal-independence-payment')
	} else {
		res.redirect('../kbv-cri/experian-kbv-start')
	}
})

// HMRC KBV routes
// sets the tracker to 0 for 4 questions
router.get(`${parentDir}/kbv-cri/hmrc-kbv-start`, function (req, res) {
	req.session.data['progressTracker'] = 0;
	res.render(`${parentDir}/kbv-cri/hmrc-kbv-start`)
})

// sets the questions
router.get(`${parentDir}/kbv-cri/get-hmrc-question`, function (req, res) {
	// implement a conditional for the self-assessment type (short or full)
	if (req.session.data['assessment-type'] === undefined) {
		console.log('self-assessment not reached');
	} else {
		if (req.session.data['assessment-type'] === "short-assessment") {
			console.log('remove long assessment');
			req.session.data['hmrcSet'] = req.session.data['hmrcSet'].replace("selfassessment-2,", "");
			console.log(req.session.data['hmrcSet']);
		}
		else {
			console.log('removing short assessment');
			req.session.data['hmrcSet'] = req.session.data['hmrcSet'].replace("selfassessment-3,", "");
			console.log(req.session.data['hmrcSet']);
		}
	}

	// create a default if the sequence isn’t set
	if (req.session.data['hmrcSet'] === undefined) {
		req.session.data['hmrcSet'] = 'payslip-ni,payslip-tax,taxcredit-1,taxcredit-2';
	}

	// examine the sequence and start working through it
	let progressTracker = req.session.data['progressTracker'];
	let journeyTracker = req.session.data['hmrcSet'].split(',');
	let journeyLength = journeyTracker.length;
	console.log('journeyLength: ' + journeyLength);

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

	return res.render(`${parentDir}/kbv-cri/hmrc-question`, {
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
