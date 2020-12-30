import NoCap from '../index';

(async () => {
	const key = "";
	const googleKey = "";
	const url = "";

	const s = NoCap("2Captcha", key);
	let r1 = await s.reCaptchaV2(googleKey, url);

	console.log(r1);
})();