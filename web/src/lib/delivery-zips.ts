// List of Arizona Zip Codes roughly within a 25-mile radius of Scottsdale (85251)
// Includes Scottsdale, Paradise Valley, Tempe, Mesa, Phoenix, Fountain Hills, Chandler

export const VALID_DELIVERY_ZIPS = [
    // Scottsdale
    "85250", "85251", "85252", "85253", "85254", "85255", "85256", "85257", "85258", "85259", "85260", "85261", "85262", "85266", "85267", "85271",

    // Paradise Valley
    "85253",

    // Phoenix (North/East/Central likely within range)
    "85003", "85004", "85006", "85007", "85008", "85012", "85013", "85014", "85016", "85018", "85020", "85021", "85022", "85023", "85024", "85027", "85028", "85029", "85032", "85040", "85042", "85044", "85045", "85048", "85050", "85054",

    // Tempe
    "85280", "85281", "85282", "85283", "85284", "85285", "85287",

    // Mesa (West/Central)
    "85201", "85202", "85203", "85204", "85205", "85206", "85207", "85210", "85213", "85215",

    // Chandler
    "85224", "85225", "85226", "85248", "85249", "85286",

    // Fountain Hills
    "85268",

    // Gilbert
    "85233", "85234", "85295", "85296", "85297", "85298"
];

export function isDeliveryAddressValid(zipCode: string): boolean {
    const cleanZip = zipCode.trim().substring(0, 5);
    return VALID_DELIVERY_ZIPS.includes(cleanZip);
}
