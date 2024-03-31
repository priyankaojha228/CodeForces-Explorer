API = localStorage.getItem("api");
URI = localStorage.getItem("url");
const user_handle = localStorage.getItem("username");
const correctSubmissions = [];
const compilationError = [];
const timeLimitExceed = [];
const wrongAnswer = [];

const ratingToTag = {
    '500-1000': 'rating-500-1000',
    '1000-1500': 'rating-1000-1500',
    '1500-2000': 'rating-1500-2000',
    '2000-2500': 'rating-2000-2500',
    '2500-3000': 'rating-2500-3000',
    '3000-3500': 'rating-3000-3500',
};

fetch(`https://codeforces.com/api/user.status?handle=${user_handle}&key=${API}`)
    .then(response => response.json())
    .then(data => {
        data.result.forEach(item => {
            if (item.verdict == 'OK') {
                const submission = {
                    problemName: item.problem.name,
                    verdict: item.verdict
                };
                correctSubmissions.push(submission);
            }
            else if (item.verdict == 'COMPILATION_ERROR') {
                const submission = {
                    problemName: item.problem.name,
                    verdict: item.verdict
                };
                compilationError.push(submission);
            }
            else if (item.verdict == 'TIME_LIMIT_EXCEEDED') {
                const submission = {
                    problemName: item.problem.name,
                    verdict: item.verdict
                };
                timeLimitExceed.push(submission);
            }
            else {
                const submission = {
                    problemName: item.problem.name,
                    verdict: item.verdict
                };
                wrongAnswer.push(submission);
            }
        });
    });

fetch("https://codeforces.com/api/problemset.problems?tags=" + URI + "&key=" + API)
    .then(response => response.json())
    .then(data => {
        const problemList = data["result"];
        const problemStatistics = problemList["problemStatistics"];
        const problems = problemList["problems"];
        if(problems){
        problems.sort((a, b) => a.rating - b.rating);
        problems.forEach((problem, i) => {
            const problemName = problem.name;
            let problemRating;
            problem.rating == undefined ? problemRating = "" : problemRating = problem.rating;
            const solveCount = problemStatistics[i].solvedCount;
            const tableBody = document.getElementById("problem-list");
            const probRow = document.createElement("tr");

            probRow.innerHTML = `
                    
                    <td>${problemName}</td>
                    <td><center><span class="badge text-bg-${colorChangerForQuestions(problemName)}">${isAlreadySolved(problemName)}</span></center></td>
                    <td><center><span class="badge rounded-pill text-bg-${colorPicker(problemRating)}">${difficultyCalculator(problemRating)}</span></center></td>
                    <td><center>${solveCount}</center></td>
                    <td><center><button type="button" class="btn btn-success ${disableButton(problemName)}" 
                            style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem; background-color: #0041a1; border-color: #0041a1;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-file-earmark-code-fill" viewBox="0 0 16 16">
  <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zM6.646 7.646a.5.5 0 1 1 .708.708L5.707 10l1.647 1.646a.5.5 0 0 1-.708.708l-2-2a.5.5 0 0 1 0-.708l2-2zm2.708 0 2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L10.293 10 8.646 8.354a.5.5 0 1 1 .708-.708z"/>
</svg>
                    Submit Code
                    </button></center></td>`

            tableBody.appendChild(probRow);
            hideSpinner();
            probRow.querySelector("button").addEventListener("click", () => {
                const problemUrl = `https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`;
                window.open(problemUrl, "_blank");
            });

            function difficultyCalculator(problemRating) {
                if (problemRating >= 500 && problemRating < 1100) {
                    return 'Easy';
                }
                else if (problemRating >= 1100 && problemRating < 1800) {
                    return 'Medium';
                }
                else if (problemRating >= 1800 && problemRating < 2600) {
                    return 'Hard';
                }
                else {
                    return 'Challenging';
                }
            }

            function colorPicker(problemRating) {
                if (problemRating >= 500 && problemRating < 1100) {
                    return 'success';
                }
                else if (problemRating >= 1100 && problemRating < 1800) {
                    return 'info';
                }
                else if (problemRating >= 1800 && problemRating < 2600) {
                    return 'warning';
                }
                else {
                    return 'danger';
                }
            }

            function isAlreadySolved(problemNameToFind) {
                for (let i = 0; i < correctSubmissions.length; i++) {
                    const problem = correctSubmissions[i];
                    if (problem.problemName === problemNameToFind) {
                        return 'Solved';
                    }
                }
                for (let i = 0; i < wrongAnswer.length; i++) {
                    const problem = wrongAnswer[i];
                    if (problem.problemName === problemNameToFind) {
                        return 'Wrong Answer';
                    }
                }
                for (let i = 0; i < compilationError.length; i++) {
                    const problem = compilationError[i];
                    if (problem.problemName === problemNameToFind) {
                        return 'Compilation Error';
                    }
                }
                for (let i = 0; i < timeLimitExceed.length; i++) {
                    const problem = timeLimitExceed[i];
                    if (problem.problemName === problemNameToFind) {
                        return 'Time Limit Exceeded';
                    }
                }
                return 'Unsolved';
            }

            function colorChangerForQuestions(problemNameToFind) {
                for (let i = 0; i < correctSubmissions.length; i++) {
                    const problem = correctSubmissions[i];
                    if (problem.problemName === problemNameToFind) {
                        return 'success';
                    }
                }
                for (let i = 0; i < wrongAnswer.length; i++) {
                    const problem = wrongAnswer[i];
                    if (problem.problemName === problemNameToFind) {
                        return 'danger';
                    }
                }
                for (let i = 0; i < compilationError.length; i++) {
                    const problem = compilationError[i];
                    if (problem.problemName === problemNameToFind) {
                        return 'warning';
                    }
                }
                for (let i = 0; i < timeLimitExceed.length; i++) {
                    const problem = timeLimitExceed[i];
                    if (problem.problemName === problemNameToFind) {
                        return 'info';
                    }
                }
                return 'dark';
            }

            function disableButton(problemNameToFind) {
                for (let i = 0; i < correctSubmissions.length; i++) {
                    const problem = correctSubmissions[i];
                    if (problem.problemName === problemNameToFind) {
                        return 'disabled';
                    }
                }

            }
            function hideSpinner() {
                const spinner = document.getElementById('spinner');
                const table = document.getElementById('problem-list');

                if (table && spinner) {
                    table.appendChild(spinner);
                    spinner.style.display = 'none';
                }
            }
        });
    }
    });
