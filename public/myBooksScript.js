let myBooks = [];
const results = document.getElementById("results");

const deleteBook = async (id) => {
  await fetch(`https://booksapinllc.herokuapp.com/books/${id}`, {
    method: "DELETE",
  });
};

const fetchMyBooks = async () => {
  const response = await fetch(
    `https://booksapinllc.herokuapp.com/books`
  ).then((res) => res.json());

  myBooks = response.data;
  //   console.log(myBooks);
};

const showMyBooks = async () => {
  await fetchMyBooks();
  console.log(myBooks);
  myBooks.forEach((element) => {
    const h2 = document.createElement("h2");
    const p = document.createElement("p");
    const button = document.createElement("button");
    const container = document.createElement("container");
    button.onclick = async () => {
      await deleteBook(element.id);
      container.remove();
    };
    h2.innerText = element.title;
    p.innerText = element.author;
    button.innerText = "Delete Book";
    button.classList.add("delete-button");
    container.setAttribute("id", element.id);
    container.appendChild(h2);
    container.appendChild(p);
    container.appendChild(button);
    results.appendChild(container);
  });
};

showMyBooks();
