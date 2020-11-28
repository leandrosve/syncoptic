/** Timeout that returns a promise so that it can be awaited. */
const timeout = (ms:number):Promise<any> => {
    return new Promise((resolve)=>setTimeout(resolve, ms));
}

export default timeout;
