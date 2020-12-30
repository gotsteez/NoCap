import TwoCaptcha  from './src/solvers/2captcha';
import CapMonster from './src/solvers/CapMonster';
import { Options, CaptchaClient } from './src/utils/types';

class NotYetImplemented extends Error {
	constructor() {
		super();
		this.name = "NotYetImplemented";
		this.message = "Service not yet implemented, please created a pull request or suggestion at https://github.com/zMrKrabz/NoCap" 
	};
};

export { 
	TwoCaptcha, 
	CapMonster,
	CaptchaClient,
};

export default function launchSolver(service: "2Captcha" | "CapMonster", key: string, options?: Options): CaptchaClient {
	switch (service) {
		case "2Captcha":
			return new TwoCaptcha(key, options);
		case "CapMonster":
			return new CapMonster(key, options);
		default:
			throw new NotYetImplemented();
	};
};