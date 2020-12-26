import got, { Got } from 'got';
import delay from '../utils/delay';

interface Options {
	timeout: number;
	polling: number;
};

interface CaptchaOptions {
	method: "userrecaptcha";
	googlekey?: string;
	pageurl?: string;
	invisible?: string;
}

export default class Client {
	options: Options;
	client: Got;

	/**
	 * 
	 * @param key API key for 2captcha
	 * @param options Defined options for timeout and polling, pingback currently not supported
	 */
	constructor(key: string, options: Options = { timeout: 60000, polling: 5000 }) {
		this.options = options;
		this.client = got.extend({
			responseType: 'json',
			searchParams: {
				key: key,
				json: '1',
				soft_id: 2909
			}
		});
	};

	async reCaptchaV2(googleKey: string, pageURL: string) {
		const options: CaptchaOptions = {
			method: "userrecaptcha",
			googlekey: googleKey,
			pageurl: pageURL,
		};

		const id = await this.upload(options);
		console.log(`Created task for ${id}`);
		
		let text = "";

		await delay(this.options.polling);

		while (text === "") {
			let res = await this.fetchResponse(id);

			if (res === "CAPCHA_NOT_READY") {
				console.log(`${id} not ready`);
				await delay(this.options.polling);
			} else {
				text = res;
			};
		};

		return text;
	};

	async upload(options: CaptchaOptions): Promise<string> {
		const url = "https://2captcha.com/in.php";

		interface response {
			request: string
		}

		try {
			const resp = await this.client.post<response>(url, {
				searchParams: { ...options }
			});

			return resp.body.request;
		} catch (err) {
			throw err;
		};
	};

	async fetchResponse(id: string): Promise<string> {
		interface response {
			status: number,
			request: string,
		};

		try {
			const resp = await this.client.get<response>("https://2captcha.com/res.php", {
				searchParams: {
					action: 'get',
					id: id,
				}
			});

			return resp.body.request;
		} catch (err) {
			console.log(err);
			throw err;
		};
	};
};