interface IFetch {
  url: URL;
  requestInit?: RequestInit;
}

export default class FetchClientService {
  get({ url, requestInit }: IFetch) {
    return fetch(url, {
      ...requestInit
    });
  }
  post({ url, requestInit }: IFetch) {
    return fetch(url, {
      ...requestInit
    });
  }
}
