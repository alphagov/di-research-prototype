const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()
const parentDir = '/driving-licence-auth'
const postcodeLookup = require("../../../api/postcode-lookup");

// Add your routes here

// Checks the postcode against the postcode lookup API and redirects accordingly
router.post(`${parentDir}/address-cri/address-postcode-current-post`, async function (req, res) {
	const postcode = req.body["address-postcode-current"] ?? "SW12 1AA";
	try {
		const addresses = await postcodeLookup(postcode);
		req.session.data["searched-addresses-current"] = addresses;
		res.redirect("address-picker-current");
	} catch (error) {
		res.redirect("find-current-address-error");
	} return
});

// Try postcode again or enter manually
router.post(`${parentDir}/address-cri/address-error-choice-post`, function (req, res) {
	const errorchoice = req.session.data['error-choice']
	if (errorchoice === 'continue') {
		res.redirect('find-current-address-manual')
	} else {
		res.redirect('find-current-address')
	}
})

// Reads input from API and puts into address format, or uses default address
router.post(`${parentDir}/address-cri/address-picker-current-post`, function (req, res) {
	try {
		const addressId = req.session.data['current-address']
		const address = req.session.data["searched-addresses-current"].find((address) => {
			return Number(address.id) === Number(addressId);
		});
		if (address) {
			const flatNumber = address["address-flat-number"];
			const houseNumber = address["address-house-number"];
			const houseName = address["address-house-name"];
			const dependentStreet = address["address-dependent-street"];
			const street = address["address-street"];
			const dependentNeighbourhood = address["address-dependent-address-locality"];
			const city = address["address-city"]

			req.session.data['address-flat-number-current'] = flatNumber;
			req.session.data['address-house-number-current'] = houseNumber;
			req.session.data['address-house-name-current'] = houseName;
			req.session.data['address-dependent-street-current'] = dependentStreet;
			req.session.data['address-street-current'] = street;
			req.session.data['address-dependent-address-locality-current'] = dependentNeighbourhood;
			req.session.data['address-city-current'] = city

			const line1 = [];
			if (flatNumber) line1.push(flatNumber);
			if (houseName) line1.push(houseName);
			if (dependentStreet) line1.push(dependentStreet)

			const line2 = []
			if (houseNumber) line2.push(houseNumber);
			if (street) line2.push(street);
			if (dependentNeighbourhood) line2.push(dependentNeighbourhood)

			if (flatNumber) {
				req.session.data["address-line1-current"] = line1.join(" ").trim();
				req.session.data["address-line2-current"] = line2.join(" ").trim();
				req.session.data["address-city-current"] = city
				req.session.data["address-county-current"] = ""
			} else if (houseName) {
				req.session.data["address-line1-current"] = line1.join(" ").trim();
				req.session.data["address-line2-current"] = line2.join(" ").trim();
				req.session.data["address-city-current"] = city
				req.session.data["address-county-current"] = ""
			} else if (dependentStreet) {
				req.session.data["address-line1-current"] = line1.join(" ").trim();
				req.session.data["address-line2-current"] = line2.join(" ").trim();
				req.session.data["address-city-current"] = city
				req.session.data["address-county-current"] = ""
			} else {
				req.session.data["address-line1-current"] = line2.join(" ").trim();
				req.session.data["address-line2-current"] = ""
				req.session.data["address-city-current"] = city
				req.session.data["address-county-current"] = ""
			}


		} else {
			throw (new Error(`Cant find address in session id - ${addressId}`))
		}
	} catch (err) {
		req.session.data['address-flat-number-current'] = null

		req.session.data['address-house-number-current'] = "10"
		req.session.data['address-street-current'] = "Downing street"
		req.session.data['address-city-current'] = "London"

		req.session.data["address-line1-current"] = "10 Downing street"
		req.session.data["address-line2-current"] = "";
		req.session.data["address-city-current"] = "London"
		req.session.data["address-county-current"] = ""
	} finally {
		res.redirect('address-screener-current')
	}
})

// If address is entered manually, then it directs you to "When did you start living here"
// If address is chosen from select, it directs you to "Check your address"
router.post(`${parentDir}/address-cri/address-manual-current-post`, function (req, res) {
	const from = req.session.data['from']
	if (from === 'check-answers') {
		res.redirect('address-check')
	} else if (from === 'review-history') {
		res.redirect('address-review')
	} else {
		res.redirect('address-years-current')
	}
})

