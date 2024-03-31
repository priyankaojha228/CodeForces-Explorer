function difficulty(problemRating) {
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

module.exports = difficulty;