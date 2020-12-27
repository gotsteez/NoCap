export class MalformedUserKey extends Error {
	constructor() {
		super()
		this.message = "Provided key parameter value in incorrect format";
	}
}

export class KeyDoesNotExist extends Error {
	constructor() {
		super();
		this.message = "Provided key is formatted correctly but does not exist in service";
	}
}

export class InsufficientFunds extends Error {
	constructor() {
		super();
		this.message = "Not enough funds in account to use captcha";
	};
};

export class UndefinedPageURL extends Error {
	constructor() {
		super();
		this.message = "Page URL is not defined in request";
	}
}

export class ServiceBusy extends Error {
	constructor() {
		super();
		this.message = "Service has too much work to do";
	}
}

export class ZeroImageFileSize extends Error {
	constructor() {
		super();
		this.message = "Submitted Captcha image size is 0";
	}
}

export class ImageTooLarge extends Error {
	constructor() {
		super();
		this.message = "Submitted Captcha image is too large";
	}
}

export class UnsupportedFileExtension extends Error {
	constructor() {
		super();
		this.message = "File extension is not jpg, jpeg, gif, or png.";
	}
}

export class ImageTypeNotSupported extends Error {
	constructor() {
		super();
		this.message = "Service can't recognize image file type.";
	}
}

export class UploadError extends Error {
	constructor() {
		super();
		this.message = "Uploaded image is malformed, not in base64.";
	}
}

export class IPNotAllowed extends Error {
	constructor() {
		super();
		this.message = "Settings in service did not whitelist your IP.";
	}
}

export class IPBanned extends Error {
	constructor() {
		super();
		this.message = "IP is banned from service.";
	}
}

export class BadTokenOrPageURL extends Error {
	constructor() {
		super();
		this.message = "In a request for ReCaptchaV2, the googlekey did not match the page url";
	}
} 

export class WrongGoogleKey extends Error {
	constructor() {
		super();
		this.message = "Google key is blank or malformed.";
	}
}

export class BlockedImage extends Error {
	constructor() {
		super();
		this.message = "Unrecognized image and is blocked from the service";
	}
}

export class TooManyBadImages extends Error {
	constructor() {
		super();
		this.message = "Too many bad images are being submitted to service.";
	}
}

export class MaxRequests extends Error {
	constructor() {
		super();
		this.message = "Too many requests to service, please cool down";
	}
}

export class BadParameters extends Error {
	constructor() {
		super();
		this.message = "Bad parameters sent";
	}
}

export class CaptchaNotReady extends Error {
	constructor() {
		super();
		this.message = "Captcha has not been solved yet.";
	}
}

export class UnsolvableCaptcha extends Error {
	constructor() {
		super();
		this.message = "Captcha can not be solved, you will not be charged.";
	}
}

export class WrongCaptchaID extends Error {
	constructor() {
		super();
		this.message = "Captcha ID is not correct or is malformed.";
	}
}

export class TokenExpired extends Error {
	constructor() {
		super();
		this.message = "Token is expired for GeeTest";
	}
}

export default {
	MalformedUserKey,
	KeyDoesNotExist,
	InsufficientFunds,
	UndefinedPageURL,
	ServiceBusy,
	ZeroImageFileSize,
	ImageTooLarge,
	UnsupportedFileExtension,
	ImageTypeNotSupported,
	UploadError,
	IPNotAllowed,
	IPBanned,
	BadTokenOrPageURL,
	WrongGoogleKey,
	BlockedImage,
	TooManyBadImages,
	MaxRequests,
	BadParameters,
	CaptchaNotReady,
	UnsolvableCaptcha,
	WrongCaptchaID,
	TokenExpired,
}