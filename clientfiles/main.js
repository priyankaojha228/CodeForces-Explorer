const API_KEY = "a19c41b8bd9b97d4d02230643f4aace11ad05f63";

document.addEventListener('DOMContentLoaded', function () {
const usernameInput = document.getElementById('username-input');
const savedUsername = localStorage.getItem('username');
if (savedUsername) {
    document.getElementById('alert-message1').classList.remove('d-none');
    usernameInput.value = savedUsername;
}
else {
    document.getElementById('alert-message').classList.remove('d-none');
}

const form = document.querySelector('form');
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const enteredUsername = usernameInput.value;
    localStorage.setItem('username', enteredUsername);
    location.reload();
});

const buttonElement = document.querySelector(".btn-outline-success");
buttonElement.addEventListener("click", function () {
    const selectElement = document.getElementById("inputGroupSelect04");
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const selectedString = encodeURIComponent(selectedOption.text.trim().toLowerCase());
    localStorage.setItem("url", selectedString);
    localStorage.setItem("api", API_KEY);
    localStorage.setItem("selectedValue", selectedOption.text);
    if (localStorage.getItem("username") == "") {
        const toastElement = `
        <div class="toast-container position-fixed bottom-0 end-0 p-3">
  <div id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="toast-header">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle-fill mx-2 text-warning" viewBox="0 0 16 16">
    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
  </svg>
      <strong class="me-auto text-danger">Alert !</strong>
      <small>1 sec ago</small>
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body fw-semibold">
      You must provide your username to access this section.
    </div>
  </div>
</div>
    `;
        const toastContainer = document.querySelector('.toast-container');
        toastContainer.innerHTML = toastElement;
        const toast = new bootstrap.Toast(toastContainer.querySelector('.toast'));
        toast.show();
    }
    else {
        window.open("practiceproblems.html");
    }

});
fetch('https://codeforces.com/api/contest.list')
    .then(response => response.json())
    .then(data => {
        const upcomingContests = data.result.filter(contest => (contest.phase == 'BEFORE' && (contest.type == 'CF' || contest.type == 'ICPC')));
        upcomingContests.forEach(contest => {
            const startTime = new Date(contest.startTimeSeconds * 1000);
            const currentTime = new Date();
            const timeDiff = startTime.getTime() - currentTime.getTime();
            const remainingTime = timeDiff > 0
                ? Math.floor(timeDiff / (1000 * 60 * 60 * 24)) < 1
                    ? Math.floor(timeDiff / (1000 * 60 * 60))
                    : Math.floor(timeDiff / (1000 * 60 * 60 * 24))
                : 0;
            contest.remainingTime = remainingTime;
        });

        upcomingContests.reverse();
        const tableBody = document.getElementById("upcoming-contests");

        upcomingContests.forEach(contest => {
            const row1 = document.createElement("tr");
            row1.innerHTML = `
    <td><center>${contest.name}</center></td>
    <td><center>${new Date(contest.startTimeSeconds * 1000).toLocaleString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                hour12: true
            })}</center></td>
    <td><center>${Math.floor(contest.durationSeconds / 3600)}h:${(contest.durationSeconds % 3600) / 60}m</center></td>
    <td><center><button type="button" class="btn btn-success text-wrap" 
        style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;" ${disableButtonIfMoreThanTwoDays(contest)}>
        ${buttonIcon(contest)}
        ${buttonText(contest)}
        </button></center></td>
`;
            tableBody.appendChild(row1);

            function disableButtonIfMoreThanTwoDays(contest) {
                const startTime = contest.startTimeSeconds * 1000;
                const currentTime = new Date().getTime();
                const difference = startTime - currentTime;
                const differenceInDays = difference / (1000 * 60 * 60 * 24);
                return differenceInDays > 2 ? 'disabled' : '';
            }
            function buttonText(contest) {
                const startTime = contest.startTimeSeconds * 1000;
                const currentTime = new Date().getTime();
                const difference = startTime - currentTime;
                const differenceInDays = difference / (1000 * 60 * 60 * 24);
                return differenceInDays > 2 ? 'Not Started Yet' : 'Register Now';
            }
            function buttonIcon(contest) {
                const startTime = contest.startTimeSeconds * 1000;
                const currentTime = new Date().getTime();
                const difference = startTime - currentTime;
                const differenceInDays = difference / (1000 * 60 * 60 * 24);
                if (differenceInDays > 2) {
                    return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill mx-1" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"></path>
                  </svg>`;
                }
                return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill mx-1" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"></path>
              </svg>`;
            }
            const button = row1.querySelector('button');
            button.addEventListener('click', () => {
                const startTime = contest.startTimeSeconds * 1000;
                const currentTime = new Date().getTime();
                const difference = startTime - currentTime;
                const differenceInDays = difference / (1000 * 60 * 60 * 24);
                differenceInDays <= 2 ? window.open(`https://codeforces.com/contestRegistration/${contest.id}`, "_blank") : null;
            });

        });
    })
    .catch(error => {
        console.error(error);
    });

});





