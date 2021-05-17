// document.querySelector("button").addEventListener("click", (e) => {
//   e.preventDefault()
//   // console.log(e)
//   const url = "http://localhost:5000/sent";
//   var data = new URLSearchParams();
//   var ele = document.getElementById('myForm').elements
//   // console.log(ele);
//   for (var i = 0; i < ele.length; i++) {
//     // console.log(ele[i].name);
//     // console.log(ele[i].value);
//     // for (const pair of new FormData(e.target)) {
//     // console.log(pair)
//     if (ele[i].type === "text")
//       data.append(ele[i].name, ele[i].value);
//     // }
//   }



//   fetch(url, {
//     method: "post",
//     body: data,

//   }).then(res => res.json())
//     .then(res2 => {
//       //   console.log(res2)
//       location.reload()
//     });
// })

// function deleteme(item) {
//   console.log(item.innerText);
//   fetch("http://localhost:5000/remove/" + item.innerText, {
//     method: "delete"
//   }).then(res => res.json())
//     .then(res2 => {
//       //   console.log(res2);
//       location.reload()
//     });
// }

function Home() {
  console.log(window.location.href)
  location.replace(window.location.href + "home");
}

function Send() {
  const url = "http://localhost:5000/sent";
  var data = new URLSearchParams();
  data.append('umang', 1000);
  fetch(url, {
    method: "post",
    body: data,
  }).then(res => res.json())
    .then(res2 => {
      console.log(res2)
      // location.reload()
    });
}

function Transfer() {
  // console.log(accNumber)
  // console.log(document.getElementById("raccn"));
  // document.getElementById("raccn").innerHTML = accNumber;
  const url = `http://localhost:5000/transfer`;
  window.location.replace(url);
}

function SendMoney() {
  var Acc1 = document.getElementById("saccn").value;
  var Acc2 = document.getElementById("raccn").value;
  var amount = document.getElementById("amount").value;
  amount = Number(amount);
  // console.log(Acc1, typeof (Acc1));
  // console.log(Acc2, typeof (Acc2));
  // console.log(amount, typeof (amount));
  // setTimeout(10000);
  var data = {
    Acc1,
    Acc2,
    amount
  };
  const url = "http://localhost:5000/transferred";
  // var data = new URLSearchParams();
  // data.append({ name1: sname, name2: rname }, amount);
  console.log(data);
  fetch('/transferred', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then(res => res.json())
    .then(res2 => {
      console.log(res2);
      if (res2.error === true) {
        if (res2.sender === true) {
          if (res2.notFound === true) {
            // alert("The sender doesn't exist. Please Check the account number.");
            ShowToast("The sender doesn't exist. Please Check the account number.");
          }
          else {
            if (res2.inSufficientAmount === true) {
              ShowToast("The Sender's Balance is insufficient to transfer money");
            }
            else {
              if (res2.areSame === true) {
                ShowToast("The Sender and Receiver can't be same ");
              }
            }
          }
        }
        else {
          if (res2.notFound === true) {
            ShowToast("The receiver doesn't exist. Please check the account number.")
          }
        }
      }
      else {
        console.log(res2);
        ShowToast("Transaction Successful. Redirecting...");
        window.location.replace("http://localhost:5000/transactions")
      }
      // location.reload()
    });

}
function Goback() {
  const url = "http://localhost:5000/customers";
  window.location.replace(url);
}

function ShowToast(msg) {
  M.toast({ html: msg, classes: "#ce93d8 purple", duration: 5000 });
}