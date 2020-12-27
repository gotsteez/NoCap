import solver from '../src/solvers/2captcha';

(async () => {
	const key = "";
	const googleKey = "";
	const url = "";

	const s = new solver(key);
	let r1 = s.reCaptchaV2(googleKey, url);
	let r2 = s.reCaptchaV2(googleKey, url);

	Promise.all([r1, r2]);
})();