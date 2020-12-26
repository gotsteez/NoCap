/**
 * 
 * @param d {number} the delay in milliseconds
 */
export default async function delay(d: number) {
	return new Promise((resolve) => setTimeout(resolve, d))
}