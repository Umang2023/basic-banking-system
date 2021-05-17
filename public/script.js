
function Home() {
  console.log(window.location.href)
  location.replace(window.location.href + "home");
}

function Send() {
  const url = "https://basic-banking-system-at-grip.herokuapp.com/sent";
  var data = new URLSearchParams();
  data.append('umang', 1000);
  fetch(url, {
    method: "post",
    body: data,
  }).then(res => res.json())
    .then(res2 => {
      console.log(res2)

    });
}

function Transfer() {

  const url = `https://basic-banking-system-at-grip.herokuapp.com/transfer`;
  window.location.replace(url);
}

function SendMoney() {
  var Acc1 = document.getElementById("saccn").value;
  var Acc2 = document.getElementById("raccn").value;
  var amount = document.getElementById("amount").value;
  amount = Number(amount);

  var data = {
    Acc1,
    Acc2,
    amount
  };
  const url = "https://basic-banking-system-at-grip.herokuapp.com/transferred";
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
        window.location.replace("https://basic-banking-system-at-grip.herokuapp.com/transactions")
      }
      // location.reload()
    });

}
function Goback() {
  const url = "https://basic-banking-system-at-grip.herokuapp.com/customers";
  window.location.replace(url);
}

function ShowToast(msg) {
  M.toast({ html: msg, classes: "#ce93d8 purple", duration: 5000 });
}