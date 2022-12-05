const LANG = {
	VI: {
		text: 'VNI',
		lng: 'vi-VN',
		icon: 'CustomVie',
	},
	EN: {
		text: 'ENG',
		lng: 'en-US',
		icon: 'CustomUsa',
	},
	// DE: {
	// 	text: 'Deutsche',
	// 	lng: 'de-DE',
	// 	icon: 'CustomGermany',
	// },
	// FR: {
	// 	text: 'Français',
	// 	lng: 'fr-FR',
	// 	icon: 'CustomFrance',
	// },
	// TR: {
	// 	text: 'Türkçe',
	// 	lng: 'tr-TR',
	// 	icon: 'CustomTurkey',
	// },
};

export const getLangWithKey = (key) => {
	return LANG[Object.keys(LANG).filter((f) => LANG[f].lng === key)];
};

export default LANG;
