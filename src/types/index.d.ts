export {};

declare global {
	namespace Express {
		interface Request {
			user: any; // 👈️ turn off type checking
		}
	}
}

// https://bobbyhadz.com/blog/typescript-property-does-not-exist-on-type-request
