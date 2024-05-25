import { User } from "./type/number";

class UserView {
  h1Teg: HTMLHeadingElement;
  formUser: HTMLFormElement;
  inputNameUser: HTMLInputElement;
  inputEmailUser: HTMLInputElement;
  inputNumberUser: HTMLInputElement;
  buttonSubmitUser: HTMLButtonElement;

  tableUsers: HTMLTableElement;
  eventOnClickSubmitBtn: () => void;
  dleteUserBtn: (index: number) => void;
  changeUserBtn: (index: number) => void;

  constructor(users: User[]) {
    //// yaranma
    this.h1Teg = document.createElement("h1");
    this.formUser = document.createElement("form");
    this.inputNameUser = document.createElement("input");
    this.inputEmailUser = document.createElement("input");
    this.inputNumberUser = document.createElement("input");
    this.buttonSubmitUser = document.createElement("button");
    this.tableUsers = document.createElement("table");

    //// deyer verilme
    this.h1Teg.textContent = "Contact List";

    this.buttonSubmitUser.textContent = "Submit";
    this.buttonSubmitUser.addEventListener("click", (e) => {
      e.preventDefault();
    });
    this.eventOnClickSubmitBtn = () => {};
    this.dleteUserBtn = () => {};
    this.changeUserBtn = () => {};

    this.buttonSubmitUser.onclick = () => this.eventOnClickSubmitBtn();

    this.formUser.appendChild(this.inputNameUser);
    this.formUser.appendChild(this.inputNumberUser);
    this.formUser.appendChild(this.inputEmailUser);
    this.formUser.appendChild(this.buttonSubmitUser);

    this.showUsers(users); // metod

    const appDiv = document.querySelector("#app");

    appDiv?.appendChild(this.h1Teg);
    appDiv?.appendChild(this.formUser);
    appDiv?.appendChild(this.tableUsers);
  }

  submitButtonClickEvent(
    event: () => void,
    deleteEvent: (index: number) => void,
    changeEvent: (index: number) => void
  ) {
    this.eventOnClickSubmitBtn = event;
    this.dleteUserBtn = deleteEvent;
    this.changeUserBtn = changeEvent;
  }

  showUsers(users: User[]) {
    this.tableUsers.innerHTML = "";

    const tr = document.createElement("tr");
    const thName = document.createElement("th");
    const thNumber = document.createElement("th");
    const thEmail = document.createElement("th");
    const thActions = document.createElement("th");

    thName.textContent = "Name";
    thNumber.textContent = "Number";
    thEmail.textContent = "Email";
    thActions.textContent = "Actions";

    tr.appendChild(thName);
    tr.appendChild(thNumber);
    tr.appendChild(thEmail);
    tr.appendChild(thActions);

    this.tableUsers.appendChild(tr);

    users.forEach((el, index) => {
      const trTD = document.createElement("tr");
      const tdName = document.createElement("td");
      const tdNumber = document.createElement("td");
      const tdEmail = document.createElement("td");
      const tdActions = document.createElement("td");

      tdName.textContent = el.name;
      tdNumber.textContent = el.number;
      tdEmail.textContent = el.email;

      const btnChange = document.createElement("button");
      const btnDelete = document.createElement("button");
      btnChange.textContent = "Change";
      btnDelete.textContent = "Delete";

      btnChange.onclick = () => this.changeUserBtn(index);
      btnDelete.onclick = () => this.dleteUserBtn(index);

      tdActions.appendChild(btnChange);
      tdActions.appendChild(btnDelete);

      trTD.appendChild(tdName);
      trTD.appendChild(tdNumber);
      trTD.appendChild(tdEmail);
      trTD.appendChild(tdActions);

      this.tableUsers.appendChild(trTD);
    });
  }
}

class UserModel {
  users: User[];

  constructor() {
    this.users = JSON.parse(localStorage.getItem("users") as string);
  }

  addUser(user: User) {
    let chage = true;

    this.users.forEach((e) => {
      if (e.number == user.number) {
        e.name = user.name;
        e.email = user.email;
        chage = false;
      }
    });

    if (chage) {
      this.users.push(user);
    }
    this.save();
  }

  deleteUser(index: number) {
    this.users.splice(index, 1);
    this.save();
  }

  changeUser(index: number) {
    return this.users[index];
  }
  save() {
    localStorage.setItem("users", JSON.stringify(this.users));
  }
}

class Controler {
  userModel: UserModel;
  userViev: UserView;

  addUser() {
    const us: User = {
      name: this.userViev.inputNameUser.value,
      number: this.userViev.inputNumberUser.value,
      email: this.userViev.inputEmailUser.value,
    };
    this.userModel.addUser(us);
    this.showUsers();
  }

  deleteUser(index: number) {
    this.userModel.deleteUser(index);

    this.showUsers();
  }

  changeUser(index: number) {
    const us: User = this.userModel.changeUser(index);

    this.userViev.inputNameUser.value = us.name;
    this.userViev.inputEmailUser.value = us.email;
    this.userViev.inputNumberUser.value = us.number;
  }

  showUsers() {
    this.userViev.showUsers(this.userModel.users);
  }

  constructor() {
    this.userModel = new UserModel();
    this.userViev = new UserView(this.userModel.users);

    this.userViev.submitButtonClickEvent(
      this.addUser.bind(this),
      this.deleteUser.bind(this),
      this.changeUser.bind(this)
    );
  }
}

// const users: User[] = [];
// localStorage.setItem("users", JSON.stringify(users));

const con = new Controler();
