import TwoCaptcha  from './src/solvers/2captcha';
import CapMonster from './src/solvers/CapMonster';

interface Options {
	timeout: number;
	polling: number;
};

class NotYetImplemented extends Error {
	constructor() {
		super();
		this.message = "Service not yet implemented, please created a pull request or suggestion at https://github.com/zMrKrabz/NoCap" 
	};
};

export default function launchSolver(service: "2Captcha" | "CapMonster", key: string, options?: Options) {
	switch (service) {
		case "2Captcha":
			return new TwoCaptcha(key, options);
		case "CapMonster":
			return new CapMonster(key, options);
		default:
			throw new NotYetImplemented();
	};
};