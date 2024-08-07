const axios = require("axios");
const postcodeURL = "https://api.os.uk/search/places/v1/postcode";

async function postcodeLookup(postcode, isPrev) {

  const addresses = await axios.get(`${postcodeURL}?key=${process.env.OSAPIKEY}&postcode=${postcode}`);

  const formattedAddresses = addresses.data?.results
    .map((address, index) => {

      const canonicalAddress = mapToCanonical(address.DPA);

      let formattedAddress;
      const option = formatOptionString(canonicalAddress);

      formattedAddress = mapToUseableFormat(canonicalAddress);
      formattedAddress.id = index;
      formattedAddress.option = option;

      return formattedAddress
    });

  return [{ option: `${formattedAddresses.length} addresses found` }, ...formattedAddresses];
}

function extractAddressFields(address) {
  let buildingNames = [];
  let streetNames = [];
  let localityNames = [];

  // handle building name
  if (address.departmentName) {
    buildingNames.push(address.departmentName);
  }
  if (address.organisationName) {
    buildingNames.push(address.organisationName);
  }
  if (address.subBuildingName) {
    buildingNames.push(address.subBuildingName);
  }
  if (address.buildingName) {
    buildingNames.push(address.buildingName);
  }

  // street names
  if (address.buildingNumber) {
    streetNames.push(address.buildingNumber);
  }
  if (address.dependentStreetName) {
    streetNames.push(address.dependentStreetName);
  }
  if (address.streetName) {
    streetNames.push(address.streetName);
  }

  // locality names
  if (address.doubleDependentAddressLocality) {
    localityNames.push(address.doubleDependentAddressLocality);
  }
  if (address.dependentAddressLocality) {
    localityNames.push(address.dependentAddressLocality);
  }
  if (address.addressLocality) {
    localityNames.push(address.addressLocality);
  }
  return { buildingNames, streetNames, localityNames };
}

function formatOptionString(address) {
  const { buildingNames, streetNames, localityNames } =
    extractAddressFields(address);

  const fullBuildingName = buildingNames ? buildingNames.join(" ") : null;
  const fullLocality = localityNames ? localityNames.join(" ") : null;
  const fullStreetName = streetNames ? streetNames.join(" ") : null;

  if (fullStreetName) {
    return `${fullBuildingName} ${fullStreetName}, ${fullLocality}, ${address.postalCode}`.trim();
  } else {
    return `${fullBuildingName}, ${fullLocality}, ${address.postalCode}`.trim();
  }

}

function mapToCanonical(address) {
  const canonicalAddress = {
    organisationName: address.ORGANISATION_NAME ?? null,
    departmentName: address.DEPARTMENT_NAME ?? null,
    subBuildingName: address.SUB_BUILDING_NAME ?? null,
    buildingNumber: address.BUILDING_NUMBER ?? null,
    dependentStreetName: address.DEPENDENT_THOROUGHFARE_NAME ?? null,
    doubleDependentAddressLocality: address.DOUBLE_DEPENDENT_LOCALITY ?? null,
    dependentAddressLocality: address.DEPENDENT_LOCALITY ?? null,
    buildingName: address.BUILDING_NAME ?? null,
    streetName: address.THOROUGHFARE_NAME ?? null,
    addressLocality: address.POST_TOWN ?? null,
    postalCode: address.POSTCODE ?? null
  }
  return canonicalAddress
}

/**
 * User research address modal
 * address-flat-number-current
 * address-house-number-current
 * address-house-name-current
 * address-dependent-street
 * address-street-current
 * address-dependent-address-locality
 * address-city-current
 * //
 * address-year-current-year
 *
 */

function mapToUseableFormat(address) {
  return {
    'address-flat-number': address.subBuildingName,
    'address-house-number': address.buildingNumber,
    'address-house-name': address.buildingName,
    'address-dependent-street': address.dependentStreetName,
    'address-street': address.streetName,
    'address-city': address.addressLocality,
    'address-dependent-address-locality': address.dependentAddressLocality,
  }
}

module.exports = postcodeLookup;
