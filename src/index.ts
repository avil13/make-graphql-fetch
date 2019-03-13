
export interface IMakeGraphqlResponce {
    // get value by key
    get: (key: string, defaultValue?: any) => any;
    // check if has key
    has: (key: string) => boolean;
}


export interface IMakeGraphqlFetch {
    // abort request
    cancel: () => void;
    // abort request
    abort: () => void;
    // adding query
    query: (queryString: string, variables?: any, tag?: string) => IMakeGraphqlFetch;
    // send request
    send: (tag?: string) => Promise<IMakeGraphqlResponce>;
    // run callback thel fetch is loaded
    loaded: (callback: (result?: boolean) => void) => void;
}

interface IQueueItemPrivate {
    tag?: string;
    queryString: string;
    variables?: any;
    sended: boolean;
}

interface IMakeOptions {
    
}

/**
 * Making object for working with requests
 * 
 * @param url url address
 */
export function MakeGraphqlFetch(url?: string, options?: any): void {
    if (!(this instanceof MakeGraphqlFetch)) {
        return new MakeGraphqlFetch(url, options);
    }

    this._url = url;
    this._options = options;
    this._queue = [];
    this._results = {};
}

MakeGraphqlFetch.prototype.query = function (queryString: string, variables?: any, tag?: string): IMakeGraphqlFetch {
    this._queue.push({ queryString, variables, tag, sended: false });
    return this;
};

MakeGraphqlFetch.prototype.send = function (tag?: string) {
    return fetch(this._url, this._options)
        .then(responce => {
            if (responce.ok) {
                return responce.json();
            }
            if (typeof this._options.catch === 'function') {
                this._options.catch(responce);
            } else {
                throw responce;
            }
        })
        .then((data) => {
            if (typeof this._options.prepare === 'function') {
                data = this._options.prepare(data);
            }
            Object.assign(this._results, data);
            return data;
        });
}