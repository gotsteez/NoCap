import solver from '../src/solvers/2captcha';

(async () => {
	const key = "";
	const googleKey = "";
	const url = "";

	const s = new solver(key);
	let r1 = await s.reCaptchaV2(googleKey, url);

	console.log(r1);
})();