const firestore = firebase.firestore();
let tasks = [];
let currentUser = {};

function getUser() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      currentUser.uid = user.uid;
      getTasks();
      let userLabel = document.getElementById("navbarDropdown");
      userLabel.innerHTML = user.email;
    } else {
      swal({
        icon: "success",
        title: "Redirecionando para a tela de autenticação",
      }).then(() => {
        setTimeout(() => {
          window.location.replace("auth.html");
        }, 1000);
      });
    }
  });
}

function renderTasks() {
  let itemList = document.getElementById("itemList");
  itemList.innerHTML = "";

  for (let task of tasks) {
    // Create HTML elements
    let li = document.createElement("li");
    let button = document.createElement("button");

    // Add the respective classes
    li.classList.add("list-group-item", "d-flex", "justify-content-between");
    button.classList.add("btn", "btn-primary");

    // Add onclick action to button
    button.setAttribute("onclick", `delTask("${task.id}")`);

    // Put together
    button.appendChild(document.createTextNode("Excluir"));
    li.appendChild(document.createTextNode(task.title));
    li.appendChild(button);

    // Add created element to itemList
    itemList.appendChild(li);
  }
}

async function getTasks() {
  tasks = [];
  const logTasks = await firestore.collection("tasks").where("owner", "==", currentUser.uid).get();
  for (doc of logTasks.docs) {
    tasks.push({
      id: doc.id,
      title: doc.data().title,
    });
  }
  renderTasks();
}

async function addTask() {
  const itemList = document.getElementById("itemList");
  const newItem = document.createElement("li");
  newItem.classList.add("list-group-item", "d-flex", "justify-content-between");
  newItem.appendChild(document.createTextNode("Adicionando na nuvem ..."));
  itemList.appendChild(newItem);

  const record = {
    title: document.getElementById("newItem").value,
    owner: currentUser.uid,
  };
  await firestore.collection("tasks").add(record);
  getTasks();
}

async function delTask(id) {
  await firestore.collection("tasks").doc(id).delete();
  getTasks();
}

window.onload = function () {
  getUser();
};
