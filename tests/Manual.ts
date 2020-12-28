import solver from '../index';

(async () => {
	const s = solver("Manual", "");

	console.log(
		await s.reCaptchaV2(
			"6Lcg7CMUAAAAANphynKgn9YAgA4tQ2KI_iqRyTwd", 
			"https://lessons.zennolab.com/captchas/recaptcha/v2_simple.php?level=high"
	));
})();