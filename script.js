const question = {
    text: "5 + 5 = ?",
    answer: "10"
};

const correctMessages = [
    "🤓 You are a nerd!",
    "📚 Academic weapon detected!",
    "😭 You definitely remind teachers about homework.",
    "🧠 Brain operating at 100%.",
    "🏆 Campus legend!"
];

const wrongMessages = [
    "😎 Welcome to the club.",
    "😂 The backbenchers are proud of you.",
    "💀 Brain.exe stopped working.",
    "🍻 Nobody knows anyway.",
    "🤝 Thanks for keeping the average normal."
];

let streak = Number(localStorage.getItem("streak")) || 0;

document.getElementById("streak").innerText = streak;

document.getElementById("question").innerText =
question.text;

function randomMessage(list){
    return list[Math.floor(Math.random() * list.length)];
}

function checkAnswer(){

    let userAnswer =
    document.getElementById("answer")
    .value
    .trim();

    let result =
    document.getElementById("result");

    if(userAnswer === question.answer){

        streak++;

        localStorage.setItem(
            "streak",
            streak
        );

        document.getElementById("streak")
        .innerText = streak;

        result.innerHTML =
        randomMessage(correctMessages);

    }
    else{

        result.innerHTML =
        randomMessage(wrongMessages);

    }

}