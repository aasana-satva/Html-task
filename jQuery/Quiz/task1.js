$(document).ready(function () {

    const quizData = [
      {
        question: "Which language runs in a browser?",
        options: ["Java", "C", "Python", "JavaScript"],
        answer: "JavaScript"
      },
      {
        question: "Which symbol is used by jQuery?",
        options: ["#", "$", "@", "&"],
        answer: "$"
      },
      {
        question: "Which company developed jQuery?",
        options: ["Google", "Microsoft", "jQuery Team", "Meta"],
        answer: "jQuery Team"
      },
      {
        question: "Which jQuery method is used for animation?",
        options: ["animate()", "move()", "effect()", "transition()"],
        answer: "animate()"
      },
      {
        question: "Write the full form of DOM",
        type: "text",
        answer: "Document Object Model"
      },
      {
        question: "Which HTML tag is used to include JavaScript code?",
        options: ["script tag", "js tag", "javascript tag", "code tag"],
        answer: "script tag"
      },
      {
        question: "Which CSS property is used to make a website responsive?",
        options: ["float", "position", "media queries", "z-index"],
        answer: "media queries"
      },
      {
        question: "Which jQuery method is used to attach an event handler?",
        options: ["on()", "bind()", "click()", "event()"],
        answer: "on()"
      },
      {
        question: "Which JavaScript keyword is used to declare a block-scoped variable?",
        options: ["var", "let", "const", "static"],
        answer: "let"
      },
      {
        question: "What does API stand for?",
        type: "text",
        answer: "Application Programming Interface"
      }
    ];
  
    let currentQuestion = 0;
    let score = 0;
    let userAnswers = [];
  
//load question
    function loadQuestion() {
      const q = quizData[currentQuestion];
  
      $("#qNo").text(currentQuestion + 1);
      $("#questionText").text(q.question);
      $("#optionsContainer").empty();
  
      if (q.type === "text") {
        $("#optionsContainer").html(`
          <input type="text" name="answer" class="form-control"
                 placeholder="Enter your answer">
        `);
      } else {
        q.options.forEach(opt => {
          $("#optionsContainer").append(`
            <div class="form-check mb-2 option-item">
              <input class="form-check-input" type="radio"
                     name="answer" value="${opt}" id="${opt}">
              <label class="form-check-label w-100" for="${opt}">
                ${opt}
              </label>
            </div>
          `);
        });
      }
    }
  
 //validate
    $("#quizForm").validate({
      rules: {
        answer: { required: true }
      },
      messages: {
        answer: "Please select or enter an answer"
      },
      errorPlacement: function (error) {
        error.appendTo("#optionsContainer");
      }
    });
  
   //event on submit
    $("#quizForm").on("submit", function (e) {
      e.preventDefault();
      if (!$("#quizForm").valid()) return;
  
      const userAnswer =
        $("input[name='answer']:checked").val() ||
        $("input[name='answer']").val();
  
      const correctAnswer = quizData[currentQuestion].answer;
      const isCorrect =
        userAnswer.trim().toLowerCase() === correctAnswer.toLowerCase();
  
      // store answer silently
      userAnswers.push({
        question: quizData[currentQuestion].question,
        selected: userAnswer,
        correct: correctAnswer,
        isCorrect: isCorrect
      });
  
      if (isCorrect) score++;
  
      setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < quizData.length) {
          loadQuestion();
        } else {
          showResult();
        }
      }, 300);
    });
  //result
    function showResult() {
      let summaryHTML = "";
  
      userAnswers.forEach((item, index) => {
        summaryHTML += `
          <div class="mb-3 text-start">
            <strong>Q${index + 1}:</strong> ${item.question}<br>
            <strong>Your Answer:</strong> ${item.selected}<br>
            <span class="${item.isCorrect ? 'text-success' : 'text-danger'}">
              ${item.isCorrect ? "Correct" : "Incorrect"}
            </span>
          </div>
        `;
      });
  
      $(".quiz-card").html(`
        <h3 class="text-center">Quiz Completed</h3>
        <h4 class="text-center mt-3">
          Score: ${score} / ${quizData.length}
        </h4>
        <hr>
        ${summaryHTML}
        <button class="btn btn-primary w-100 mt-4"
                onclick="location.reload()">
          Restart Quiz
        </button>
      `);
    }
  
// start quiz
    $("#startQuiz").on("click", function () {
      $("#welcomeScreen").fadeOut(300, function () {
        $("#quizScreen").removeClass("d-none").hide().fadeIn(300);
        loadQuestion();
      });
    });
  
  });
  