export interface Proxy {
	proxyType: "http" | "https" | "socks4" | "socks5";
	proxyAddress: string;
	proxyPort: number;
	proxyLogin?: string; // Username
	proxyPassword?: string;
}

export interface Options {
	timeout: number;
	polling: number;
};

export interface CaptchaClient {
	reCaptchaV2: reCaptchaFunc;
}

interface reCaptchaFunc {
	(googleKey: string, pageURL: string, proxy?: Proxy): Promise<string>;
}