const results = document.getElementById("results");
const apiURL = "https://keyboard-smash.herokuapp.com";

const fetchLibrary = async () => {
  const response = await fetch(`${apiurl}/keyboardsmashlibrary`).then((res) =>
    res.json()
  );

  library = response.data;
};

async function createLibraryCard(ul, data) {
  const li = document.createElement("li");
  const deleteFromLibrary = document.createElement("button");
  deleteFromLibrary.setAttribute("class", "action-button");
  deleteFromLibrary.innerText = "Remove";
  const p = document.createElement("p");
  p.innerText = data.contents;
  li.appendChild(deleteFromLibrary);
  li.appendChild(p);
  ul.appendChild(li);
  deleteFromLibrary.onclick = async () => await onDelete(li, data.ks_id);
}

const onDelete = async (li, ks_id) => {
  await deleteFromLibrary(ks_id);
  li.remove();
};

const deleteFromLibrary = async (ks_id) => {
  await fetch(`${apiurl}/keyboardsmashlibrary/${ks_id}`, {
    method: "DELETE",
  });
};

const showKeyboardsSmash = async () => {
  await fetchLibrary();
  const ul = document.createElement("ul");
  library.forEach((element) => {
    createLibraryCard(ul, element);
  });
  results.appendChild(ul);
};
showKeyboardsSmash();
