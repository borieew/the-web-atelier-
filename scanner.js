const scanMenu = $('#scan-menu');
const scanScreen = $('#scan-screen');
const scanRange = $('#scan-range');
const scanImage = $('#scan-image');
const scanNotes = $('#scan-notes');
const scanMarkers = $('#scan-markers');
const scanButtons = [];
const markerPositions = [[79, 23], [53, 51], [26, 75]];

function updateScan() {
  const value = scanRange.valueAsNumber;
  scanScreen.style.setProperty('--split', value + '%');
  scanRange.setAttribute('aria-valuetext', 100 - value + '% revealed');
  const markers = Array.from(scanMarkers.children);
  Array.from(scanNotes.children).forEach((note, index) => {
    const revealed = value <= markerPositions[index][0];
    markers[index].classList.toggle('revealed', revealed);
    note.classList.toggle('revealed', revealed);
    note.hidden = !revealed;
  });
}

function selectScan(project, selectedButton) {
  scanButtons.forEach(button => button.setAttribute('aria-pressed', String(button === selectedButton)));
  $('#scan-store').textContent = new URL(project.url).hostname;
  scanImage.src = 'assets/img/' + project.id + '-desk.jpg';
  scanImage.alt = project.name + ' homepage screenshot';
  scanMarkers.replaceChildren();
  scanNotes.replaceChildren();
  project.points.slice(0, 3).forEach(([title, description], index) => {
    const [x, y] = markerPositions[index];
    const mark = element('span', 'scan-marker', String(index + 1));
    mark.style.left = x + '%';
    mark.style.top = y + '%';
    scanMarkers.append(mark);
    const note = element('li', 'scan-note');
    note.append(element('span', 'note-number', String(index + 1)), element('strong', '', title), element('p', '', description));
    scanNotes.append(note);
  });
  scanRange.value = '58';
  updateScan();
}

projects.forEach(project => {
  const button = element('button', '', project.name);
  button.type = 'button';
  button.addEventListener('click', () => selectScan(project, button));
  scanButtons.push(button);
  scanMenu.append(button);
});
scanRange.addEventListener('input', updateScan);
scanScreen.addEventListener('pointerdown', event => {
  if (event.button !== 0) return;
  scanRange.focus({ preventScroll: true });
  scanScreen.setPointerCapture(event.pointerId);
  moveScanner(event);
});
scanScreen.addEventListener('pointermove', event => {
  if (scanScreen.hasPointerCapture(event.pointerId)) moveScanner(event);
});

function moveScanner(event) {
  const bounds = scanScreen.getBoundingClientRect();
  scanRange.value = String(Math.round((event.clientX - bounds.left) / bounds.width * 100));
  updateScan();
}

selectScan(projects[0], scanButtons[0]);
