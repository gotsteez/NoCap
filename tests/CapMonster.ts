import solver from '../index';

(async () => {
	const s = solver("CapMonster", "");

	console.log(await s.reCaptchaV2("", ""));
})()