// screening if user's address is spelled correctly
router.post(`${parentDir}/address-cri/address-screen`, function (req, res) {
	const correct = req.session.data['correct-address']
	if (correct === 'yes') {
		res.redirect('address-years-current')
	} else {
		res.redirect('find-current-address-manual')
	}
})

// Checks how long you've lived at the address and checks if we need more address history
router.post(`${parentDir}/address-cri/address-year-current`, function (req, res) {
	let prototype = req.session.data['prototype'] || {} // set up if doesn't exist

	let movedinyear = req.session.data['address-year-current-year']

	let today = new Date()
	let month = today.getMonth()     // 10 (Month is 0-based, so 10 means 11th Month)
	let year = today.getFullYear()  // 2020
	let lastyear = today.getFullYear() - 1

	console.log('current month: ' + month)
	console.log('current year: ' + year)
	console.log('moved in year: ' + movedinyear)

	let movedinyearadj = Number(movedinyear) + 1
	console.log('moved in year - adjusted: ' + movedinyearadj)
	const from = req.session.data['from']

	if (from === 'review-history') {
		res.redirect('address-review')
	} else if (from === 'check-answers') {
		res.redirect('address-check')
	}
	else {
		// compare current date to date submitted
		// if in jan/feb/mar check the dates
		if (month < 2) {
			// see if it was previous year
			if (movedinyear.toString() > lastyear.toString()) {
				console.log('verdict: need previous address')
				prototype.needPrevAddress = 'true'
				res.redirect('address-postcode-prev')
			} else if (movedinyear.toString() === lastyear.toString()) {
				console.log('verdict: need previous address')
				prototype.needPrevAddress = 'true'
				res.redirect('address-three-months')
			} else {
				console.log('verdict: don\'t need previous address - year didn\'t match')
				prototype.needPrevAddress = 'false'
				res.redirect('address-check')
			}
		} else {
			if (movedinyear.toString() === year.toString()) {
				console.log('verdict: need previous address')
				prototype.needPrevAddress = 'true'
				res.redirect('address-three-months')
			} else {
				console.log('verdict: don\'t need previous address - year didn\'t match')
				prototype.needPrevAddress = 'false'
				res.redirect('address-check')
			}
		}
	}
})

// If user has lived there less than 3 months, need previous address history
router.post(`${parentDir}/address-cri/three-months`, function (req, res) {
	const lived = req.session.data['lived-three']
	if (lived === 'yes') {
		res.redirect('address-check')
	} else {
		res.redirect('find-previous-address')
	}
})

// Checks the postcode against the postcode lookup API and redirects accordingly
router.post(`${parentDir}/address-cri/address-postcode-prev-post`, async function (req, res) {
	const postcode = req.body["address-postcode-prev"] ?? "N15 6QJ";
	try {
		const addresses = await postcodeLookup(postcode, true);
		req.session.data["searched-addresses-prev"] = addresses;
		res.redirect("address-picker-previous");
	} catch (error) {
		res.redirect("find-previous-address-error");
	} return
});