document.querySelectorAll('#rating').forEach(item => {
    item.addEventListener('click', event => {
        const rating = event.target.dataset.rating.split('-');
        const lowerRating = parseInt(rating[0]);
        const upperRating = parseInt(rating[1]);
        const selectedQuestions = [];
        const selectedProblemStats = [];
        fetch("https://codeforces.com/api/problemset.problems?tags=" + URI + "&key=" + API)
            .then(response => response.json())
            .then(data => {
                const allProblem = data["result"];
                const problemObject = allProblem["problems"];
                const allProblemStats = allProblem["problemStatistics"]

                for (let i = 0; i < problemObject.length; i++) {
                    const problem = problemObject[i];
                    if (problem.rating == undefined) {
                        problem.rating = 0;
                    }
                    if (problem.rating >= lowerRating && problem.rating <= upperRating) {
                        selectedQuestions.push(problem);
                        selectedProblemStats.push(allProblemStats[i]);
                    }
                }
                selectedQuestions.sort((a, b) => a.rating - b.rating);
                document.getElementById("problem-list").innerHTML = '';
                selectedQuestions.forEach((element, i) => {
                    const tableBody = document.getElementById("problem-list");
                    const probRow = document.createElement("tr");
                    selectedName = element.name;
                    selectedRating = element.rating;
                    selectedSolve = selectedProblemStats[i].solvedCount;
                    probRow.innerHTML = `

                                    <td>${selectedName}</td>
                                    <td><center><span class="badge text-bg-${colorChangerForQuestions(selectedName)}">${isAlreadySolved(selectedName)}</span></center></td>
                                    <td><center><span class="badge rounded-pill text-bg-${colorPicker(selectedRating)}">${selectedRating + " (" + difficultyCalculator(selectedRating) + ")"}</span></center></td>
                                    <td><center>${selectedSolve}</center></td>
                                    <td><center><button type="button" class="btn btn-success ${disableButton(selectedName)}" 
                                            style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem; background-color: #0041a1; border-color: #0041a1;">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-file-earmark-code-fill" viewBox="0 0 16 16">
                  <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zM6.646 7.646a.5.5 0 1 1 .708.708L5.707 10l1.647 1.646a.5.5 0 0 1-.708.708l-2-2a.5.5 0 0 1 0-.708l2-2zm2.708 0 2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L10.293 10 8.646 8.354a.5.5 0 1 1 .708-.708z"/>
                </svg>
                                    Submit Code
                                    </button></center></td>`

                    tableBody.appendChild(probRow);
                    probRow.querySelector("button").addEventListener("click", () => {
                        const problemUrl = `https://codeforces.com/problemset/problem/${element.contestId}/${element.index}`;
                        console.log(problemUrl);
                        window.open(problemUrl, "_blank");
                    });
                });

                function colorChangerForQuestions(problemNameToFind) {
                    for (let i = 0; i < correctSubmissions.length; i++) {
                        const problem = correctSubmissions[i];
                        if (problem.problemName === problemNameToFind) {
                            return 'success';
                        }
                    }
                    for (let i = 0; i < wrongAnswer.length; i++) {
                        const problem = wrongAnswer[i];
                        if (problem.problemName === problemNameToFind) {
                            return 'danger';
                        }
                    }
                    for (let i = 0; i < compilationError.length; i++) {
                        const problem = compilationError[i];
                        if (problem.problemName === problemNameToFind) {
                            return 'warning';
                        }
                    }
                    for (let i = 0; i < timeLimitExceed.length; i++) {
                        const problem = timeLimitExceed[i];
                        if (problem.problemName === problemNameToFind) {
                            return 'info';
                        }
                    }
                    return 'dark';
                }
                function isAlreadySolved(problemNameToFind) {
                    for (let i = 0; i < correctSubmissions.length; i++) {
                        const problem = correctSubmissions[i];
                        if (problem.problemName === problemNameToFind) {
                            return 'Solved';
                        }
                    }
                    for (let i = 0; i < wrongAnswer.length; i++) {
                        const problem = wrongAnswer[i];
                        if (problem.problemName === problemNameToFind) {
                            return 'Wrong Answer';
                        }
                    }
                    for (let i = 0; i < compilationError.length; i++) {
                        const problem = compilationError[i];
                        if (problem.problemName === problemNameToFind) {
                            return 'Compilation Error';
                        }
                    }
                    for (let i = 0; i < timeLimitExceed.length; i++) {
                        const problem = timeLimitExceed[i];
                        if (problem.problemName === problemNameToFind) {
                            return 'Time Limit Exceeded';
                        }
                    }
                    return 'Unsolved';
                }

                function colorChangerForQuestions(problemNameToFind) {
                    for (let i = 0; i < correctSubmissions.length; i++) {
                        const problem = correctSubmissions[i];
                        if (problem.problemName === problemNameToFind) {
                            return 'success';
                        }
                    }
                    for (let i = 0; i < wrongAnswer.length; i++) {
                        const problem = wrongAnswer[i];
                        if (problem.problemName === problemNameToFind) {
                            return 'danger';
                        }
                    }
                    for (let i = 0; i < compilationError.length; i++) {
                        const problem = compilationError[i];
                        if (problem.problemName === problemNameToFind) {
                            return 'warning';
                        }
                    }
                    for (let i = 0; i < timeLimitExceed.length; i++) {
                        const problem = timeLimitExceed[i];
                        if (problem.problemName === problemNameToFind) {
                            return 'info';
                        }
                    }
                    return 'dark';
                }

                function disableButton(problemNameToFind) {
                    for (let i = 0; i < correctSubmissions.length; i++) {
                        const problem = correctSubmissions[i];
                        if (problem.problemName === problemNameToFind) {
                            return 'disabled';
                        }
                    }

                }
                function difficultyCalculator(problemRating) {
                    if (problemRating >= 500 && problemRating < 1100) {
                        return 'Easy';
                    }
                    else if (problemRating >= 1100 && problemRating < 1800) {
                        return 'Medium';
                    }
                    else if (problemRating >= 1800 && problemRating < 2600) {
                        return 'Hard';
                    }
                    else {
                        return 'Challenging';
                    }
                }

                function colorPicker(problemRating) {
                    if (problemRating >= 500 && problemRating < 1100) {
                        return 'success';
                    }
                    else if (problemRating >= 1100 && problemRating < 1800) {
                        return 'info';
                    }
                    else if (problemRating >= 1800 && problemRating < 2600) {
                        return 'warning';
                    }
                    else {
                        return 'danger';
                    }
                }

                var selectedRating = event.target.getAttribute("data-rating");
                var selectedRatingElement = document.getElementById("selectedRating");
                selectedRatingElement.innerHTML = "You have selected the " + selectedRating + " rating range.";
                var modalButton = document.getElementById("ratingModalBtn");
                modalButton.click();
            });
    });
});


