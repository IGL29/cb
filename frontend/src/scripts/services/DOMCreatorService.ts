export class DOMCreatorService {
  static _instance: DOMCreatorService;
  private documentRoot: Document;

  constructor(documentRoot: Document = document) {
    if (DOMCreatorService._instance) {
      return DOMCreatorService._instance;
    }
    DOMCreatorService._instance = this;
    this.documentRoot = documentRoot;
  }

  public createElement: typeof this.documentRoot.createElement = <
    T extends keyof HTMLElementTagNameMap
  >(
    tagName: T
  ) => this.documentRoot.createElement(tagName);

  public createElementNS = <K extends keyof SVGElementTagNameMap>(
    namespaceURI: 'http://www.w3.org/2000/svg',
    tagName: K
  ) => this.documentRoot.createElementNS(namespaceURI, tagName);
}
