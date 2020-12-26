import solver from '../src/solvers/2captcha';

(async () => {
	const key = "3a8c3f3dee970a3d90d64008e5b8ce31";
	const googleKey = "6Lc9sScUAAAAALTk003eM2ytnYGGKQaQa7usPKwo";
	const url = "https://queue-it.com";

	const s = new solver(key);
	let r1 = s.reCaptchaV2(googleKey, url);
	let r2 = s.reCaptchaV2(googleKey, url);

	Promise.all([r1, r2]);
})();