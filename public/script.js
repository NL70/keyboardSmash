const results = document.getElementById("results");
const add = document.getElementById("add");
const random = document.getElementById("random");
let keyboardSmash = [];

const addKeyboardSmash = async (contents) => {
  const data = {
    contents: contents,
  };
  const response = await fetch(`http://localhost:5000/keyboardsmash`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());
  return response.data;
};

const addToLibrary = async (id) => {
  const data = {
    ks_id: id,
  };
  const response = await fetch("http://localhost:5000/keyboardsmashlibrary", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());
  return response.data;
};

function randomKeyboardSmash() {
  const allLetters = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];
  const numOfLetters = Math.floor(Math.random() * 15 + 1);
  const answer = [];
  for (let i = 0; i < numOfLetters; i++) {
    const randomLetter = Math.floor(Math.random() * 26);
    const capsOrNot = Math.floor(Math.random() * 2 + 1);
    if (capsOrNot === 1) {
      answer.push(allLetters[randomLetter].toLowerCase());
    } else {
      answer.push(allLetters[randomLetter]);
    }
  }
  return answer.join("");
}

async function createKeyboardSmashCard(ul, data) {
  const li = document.createElement("li");
  const remove = document.createElement("button");
  const edit = document.createElement("button");
  const p = document.createElement("p");
  const buttons = document.createElement("div");
  const addToLibrary = document.createElement("button");
  addToLibrary.setAttribute("class", "action-button");
  addToLibrary.innerText = "Save";
  remove.setAttribute("class", "action-button");
  remove.innerText = "Delete";
  buttons.setAttribute("id", "buttons");
  edit.setAttribute("class", "action-button");
  edit.innerText = "Edit";
  buttons.appendChild(edit);
  buttons.appendChild(remove);
  buttons.appendChild(addToLibrary);
  li.appendChild(buttons);
  p.innerText = data.contents;
  li.appendChild(p);

  ul.appendChild(li);
  remove.onclick = async () => await onDelete(data.id, li);
  edit.onclick = async () => await onEdit(data.id, p);

  if (data.is_saved) {
    addToLibrary.setAttribute("disabled", "true");
  }
  addToLibrary.onclick = async () => {
    addToLibrary.setAttribute("disabled", "true");
    await onAddToLibrary(data.id);
  };
}
const onDelete = async (id, li) => {
  await deleteKeyboardSmash(id);
  li.remove();
};

const onEdit = async (id, p) => {
  const contents = prompt("KeyboardSmash");
  await editKeyboardSmash(id, contents);
  p.innerText = contents;
};

const onAddToLibrary = async (id) => {
  await addToLibrary(id);
};

const fetchKeyboardsSmash = async () => {
  const response = await fetch(
    `http://localhost:5000/keyboardsmash`
  ).then((res) => res.json());

  keyboardSmash = response.data;
};

const deleteKeyboardSmash = async (id) => {
  await fetch(`http://localhost:5000/keyboardsmash/${id}`, {
    method: "DELETE",
  });
};

const editKeyboardSmash = async (id, contents) => {
  const data = {
    contents: contents,
  };
  await fetch(`http://localhost:5000/keyboardsmash/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

const showKeyboardsSmash = async () => {
  await fetchKeyboardsSmash();
  const ul = document.createElement("ul");
  keyboardSmash.forEach((element) => {
    createKeyboardSmashCard(ul, element);
  });

  results.appendChild(ul);

  add.onclick = async () => {
    const contents = prompt("KeyboardSmash");
    if (contents) {
      const data = await addKeyboardSmash(contents);
      createKeyboardSmashCard(ul, data);
    }
  };

  random.onclick = async () => {
    const contents = randomKeyboardSmash();
    const data = await addKeyboardSmash(contents);
    createKeyboardSmashCard(ul, data);
  };
};

showKeyboardsSmash();
