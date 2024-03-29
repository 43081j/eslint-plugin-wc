export const knownNamespaces = new Set([
  'primer',
  'polymer',
  'x',
  'rdf',
  'xml',
  'annotation',
  'color',
  'font',
  'missing',

  // https://www.webcomponents.org/collections
  'ct',
  'color',
  'currency',
  'smart',
  'github',
  'elementui',
  'smart',
  'github',
  'elementui',
  'progressive',
  'cpss',
  'xgd',
  'paper',
  'hy',
  'polymorph',
  'granite',
  'plastic',
  'vega',
  'catalyst',
  'gathr',
  'fs',
  'cr',
  'mqtt',
  'simpla',
  'iron',
  'topseed',
  'awesome',
  'ts',
  'globalization',
  'super',
  's',
  'scary',
  'best',
  'paper',
  'platinum',
  'paper',
  'layout',
  'iron',
  'app',
  'data',
  'gold',
  'elements',
  'pf',
  'paperfire',
  'core',
  'nodecg',
  'titanium',
  'lrndesign',
  'lrn',
  'hax',
  'k4ng',
  'ros',
  'geo',
  'ibm',
  'google',
  'gfs',
  'geoloeg',
  'ami',
  'google',
  'medical',
  'cordova',
  'cth',
  'paper',
  'gui',
  'network',
  'dialogs',
  'layouts',

  // https://github.com/nuxodin/web-namespace-registry/
  'lume',
  'three',
  'fast',
  'a11y',
  'lrn',
  'mdl',
  'mui',
  'pure',
  'uk',
  'auro',
  'ui5',
  's',
  'ng',
  'amp',
  'spectrum',
  'sp',
  'smart',
  'hiq',
  'ibm',
  'google',
  'a',
  'tangy',
  'bs',
  'ion',
  'mwc',
  'mdc',
  'mat',
  'mv',
  'iron',
  'paper',
  'gold',
  'std',
  'aria',
  'dile',
  'lion'
]);

export const builtInTagClassMap: Record<keyof HTMLElementTagNameMap, string> = {
  a: 'HTMLAnchorElement',
  abbr: 'HTMLElement',
  address: 'HTMLElement',
  area: 'HTMLAreaElement',
  article: 'HTMLElement',
  aside: 'HTMLElement',
  audio: 'HTMLAudioElement',
  b: 'HTMLElement',
  base: 'HTMLBaseElement',
  bdi: 'HTMLElement',
  bdo: 'HTMLElement',
  blockquote: 'HTMLQuoteElement',
  body: 'HTMLBodyElement',
  br: 'HTMLBRElement',
  button: 'HTMLButtonElement',
  canvas: 'HTMLCanvasElement',
  caption: 'HTMLTableCaptionElement',
  cite: 'HTMLPhraseElement',
  code: 'HTMLElement',
  col: 'HTMLTableColElement',
  colgroup: 'HTMLTableColElement',
  data: 'HTMLDataElement',
  datalist: 'HTMLDataListElement',
  dd: 'HTMLElement',
  del: 'HTMLModElement',
  details: 'HTMLDetailsElement',
  dfn: 'HTMLElement',
  dialog: 'HTMLDialogElement',
  div: 'HTMLDivElement',
  dl: 'HTMLDListElement',
  dt: 'HTMLElement',
  em: 'HTMLElement',
  embed: 'HTMLEmbedElement',
  fieldset: 'HTMLFieldSetElement',
  figcaption: 'HTMLElement',
  figure: 'HTMLElement',
  footer: 'HTMLElement',
  form: 'HTMLFormElement',
  h1: 'HTMLHeadingElement',
  h2: 'HTMLHeadingElement',
  h3: 'HTMLHeadingElement',
  h4: 'HTMLHeadingElement',
  h5: 'HTMLHeadingElement',
  h6: 'HTMLHeadingElement',
  head: 'HTMLHeadElement',
  header: 'HTMLElement',
  hgroup: 'HTMLElement',
  hr: 'HTMLHRElement',
  html: 'HTMLHtmlElement',
  i: 'HTMLElement',
  iframe: 'HTMLIFrameElement',
  img: 'HTMLImageElement',
  input: 'HTMLInputElement',
  ins: 'HTMLModElement',
  kbd: 'HTMLElement',
  label: 'HTMLLabelElement',
  legend: 'HTMLLegendElement',
  li: 'HTMLLIElement',
  link: 'HTMLLinkElement',
  main: 'HTMLElement',
  map: 'HTMLMapElement',
  mark: 'HTMLElement',
  menu: 'HTMLMenuElement',
  meta: 'HTMLMetaElement',
  meter: 'HTMLMeterElement',
  nav: 'HTMLElement',
  noscript: 'HTMLElement',
  object: 'HTMLObjectElement',
  ol: 'HTMLOListElement',
  optgroup: 'HTMLOptGroupElement',
  option: 'HTMLOptionElement',
  output: 'HTMLOutputElement',
  p: 'HTMLParagraphElement',
  picture: 'HTMLPictureElement',
  pre: 'HTMLPreElement',
  progress: 'HTMLProgressElement',
  q: 'HTMLQuoteElement',
  rp: 'HTMLElement',
  rt: 'HTMLElement',
  ruby: 'HTMLElement',
  s: 'HTMLElement',
  samp: 'HTMLElement',
  search: 'HTMLElement',
  script: 'HTMLScriptElement',
  section: 'HTMLElement',
  select: 'HTMLSelectElement',
  slot: 'HTMLSlotElement',
  small: 'HTMLElement',
  source: 'HTMLSourceElement',
  span: 'HTMLSpanElement',
  strong: 'HTMLElement',
  style: 'HTMLStyleElement',
  sub: 'HTMLElement',
  summary: 'HTMLElement',
  sup: 'HTMLElement',
  table: 'HTMLTableElement',
  tbody: 'HTMLTableSectionElement',
  td: 'HTMLTableCellElement',
  template: 'HTMLTemplateElement',
  textarea: 'HTMLTextAreaElement',
  tfoot: 'HTMLTableSectionElement',
  th: 'HTMLTableCellElement',
  thead: 'HTMLTableSectionElement',
  time: 'HTMLTimeElement',
  title: 'HTMLTitleElement',
  tr: 'HTMLTableRowElement',
  track: 'HTMLTrackElement',
  u: 'HTMLElement',
  ul: 'HTMLUListElement',
  var: 'HTMLElement',
  video: 'HTMLVideoElement',
  wbr: 'HTMLElement'
};

export const builtInTagClassList = Object.values(builtInTagClassMap);
