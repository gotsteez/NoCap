import got, { Got } from 'got';
import delay from '../utils/delay';
import errors, { CaptchaNotReady } from '../errors';
import { Proxy, Options, CaptchaClient } from '../utils/types';

interface CaptchaOptions {
	method: "userrecaptcha";
	googlekey?: string;
	pageurl?: string;
	invisible?: string;
	proxy?: string;
	proxytype?: string;
}

const errorTranslation = {
	"ERROR_WRONG_USER_KEY": errors.MalformedUserKey,
	"ERROR_KEY_DOES_NOT_EXIST": errors.KeyDoesNotExist,
	"ERROR_ZERO_BALANCE": errors.InsufficientFunds,
	"ERROR_PAGEURL": errors.UndefinedPageURL,
	"ERROR_NO_SLOT_AVAILABLE": errors.ServiceBusy,
	"ERROR_ZERO_CAPTCHA_FILESIZE": errors.ZeroImageFileSize,
	"ERROR_TOO_BIG_CAPTCHA_FILESIZE": errors.ImageTooLarge,
	"ERROR_WRONG_FILE_EXTENSION": errors.UnsupportedFileExtension,
	"ERROR_IMAGE_TYPE_NOT_SUPPORTED": errors.ImageTypeNotSupported,
	"ERROR_UPLOAD": errors.UploadError,
	"ERROR_IP_NOT_ALLOWED": errors.IPNotAllowed,
	"IP_BANNED": errors.IPBanned,
	"ERROR_BAD_TOKEN_OR_PAGEURL": errors.BadTokenOrPageURL,
	"ERROR_GOOGLEKEY": errors.WrongGoogleKey,
	"ERROR_CAPTCHAIMAGE_BLOCKED": errors.BlockedImage,
	"TOO_MANY_BAD_IMAGES": errors.TooManyBadImages,
	"MAX_USER_TURN": errors.MaxRequests,
	"ERROR_BAD_PARAMETERS": errors.BadParameters,
	"CAPCHA_NOT_READY": errors.CaptchaNotReady,
	"ERROR_CAPTCHA_UNSOLVABLE": errors.UnsolvableCaptcha,
	"ERROR_WRONG_CAPTCHA_ID": errors.WrongCaptchaID,
	"ERROR_TOKEN_EXPIRED": errors.TokenExpired,
};

export default class TwoCaptcha implements CaptchaClient {
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

	async reCaptchaV2(googleKey: string, pageURL: string, proxy?: Proxy): Promise<string> {
		let options: CaptchaOptions;

		if (proxy !== undefined) {
			options = {
				method: "userrecaptcha",
				googlekey: googleKey,
				pageurl: pageURL,
				proxy: `${proxy.proxyLogin}:${proxy.proxyPassword}@${proxy.proxyAddress}:${proxy.proxyPort}`,
				proxytype: proxy.proxyType.toUpperCase(),
			};
		} else {
			options  = {
				method: "userrecaptcha",
				googlekey: googleKey,
				pageurl: pageURL,
			};
		}

		const id = await this.upload(options);
		
		let text = "";

		await delay(this.options.polling);

		while (text === "") {
			try {
				let res = await this.fetchResponse(id);
				text = res;
			} catch (err) {
				if (err instanceof CaptchaNotReady) {
					await delay(5000);
				} else {
					throw err;
				};
			};
		};

		return text;
	};

	private async upload(options: CaptchaOptions): Promise<string> {
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

	private async fetchResponse(id: string): Promise<string> {
		interface response {
			status: number,
			request: string,
		};

		const resp = await this.client.get<response>("https://2captcha.com/res.php", {
			searchParams: {
				action: 'get',
				id: id,
			}
		});

		if (resp.body.status === 0) {
			throw new errorTranslation[resp.body.request]();
		};

		return resp.body.request;
	};
};