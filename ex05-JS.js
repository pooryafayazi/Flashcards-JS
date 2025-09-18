let myCards = [];
let current = 0; 
let showing = 'question';
let editingIndex = null;

const saveToCookie = () => {
    Cookies.set('cards', JSON.stringify(myCards), { expires: 365, path: '/' });
};

const loadFromCookie = () => {
    const raw = Cookies.get('cards');
    if (!raw) return;
    try { myCards = JSON.parse(raw) || []; } catch { myCards = []; }
};


const enterAddMode = () => {
    document.getElementById('cardcontain').style.display = 'none';
    document.getElementById('switch').style.display = 'none';
    document.getElementById('editcard').style.display = 'none';
    document.getElementById('deletecard').style.display = 'none';

    document.getElementById('question').hidden = false;
    document.getElementById('answer').hidden = false;
    document.getElementById('savecard').hidden = false;
    document.getElementById('cancel').hidden = false;
};


const exitAddMode = () => {
    document.getElementById('cardcontain').style.display = 'inline-block';
    document.getElementById('switch').style.display = 'inline-block';
    document.getElementById('editcard').style.display = 'inline-block';
    document.getElementById('deletecard').style.display = 'inline-block';

    document.getElementById('question').hidden = true;
    document.getElementById('answer').hidden = true;
    document.getElementById('savecard').hidden = true;
    document.getElementById('cancel').hidden = true;

    editingIndex = null;
    document.getElementById('savecard').textContent = 'Save Card';
};

const renderCard = () => {
    const txt = document.getElementById('cardcontain');
    const toggleA = document.getElementById('toggleLink');
    const toggleEdit = document.getElementById('editcard');
    const toggleDelet = document.getElementById('deletecard');

    if (myCards.length === 0) {
        txt.textContent = 'No cards available!';
        toggleA.textContent = 'show answer';
        toggleA.style.pointerEvents = 'none';
        toggleA.style.opacity = '0.5';
        toggleEdit.style.pointerEvents = 'none';
        toggleEdit.style.opacity = '0.5';
        toggleDelet.style.pointerEvents = 'none';
        toggleDelet.style.opacity = '0.5';

        return;
    }

    toggleA.style.pointerEvents = '';
    toggleA.style.opacity = '';
    toggleEdit.style.pointerEvents = '';
    toggleEdit.style.opacity = '';
    toggleDelet.style.pointerEvents = '';
    toggleDelet.style.opacity = '';

    const card = myCards[current];
    if (showing === 'question') {
        txt.textContent = card.question || '(empty question)';
        toggleA.textContent = 'show answer';
    } else {
        txt.textContent = card.answer || '(empty answer)';
        toggleA.textContent = 'show question';
    }
};


const addCard = () => {
    editingIndex = null;
    document.getElementById('question').value = '';
    document.getElementById('answer').value = '';
    document.getElementById('savecard').disabled = true;
    enterAddMode();
};


const editCard = () => {
    if (myCards.length === 0) return;
    editingIndex = current;
    const { question, answer } = myCards[current];
    document.getElementById('question').value = question || '';
    document.getElementById('answer').value = answer || '';
    document.getElementById('savecard').textContent = 'Update';
    enterAddMode();
};


const cancel = () => exitAddMode();

const saveCard = () => {
    const q = document.getElementById('question').value.trim();
    const a = document.getElementById('answer').value.trim();
    if (!q || !a) return;

    if (editingIndex !== null) {
        myCards[editingIndex] = { question: q, answer: a };
        current = editingIndex;
    } else {
        myCards.push({ question: q, answer: a });
        current = myCards.length - 1;
    }
    saveToCookie();

    showing = 'question';
    exitAddMode();
    renderCard();
};


const deleteCard = () => {
  if (myCards.length === 0) return;
  if (!confirm('Delete this card?')) return;

  myCards.splice(current, 1);
  if (current >= myCards.length) current = Math.max(0, myCards.length - 1);

  saveToCookie();
  showing = 'question';
  renderCard();
};


const nextCard = (e) => {
    if (e) e.preventDefault();
    if (myCards.length === 0) return;
    current = (current + 1) % myCards.length;
    showing = 'question';
    renderCard();
};


const prevCard = (e) => {
    if (e) e.preventDefault();
    if (myCards.length === 0) return;
    current = (current + myCards.length - 1) % myCards.length;
    showing = 'question';
    renderCard();
};


const toggleQA = (e) => {
    if (e) e.preventDefault();
    if (myCards.length === 0) return;
    showing = (showing === 'question') ? 'answer' : 'question';
    renderCard();
};


const checkInputs = () => {
    const q = document.getElementById('question').value.trim();
    const a = document.getElementById('answer').value.trim();
    document.getElementById('savecard').disabled = !(q && a);
};


window.onload = () => {
    loadFromCookie();
    renderCard();

    document.getElementById('prevLink').addEventListener('click', prevCard);
    document.getElementById('nextLink').addEventListener('click', nextCard);
    document.getElementById('toggleLink').addEventListener('click', toggleQA);

    document.getElementById('question').addEventListener('input', checkInputs);
    document.getElementById('answer').addEventListener('input', checkInputs);
};