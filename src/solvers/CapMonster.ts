import got, { Got } from 'got';
import errors, { CaptchaNotReady } from '../errors';
import delay from '../utils/delay';

const errorTranslation = {
	"ERROR_KEY_DOES_NOT_EXIST": errors.KeyDoesNotExist,
	"ERROR_ZERO_CAPTCHA_FILESIZE": errors.ZeroImageFileSize,
	"ERROR_TOO_BIG_CAPTCHA_FILESIZE": errors.ImageTooLarge,
	"ERROR_ZERO_BALANCE": errors.InsufficientFunds,
	"ERROR_IP_NOT_ALLOWED": errors.IPNotAllowed,
	"ERROR_CAPTCHA_UNSOLVABLE": errors.UnsolvableCaptcha,
	"CAPTCHA_NOT_READY": errors.CaptchaNotReady,
	"ERROR_NO_SUCH_CAPCHA_ID": errors.WrongCaptchaID,
	"WRONG_CAPTCHA_ID": errors.WrongCaptchaID,
	"ERROR_IP_BANNED": errors.IPBanned,
}

interface Options {
	timeout: number;
	polling: number;
};

interface Proxy {
	proxyType: "http" | "https" | "socks4" | "socks5";
	proxyAddress: string;
	proxyPort: number;
	proxyLogin?: string; // Username
	proxyPassword?: string;
}

interface Task {
	type: "ImageToTextTask" | "NoCaptchaTaskProxyless" | "NoCaptchaTask" | "RecaptchaV3TaskProxyless" | "FunCaptchaTask" | "FunCaptchaTaskProxyless" | "HCaptchaTask" | "HCaptchaTaskProxyless";
	websiteURL: string;
	websiteKey: string;

	proxyType?: "http" | "https" | "socks4" | "socks5";
	proxyAddress?: string;
	proxyPort?: number;
	proxyLogin?: string; // Username
	proxyPassword?: string;

	userAgent?: string;
	cookies?: string; // Must be formatted for CapMonster
}

interface CaptchaOptions {
	userAgent?: string;
	cookies?: string; // Must be formatted for CapMonster
}

export default class CapMonster {
	key: string;
	options: Options;
	client: Got;

	constructor(key: string, options: Options = { timeout: 60000, polling: 5000 }) {
		this.client = got.extend({
			responseType: 'json',
		});
		this.key = key;
		this.options = options;
	};

	async reCaptchaV2(googleKey: string, pageURl: string, proxy?: Proxy, captchaOptions?: CaptchaOptions) {
		let task: Task;

		if (proxy === undefined) {
			task = {
				type: "NoCaptchaTaskProxyless",
				websiteKey: googleKey,
				websiteURL: pageURl,
				...captchaOptions
			}
		} else {
			task = {
				type: "NoCaptchaTaskProxyless",
				websiteKey: googleKey,
				websiteURL: pageURl,
				...proxy,
				...captchaOptions
			}
		}

		const id = await this.sendTask(task);
		let solution = "";

		await delay(this.options.polling);
		while (solution === "") {
			try {
				solution = await this.retrieveCaptchaTask(id);
			} catch (err) {
				if (err instanceof CaptchaNotReady) {
					await delay(this.options.polling);
				} else {
					throw err;
				};
			}
		}

		return solution;
	};

	async sendTask(task: Task): Promise<number> {
		const url = "https://api.capmonster.cloud/createTask";

		interface Response {
			errorId: 0 | 1,
			errorCode?: string,
			taskId: number,
		}

		const resp = await this.client.post<Response>(url, {
			json: {
				clientKey: this.key,
				task
			}
		});

		if (resp.body.errorId === 0) {
			return resp.body.taskId;
		} else {
			throw new errorTranslation[resp.body.errorId]();
		};
	};

	async retrieveCaptchaTask(id: number): Promise<string> {
		const url = "https://api.capmonster.cloud/getTaskResult";

		interface Response {
			errorId: 0 | 1,
			errorCode?: string,
			status: "processing" | "ready",
			solution?: {
				gRecaptchaResponse: string
			}
		}

		const resp = await this.client.post<Response>(url, {
			json: {
				clientKey: this.key,
				taskId: id
			}
		});
		
		if (resp.body.status === 'processing') {
			throw new CaptchaNotReady();
		}

		if (resp.body.errorId === 0) {
			// If the error ID is 0, there should be a solution ready
			return resp.body.solution!.gRecaptchaResponse;
		} else {
			throw new errorTranslation[resp.body.errorId]();
		};
	};
};