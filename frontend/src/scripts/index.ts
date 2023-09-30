import { AppPresenter } from '~presenters/AppPresenter';
import { DOMCreatorService } from '~services/DOMCreatorService';
import { RouterPresenter } from '~presenters/RouterPresenter';
import { RequestConfig } from '~services/RequestConfig';
import { Requests } from '~services/Requests';
import { ApiFetchService } from '~services/apiClient/FetchClient';
import { ApiWebSocket } from '~services/apiWebSocket/ApiWebSocket';
import { routes } from '~router/routerConfig';
import { mount } from '~utils/mount';

import '~styles/index.css';

const requestConfig = new RequestConfig({
  apiClient: new ApiFetchService(),
  apiWebSocket: new ApiWebSocket(),
  url: `${API_URL}:${API_PORT}`,
  protocolRest: API_PROTOCOL_REST,
  protocolWS: API_PROTOCOL_WS
});

new Requests(requestConfig);
new RouterPresenter({ routes, isScrollTop: true });
new DOMCreatorService();

const app = new AppPresenter().render();
mount('#app', app);