// Reads input from API and puts into address format, or uses default address
router.post(`${parentDir}/address-cri/address-picker-prev-post`, function (req, res) {
	try {
		const addressId = req.session.data['previous-address']
		const address = req.session.data["searched-addresses-prev"].find((address) => {
			return Number(address.id) === Number(addressId);
		});
		if (address) {

			const flatNumber = address["address-flat-number"];
			const houseNumber = address["address-house-number"];
			const houseName = address["address-house-name"];
			const dependentStreet = address["address-dependent-street"];
			const street = address["address-street"];
			const dependentNeighbourhood = address["address-dependent-address-locality"];
			const city = address["address-city"]

			req.session.data['address-flat-number-prev'] = flatNumber;
			req.session.data['address-house-number-prev'] = houseNumber;
			req.session.data['address-house-name-prev'] = houseName;
			req.session.data['address-dependent-street-prev'] = dependentStreet;
			req.session.data['address-street-prev'] = street;
			req.session.data['address-dependent-address-locality-prev'] = dependentNeighbourhood;
			req.session.data['address-city-prev'] = city

			const line1 = [];
			if (flatNumber) line1.push(flatNumber);
			if (houseName) line1.push(houseName);
			if (dependentStreet) line1.push(dependentStreet)

			const line2 = []
			if (houseNumber) line2.push(houseNumber);
			if (street) line2.push(street);
			if (dependentNeighbourhood) line2.push(dependentNeighbourhood)

			if (flatNumber) {
				req.session.data["address-line1-prev"] = line1.join(" ").trim();
				req.session.data["address-line2-prev"] = line2.join(" ").trim();
				req.session.data["address-city-prev"] = city
				req.session.data["address-county-prev"] = ""
			} else if (houseName) {
				req.session.data["address-line1-prev"] = line1.join(" ").trim();
				req.session.data["address-line2-prev"] = line2.join(" ").trim();
				req.session.data["address-city-prev"] = city
				req.session.data["address-county-prev"] = ""
			} else if (dependentStreet) {
				req.session.data["address-line1-prev"] = line1.join(" ").trim();
				req.session.data["address-line2-prev"] = line2.join(" ").trim();
				req.session.data["address-city-prev"] = city
				req.session.data["address-county-prev"] = ""
			} else {
				req.session.data["address-line1-prev"] = line2.join(" ").trim();
				req.session.data["address-line2-prev"] = ""
				req.session.data["address-city-prev"] = city
				req.session.data["address-county-prev"] = ""
			}
		} else {
			throw (new Error(`Cant find address in session id - ${addressId}`))
		}
	} catch (err) {
		req.session.data['address-flat-number-prev'] = null

		req.session.data['address-house-number-prev'] = "10"
		req.session.data['address-street-prev'] = "Downing street"
		req.session.data['address-city-prev'] = "London"

		req.session.data["address-line1-prev"] = "10 Downing street"
		req.session.data["address-line2-prev"] = "";
		req.session.data["address-city-prev"] = "London"
		req.session.data["address-county-prev"] = ""
	} finally {
		res.redirect('address-screener-previous')
	}
})

// screening if user's prev address is spelled correctly
router.post(`${parentDir}/address-cri/address-screen-previous`, function (req, res) {
	const correctprev = req.session.data['correct-prev-address']
	if (correctprev === 'yes') {
		res.redirect('address-check')
	} else {
		res.redirect('find-previous-address-manual')
	}
})

// Try postcode again or enter manually
router.post(`${parentDir}/address-cri/address-error-choice-post-prev`, function (req, res) {
	const errorchoice = req.session.data['error-choice']
	if (errorchoice === 'continue') {
		res.redirect('find-previous-address-manual')
	} else {
		res.redirect('find-previous-address')
	}
})

//
router.post(`${parentDir}/address-cri/address-manual-prev-post`, function (req, res) {
	const from = req.session.data['from']
	let prototype = req.session.data['prototype'] || {} // set up if doesn't exist
	console.log('verdict: don\'t need previous address - year didn\'t match')
	prototype.needPrevAddress = 'false'
	prototype.prev = 'picker'
	req.session.data['prototype'] = prototype // write back these values into the session data
	if (from === 'review-history') {
		res.redirect('address-review')
	} else {
		res.redirect('address-check')
	}
})

// Routing for the address CRI the user sees different screens depending on whether they selected they live in or out the UK in IPV core 
router.post(`${parentDir}/ipv-core/app-success-post`, function (req, res) {
	const liveInUkChoice = req.session.data['live-in-uk-choose'];
	if (liveInUkChoice === "no") {
		// Redirect to a page for users who do not live in the UK
		res.redirect('../address-cri/what-country');
	} else {
		// Redirect to a page for users who live in the UK
		res.redirect('../address-cri/find-current-address')
	}
});

// routing for picking country on international addresses
router.post(`${parentDir}/address-cri/pick-country`, function (req, res) {
	var country = req.session.data['location']
	if (country === 'United Kingdom' || country === 'Isle of Man' || country === 'Jersey' || country === 'Guernsey') {
		res.redirect("../address-cri/find-current-address")
	} else {
		res.redirect("../address-cri/enter-non-uk-address")
	}
});

module.exports = router;