function sign_in() {
  if (firebase.auth().currentUser) {
    firebase.auth().signOut();
  }

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      swal({
        icon: "success",
        title: "Login realizado com sucesso",
      }).then(() => {
        setTimeout(() => {
          window.location.replace("index.html");
        }, 1000);
      });
    })
    .catch((error) => {
      const errorCode = error.code;

      switch (errorCode) {
        case "auth/wrong-password":
          swal({
            icon: "error",
            title: "Senha inválida",
          });
          break;

        case "auth/invalid-email":
          swal({
            icon: "error",
            title: "E-mail inválido",
          });
          break;

        case "auth/user-not-found":
          swal({
            icon: "warning",
            title: "Usuário não encontrado",
            text: "Deseja criar esse usuário?",
            buttons: {
              bcancel: {
                text: "Não",
                value: false,
                className: "sbutton-cancel",
              },
              bconfirm: {
                text: "Sim",
                value: true,
                className: "sbutton-confirm",
              },
            },
            /*
            showCancelButton: true,
            cancelButtonText: "Não",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sim",
            confirmButtonColor: "#3085d6",
            */
          }).then((result) => {
            if (result) {
              // Não é result.value, pois retorna undefined
              signUp(email, password);
            }
          });
          break;

        default:
          swal({
            icon: "error",
            title: error.message,
          });
          break;
      }
    });
}

function signUp(email, password) {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(() => {
      swal({
        icon: "success",
        title: "Usuário foi criado com sucesso",
      }).then(() => {
        setTimeout(() => {
          window.location.replace("index.html");
        }, 1000);
      });
    })
    .catch((error) => {
      const errorCode = error.code;
      switch (errorCode) {
        case "auth/weak-password":
          swal({
            icon: "error",
            title: "Senha muito fraca",
          });
          break;

        default:
          swal({
            icon: "error",
            title: error.message,
          });
      }
    });
}

function logout() {
  firebase.auth().signOut();
}
