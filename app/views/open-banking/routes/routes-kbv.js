const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()
const parentDir = '/open-banking'
const fs = require('fs-extra') // needed to import the json data

// Add your routes here

// Load JSON data from file
function loadJSONFromFile(fileName, path = 'app/data/') {
	let jsonFile = fs.readFileSync(path + fileName)
	return JSON.parse(jsonFile) // Return JSON as object
}

// Sets the KBV question routing based on customisation questions OR skips KBVs if it's the COI/6MFC journey
router.post(`${parentDir}/fraud-cri/kbv-question-selection`, function (req, res) {
	var kbvQuestionSet = req.session.data['kbv']
	var continuityIdentity = req.session.data['continuityIdentity']
	if (continuityIdentity) {
		res.redirect('../ipv-core/page-ipv-success')
	} else if (kbvQuestionSet == "experian") {
		res.redirect('../kbv-cri/experian-kbv-start')
	} else if (kbvQuestionSet == "hmrc") {
		res.redirect('../nino-cri/enter-national-insurance-number')
	} else if (kbvQuestionSet == "dwp") {
		res.redirect('../ipv-core/personal-independence-payment')
	} else {
		res.redirect('../kbv-cri/experian-kbv-start')
	}
})

// Sets the KBV question pass/fail based on customisation questions
router.post(`${parentDir}/kbv-cri/transition-spinner`, function (req, res) {
	var passFail = req.session.data['passFail']
	if (passFail == "pass") {
		res.redirect('../ipv-core/page-ipv-success')
	} else if (passFail == "fail") {
		res.redirect('../ipv-core/kbv-fail')
	} else {
		res.redirect('../ipv-core/page-ipv-success')
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
		return res.redirect('kbv-transition-spinner');
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

// Experian KBV routes
// pass data to KBV question page
router.get(`${parentDir}/kbv-cri/experian-kbv-question`, function (req, res) {

	// pull in JSON data file if someone jumps directly to this page
	if (!req.session.data['kbvs']) {
		let idvFile = 'kbvs-experian-mvp.json'
		let path = 'app/data/'
		req.session.data['kbvs'] = loadJSONFromFile(idvFile, path)
	}
	let index = 0
	// check if there is a query string from someone using devmode
	const questionCode = req.query.q
	// if the query is there override all other logic
	if (questionCode) {
		index = req.session.data.kbvs.questions.map(e => e.code).indexOf(questionCode)
		// console.log(req.session.data.kbvs.questions.map(e => e.code).indexOf('high4'))
	}

	// check for backwards movements in the KBVs and show error if caught
	let backlinkalert = 'false'
	// look for the question requested and see if it been answered already

	if (req.session.data['kbvtracker']) {
		// grab question tracker object with list of queued questions
		const kbvTracker = req.session.data['kbvtracker']
		// loop through the object and compare the requested question again the ones in the tracker
		const keys = Object.keys(kbvTracker)
		keys.forEach((key, index) => {
			if (`${key}` === questionCode && `${kbvTracker[key]}` === 'true') {
				console.log('key matched')
				backlinkalert = 'true'
			}
		})
	}

	// route
	if (backlinkalert === 'true') {
		let question = req.session.data.kbvs.questions[index].newquestion
		let code = req.session.data.kbvs.questions[index].code
		req.session.data.prototype.errorcode = 'pyi-kbv-back'
		res.redirect('/pyi/v32/error')
	} else {
		// grab the items we need to display and make the form work
		let question = req.session.data.kbvs.questions[index].newquestion
		let code = req.session.data.kbvs.questions[index].code
		let hint = req.session.data.kbvs.questions[index].hinttext
		let option1 = req.session.data.kbvs.questions[index].option1
		let option2 = req.session.data.kbvs.questions[index].option2
		let option3 = req.session.data.kbvs.questions[index].option3
		let option4 = req.session.data.kbvs.questions[index].option4
		let option5 = req.session.data.kbvs.questions[index].option5
		let option6 = req.session.data.kbvs.questions[index].option6
		let total = req.session.data.kbvs.questions.length

		return res.render(`${parentDir}/kbv-cri/experian-kbv-question`, {
			'question': question,
			'code': code,
			'hint': hint,
			'option1': option1,
			'option2': option2,
			'option3': option3,
			'option4': option4,
			'option5': option5,
			'option6': option6,
			'total': total
		})
	}
})

// Experian question picker - runs after spinner - creates a list of questions and stores them
router.post(`${parentDir}/kbv-cri/experian-question-picker`, function (req, res) {
	let prototype = {};

	// Load JSON data file
	let idvFile = 'kbvs-experian-mvp.json';
	let path = 'app/data/';
	req.session.data['kbvs'] = loadJSONFromFile(idvFile, path);

	// Initialize prototype data
	prototype.total = req.session.data.kbvs.questions.length;
	prototype.count = 0;

	let kbvGroup = [];

	// Check if specific questions are identified
	let experianKBV = req.session.data['experianKBV'];
	if (experianKBV === 'specific') {
		// If specific, set kbvGroup to predefined questions from kbvGroupings
		var kbvGroupings = ['Q00050', 'Q00090', 'Q00038'];
		kbvGroup = kbvGroupings;
	} else {
		// Otherwise, randomly select 3 questions from the JSON data
		let questions = req.session.data.kbvs.questions;
		kbvGroup = questions
			.sort(() => 0.5 - Math.random())  // Shuffle questions
			.slice(0, 3)                       // Select first 3 shuffled questions
			.map(question => question.code);   // Extract the question codes for kbvGroup
	}

	// Create a tracker object to track progress on the chosen questions
	const kbvTracker = {};
	kbvGroup.forEach(key => {
		kbvTracker[key] = false; // Set each question's status to "unanswered"
	});

	// Push the tracker object back to session data
	req.session.data['kbvtracker'] = kbvTracker;

	// Set the first question in the tracker as the next question
	req.session.data['kbvNext'] = kbvGroup[0];

	// Redirect to the first question in the selected KBV group
	let target = `experian-kbv-question?q=${kbvGroup[0]}`;
	res.redirect(target);
});

// KBV questions - find next question or go to spinner page
router.post(`${parentDir}/kbv-cri/kbv-question-answered`, function (req, res) {

	// pull back the kbv tracker objects from the data store or set some if they don't exist
	let kbvTracker = req.session.data['kbvtracker'] || { 'Q00016': false, 'Q00042': false, 'Q00068': false, 'Q00050': false }

	// pull back the number of the question just submitted - it's a hidden field on question page
	let kbvCurrent = req.session.data['kbvNum']

	// need to work out the index of the current question in the group
	// turn the object into an array
	var questions = Object.keys(kbvTracker)
	// find the index
	var index = questions.indexOf(kbvCurrent)

	// set current question answered status to true
	kbvTracker[kbvCurrent] = true

	let target = ''
	let kbvNext = Object.keys(kbvTracker)[index + 1]
	req.session.data['kbvNext'] = kbvNext

	if (Object.keys(kbvTracker)[index + 1] === 'Q00000') {
		target = 'kbv-checking'
	} else {
		// is it the last question?
		if (index === questions.length - 1) {
			// go to spinner page
			target = 'kbv-transition-spinner'
		} else {
			// get the next question
			target = 'experian-kbv-question?q=' + kbvNext
		}
	}

	// redirect to the next question or the spinner if done
	res.redirect(target)

})

module.exports = router;
