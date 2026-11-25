const { intro, bio, contact, services, projects } = window.portfolio;
const $ = (selector) => document.querySelector(selector);
function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}
function link(text, url, className) {
  const node = element('a', className, text);
  node.href = url;
  if (url.startsWith('https:')) {
    node.target = '_blank';
    node.rel = 'noopener noreferrer';
  }
  return node;
}
function screenshot(project, variant, loading = 'lazy') {
  const image = element('img');
  image.src = './' + project.id + '-' + variant + '.jpg';
  const page = { product: ' product page', collection: ' collection page' };
  image.alt = project.name + (page[variant] || ' homepage');
  image.loading = loading;
  return image;
}

$('#intro').textContent = intro;
$('#bio').textContent = bio;
services.forEach(([title, description], index) => {
  const row = element('article', 'service-row');
  row.append(element('span', 'service-num', String(index + 1).padStart(2, '0')), element('h3', '', title), element('p', '', description));
  $('#service-list').append(row);
});
const contacts = [['Email Oluwabori', contact.email && 'mailto:' + contact.email], ['Instagram →', contact.instagram], ['LinkedIn →', contact.linkedin]];
contacts.filter(([, url]) => url).forEach(([title, url]) => $('#contact-links').append(link(title, url, 'pill white')));
if (!$('#contact-links').children.length) {
  $('#contact-links').append(element('p', 'contact-pending', 'Project inquiries will open once contact details are added.'));
}

const dialog = $('#case');
const caseBody = $('#case-body');
function showProject(project) {
  const heading = element('h2', '', project.name);
  heading.id = 'case-title';
  const top = element('div', 'case-heading');
  top.append(element('p', 'eyebrow', project.category), heading, element('p', '', project.summary));

  const buttons = element('div', 'device-buttons');
  buttons.setAttribute('role', 'group');
  buttons.setAttribute('aria-label', 'Homepage device preview');
  const stage = element('figure', 'device-stage');
  const frame = element('div', 'device-frame');
  const caption = element('figcaption', 'device-caption');
  caption.setAttribute('aria-live', 'polite');
  stage.append(frame, caption);
  const devices = [['Desktop', 'desktop'], ['Laptop', 'laptop'], ['Mobile phone', 'phone']];
  function showDevice(device) {
    buttons.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.device === device)));
    frame.className = 'device-frame ' + device;
    const mobileCapture = device === 'phone' && project.mobile;
    frame.replaceChildren(screenshot(project, mobileCapture ? 'mob' : device === 'laptop' && project.laptop ? 'lap' : 'desk', 'eager'));
    if (device === 'phone' && !project.mobile) {
      caption.replaceChildren('Desktop capture fitted inside a phone frame. ', link('Open the responsive live site →', project.url));
    } else {
      caption.textContent = device === 'laptop' ? (project.laptop ? 'Homepage captured at a 1,200-pixel laptop viewport.' : 'Desktop capture displayed at laptop scale.') : mobileCapture ? 'Mobile homepage capture.' : 'Desktop homepage capture.';
    }
  }
  devices.forEach(([label, device]) => {
    const button = element('button', '', label);
    button.type = 'button';
    button.dataset.device = device;
    button.addEventListener('click', () => showDevice(device));
    buttons.append(button);
  });
  showDevice('desktop');

  const breakdown = element('section', 'breakdown');
  breakdown.append(element('h3', '', 'Page breakdown'));
  const grid = element('div', 'breakdown-grid');
  project.points.forEach(([title, copy, url]) => {
    const item = element('article');
    item.append(element('h4', '', title), element('p', '', copy));
    if (url) item.append(link('Open collection →', url));
    grid.append(item);
  });
  breakdown.append(grid);
  if (project.role) breakdown.append(element('p', '', 'My role · ' + project.role));
  if (project.result) breakdown.append(element('p', '', 'Outcome · ' + project.result));
  if (project.product) {
    const pages = element('div', 'page-previews');
    const collection = project.points.find(([title]) => title === 'Collection');
    for (const [variant, title, url] of [['collection', 'Collection page', collection[2]], ['product', 'Product page', project.product]]) {
      const preview = element('figure', 'product-preview');
      preview.append(screenshot(project, variant), link('Open the live ' + title.toLowerCase() + ' →', url));
      pages.append(preview);
    }
    breakdown.append(pages);
  }
  caseBody.replaceChildren(top, buttons, stage, breakdown, link('Visit live storefront →', project.url, 'pill primary'));
  dialog.showModal();
  dialog.scrollTop = 0;
}
const workStage = $('#projects');
const workPicker = $('#work-picker');
const workButtons = [];
let activeProject = 0;

function selectProject(index) {
  activeProject = (index + projects.length) % projects.length;
  const project = projects[activeProject];
  const card = element('article', 'project work-feature');
  const cover = element('button', 'cover');
  cover.type = 'button';
  cover.setAttribute('aria-label', 'View ' + project.name + ' breakdown');
  cover.append(screenshot(project, 'desk', 'eager'), element('span', 'cover-arrow', '→'));
  cover.addEventListener('click', () => showProject(project));

  const info = element('div', 'project-info');
  info.append(
    element('p', 'eyebrow', project.category),
    element('h3', '', project.name),
    element('p', 'project-summary', project.summary)
  );
  const open = element('button', 'pill primary', 'View breakdown →');
  open.type = 'button';
  open.addEventListener('click', () => showProject(project));
  info.append(open);
  card.append(cover, info);
  workStage.replaceChildren(card);

  workButtons.forEach((button, position) => {
    button.setAttribute('aria-pressed', String(position === activeProject));
  });
  $('#work-position').textContent = (activeProject + 1) + ' / ' + projects.length;
  $('#work-position').setAttribute('aria-label', project.name + ', project ' + (activeProject + 1) + ' of ' + projects.length);
}

projects.forEach((project, index) => {
  const button = element('button', 'work-thumbnail');
  button.type = 'button';
  const image = screenshot(project, 'desk');
  image.alt = '';
  button.append(image, element('span', '', project.name));
  button.addEventListener('click', () => selectProject(index));
  workButtons.push(button);
  workPicker.append(button);
});
$('#work-prev').addEventListener('click', () => selectProject(activeProject - 1));
$('#work-next').addEventListener('click', () => selectProject(activeProject + 1));
selectProject(0);

dialog.addEventListener('click', event => {
  if (event.target === dialog) {
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  }
});
