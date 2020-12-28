import TwoCaptcha  from './src/solvers/2captcha';
import CapMonster from './src/solvers/CapMonster';
import Manual from './src/solvers/Manual';

interface Options {
	timeout: number;
	polling: number;
};

class NotYetImplemented extends Error {
	constructor() {
		super();
		this.name = "NotYetImplemented";
		this.message = "Service not yet implemented, please created a pull request or suggestion at https://github.com/zMrKrabz/NoCap" 
	};
};

export default function launchSolver(service: "2Captcha" | "CapMonster" | "Manual", key: string, options?: Options) {
	switch (service) {
		case "2Captcha":
			return new TwoCaptcha(key, options);
		case "CapMonster":
			return new CapMonster(key, options);
		case "Manual":
			return new Manual(options);
		default:
			throw new NotYetImplemented();
	};
};