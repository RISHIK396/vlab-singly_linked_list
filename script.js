document.addEventListener("DOMContentLoaded", function () {
  const header = document.querySelector(".header");

  // This event listener checks if the user has scrolled more than 10px
  // If yes, it adds the 'scrolled' class to the header (for styling changes like shrinking)
  // If not, it removes the 'scrolled' class
  window.addEventListener("scroll", function () {
    if (window.scrollY > 10) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
});

// Object to store references to different topic sections by their IDs
let topicElements = {
  aim: document.getElementById("aim"),
  theory: document.getElementById("theory"),
  procedure: document.getElementById("procedure"),
  practice: document.getElementById("practice"),
  code: document.getElementById("code"),
  result: document.getElementById("result"),
  quiz: document.getElementById("quiz"),
  references: document.getElementById("references"),
  tnt: document.getElementById("tnt"),
};

let currentTopic = "aim"; // Track the currently displayed topic
function switchContent(topic) {
    if (topic === currentTopic) {
        return; // Prevent unnecessary updates if the same topic is clicked again
    }

    topicElements[currentTopic].style.display = 'none'; // Hide the previous topic
    topicElements[topic].style.display = 'block'; // Show the selected topic
    currentTopic = topic; // Update the current topic
}

// Generalized function to toggle language-based code blocks
function toggleCode(language) {
  const allCodeBlocks = document.querySelectorAll(".code-block");
  allCodeBlocks.forEach((block) => block.classList.remove("active"));

  const selectedCodeBlock = document.getElementById(language + "Code");
  selectedCodeBlock.classList.add("active");
}

// Clipboard copy function
function copyCode(elementId) {
  const codeBlock = document.getElementById(elementId);
  const code = codeBlock.querySelector("code").innerText;

  // Copy the selected code text to clipboard
  navigator.clipboard
    .writeText(code)
    .then(() => {
      const copyButton = codeBlock.querySelector(".copy-button");
      copyButton.textContent = "Copied!"; // Temporarily change button text
      setTimeout(() => {
        copyButton.textContent = "Copy"; // Reset text after 2 seconds
      }, 2000);
    })
    .catch((err) => {
      console.error("Could not copy text: ", err);
    });
}

// Event listeners for radio buttons
document
  .getElementById("cppRadio")
  .addEventListener("change", () => toggleCode("cpp"));
document
  .getElementById("pythonRadio")
  .addEventListener("change", () => toggleCode("python"));

// Event listener for copy buttons
document.querySelectorAll(".copy-button").forEach((button) => {
  button.addEventListener("click", function () {
    const language = button.closest(".code-block").id.replace("Code", "");
    copyCode(language + "Code");
  });
});

// Quiz Logic
const questions = [
    {
      question: " Q1) Which of the following is/are valid searching algorithms?",
      choices: ["Linear Search", "Bubble Sort", "Binary Search", "Quick Sort"],
      correctAnswers: [0, 2], // Correct answers are indexes 0 and 2 (multiple answers possible)
    },
    {
      question: " Q2) What is/are the time complexity of linear search?",
      choices: ["O(log n)", "O(n)", "O(n^2)", "O(1)"],
      correctAnswers: [1], // Correct answer is index 1 (single answer)
    },
  ];
  
  let currentQuestionIndex = 0;
  let score = 0;
  let userAnswers = []; // Array to store user answers as an array of selected indexes
  
  const questionElement = document.getElementById("question");
  const choicesContainer = document.getElementById("choices");
  const saveButton = document.getElementById("save-btn");
  const nextButton = document.getElementById("next-btn");
  const retakeButton = document.getElementById("retake-btn");
  const quizReport = document.getElementById("quiz-report");
  
  function showQuestion() {
      let currentQuestion = questions[currentQuestionIndex];
      questionElement.textContent = currentQuestion.question;
      choicesContainer.innerHTML = "";
  
      currentQuestion.choices.forEach((choice, index) => {
          const button = document.createElement("button");
          button.textContent = choice;
          button.classList.add("choice");
          button.addEventListener("click", () => toggleSelection(index)); // Listen for user selection
          choicesContainer.appendChild(button);
      });
  
      saveButton.style.display = "block"; // Show the save button
      nextButton.style.display = "none"; // Hide the next button initially
      retakeButton.style.display = "none"; // Hide the retake button
      saveButton.disabled = true; // Disable save button initially
  }
  
  function toggleSelection(selectedIndex) {
      // Toggle selection for multiple answers
      if (!userAnswers[currentQuestionIndex]) {
          userAnswers[currentQuestionIndex] = [];
      }
  
      const answerIndex = userAnswers[currentQuestionIndex].indexOf(selectedIndex);
  
      if (answerIndex > -1) {
          // Remove the selection if already selected
          userAnswers[currentQuestionIndex].splice(answerIndex, 1);
      } else {
          // Add the selection
          userAnswers[currentQuestionIndex].push(selectedIndex);
      }
  
      // Highlight selected buttons
      const choiceButtons = document.querySelectorAll(".choice");
      choiceButtons.forEach((button, index) => {
          if (userAnswers[currentQuestionIndex].includes(index)) {
              button.style.backgroundColor = "#4285F4"; // Selected answer color
              button.style.color = "white";
          } else {
              button.style.backgroundColor = "#f1f1f1"; // Reset other button colors
              button.style.color = "black";
          }
      });
  
      // Enable the Save button if there is at least one selection
      saveButton.disabled = userAnswers[currentQuestionIndex].length === 0;
  }
  
  function saveAnswer() {
      // Show the Next button once the answer is saved
      nextButton.style.display = "block";
      saveButton.style.display = "none"; // Hide the Save button
      saveButton.disabled = true; // Disable the Save button after saving the answer
  }
  
  function checkAnswer() {
      const correctAnswers = questions[currentQuestionIndex].correctAnswers;
      const userAnswer = userAnswers[currentQuestionIndex];
  
      // Check if the user's selected answers match the correct ones
      if (arraysEqual(correctAnswers, userAnswer)) {
          score++; // Increment score if the answer is correct
      }
  
      nextButton.style.display = "none"; // Hide the Next button
      if (currentQuestionIndex < questions.length - 1) {
          // Move to the next question
          currentQuestionIndex++;
          showQuestion();
      } else {
          showResults();
      }
  }
  
  function arraysEqual(a, b) {
      return a.length === b.length && a.every((val, index) => val === b[index]);
  }
  
  function showResults() {
      questionElement.textContent = `Quiz Completed! Your Score: ${score} / ${questions.length}`;
      choicesContainer.innerHTML = "";
      saveButton.style.display = "none";
      nextButton.style.display = "none";
      retakeButton.style.display = "block";
  
      // Display quiz report
      displayQuizReport();
  }
  
  function displayQuizReport() {
      quizReport.style.display = "block"; // Show the report section
      quizReport.innerHTML = ""; // Clear previous report
      
      const reporttitle = document.createElement("h3");
      reporttitle.textContent = "Quiz Report"; // Set the title
      quizReport.appendChild(reporttitle);

      questions.forEach((question, index) => {
          const userAnswer = userAnswers[index] || [];
          const correctAnswer = question.correctAnswers;
          const questionDiv = document.createElement("div");
          questionDiv.classList.add("quiz-report-question");
  
          const questionText = document.createElement("p");
          questionText.textContent = `${question.question}`;
          questionDiv.appendChild(questionText);
  
          const choicesList = document.createElement("ul");
          question.choices.forEach((choice, i) => {
              const choiceItem = document.createElement("li");
              const isSelected = userAnswer.includes(i);
              const isCorrect = correctAnswer.includes(i);
  
              // Highlight correct and incorrect answers
              if (isSelected) {
                  choiceItem.textContent = choice;
                  choiceItem.style.backgroundColor = isCorrect ? "green" : "red";
                  choiceItem.style.color = "white";
              }
  
              choicesList.appendChild(choiceItem);
          });
  
          questionDiv.appendChild(choicesList);
          quizReport.appendChild(questionDiv);
      });
  }
  
  retakeButton.addEventListener("click", () => {
      currentQuestionIndex = 0;
      score = 0;
      userAnswers = [];
      quizReport.style.display = "none"; // Hide the report on retake
      showQuestion();
  });
  
  saveButton.addEventListener("click", saveAnswer);
  nextButton.addEventListener("click", checkAnswer);
  
  showQuestion();

  // practise script js

  class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }

    async traverseToIndex(index) {
        let current = this.head;
        let count = 1;  // Start from 1
        let arrows = document.querySelectorAll(".arrow");
        let nodes = document.querySelectorAll(".node");
        let head = document.querySelector(".head-pointer");
        let headarrow = document.querySelector(".head-arrow");

        head.classList.add("blink-found");
        await this.sleep(1000);
        head.classList.remove("blink-found");

        headarrow.classList.add("pointer-expands");
        await this.sleep(1000);
        headarrow.classList.remove("pointer-expands");

        while (current && count < index) {
            if (nodes[count - 1]) {
                nodes[count - 1].classList.add("traverse-node");
            }

            await this.sleep(400);

            if (arrows[count - 1]) {
                arrows[count - 1].classList.add("traverse-arrow");
            }

            await this.sleep(400);

            if (nodes[count - 1]) {
                nodes[count - 1].classList.add("blink-node");
                await this.sleep(300);
                nodes[count - 1].classList.remove("blink-node");
            }

            if (nodes[count - 1]) {
                nodes[count - 1].classList.remove("traverse-node");
            }
            if (arrows[count - 1]) {
                arrows[count - 1].classList.remove("traverse-arrow");
            }

            current = current.next;
            count++;
        }
    }

    async insertAt(value, index) {
        if (index < 1 || index > this.size + 1) return;

        await this.traverseToIndex(index);

        let newNode = new Node(value);
        if (index === 1) {
            newNode.next = this.head;
            this.head = newNode;
        } else {
            let prev = this.getNodeAt(index - 1);
            newNode.next = prev.next;
            prev.next = newNode;
        }
        this.size++;

        this.display();

        let nodes = document.querySelectorAll(".node");
        if (nodes[index - 1]) {
            nodes[index - 1].style.opacity = "0";
            nodes[index - 1].style.transform = "scale(0.7)";

            setTimeout(() => {
                nodes[index - 1].style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
                nodes[index - 1].style.opacity = "1";
                nodes[index - 1].style.transform = "scale(1)";
            }, 100);
        }
    }

    async deleteAt(index) {
        if (index < 1 || index > this.size || !this.head) return;

        await this.traverseToIndex(index);

        let removedNode;
        let nodes = document.querySelectorAll(".node");

        if (nodes[index - 1]) {
            nodes[index - 1].style.transition = "opacity 0.5s ease-out";
            nodes[index - 1].style.opacity = "0";

            await this.sleep(500);
        }

        if (index === 1) {
            removedNode = this.head;
            this.head = this.head.next;
        } else {
            let prev = this.getNodeAt(index - 1);
            removedNode = prev.next;
            prev.next = removedNode.next;
        }

        this.size--;
        this.display();
    }

    // async deleteByValue(value) {
    //     if (!this.head) return;

    //     let current = this.head;
    //     let prev = null;
    //     let index = 1;
    //     let nodes = document.querySelectorAll(".node");
    //     let arrows = document.querySelectorAll(".arrow");

    //     while (current) {
    //         if (current.value === value) {
    //             if (nodes[index - 1]) {
    //                 nodes[index - 1].style.transition = "opacity 0.5s ease-out";
    //                 nodes[index - 1].style.opacity = "0";

    //                 await this.sleep(500);
    //             }

    //             if (prev === null) {
    //                 this.head = current.next;
    //             } else {
    //                 prev.next = current.next;
    //             }

    //             this.size--;
    //             this.display();
    //             return;
    //         }

    //         prev = current;
    //         current = current.next;
    //         index++;
    //     }

    //     alert("Value not found in the list.");
    // }

    async search(value) {
        let current = this.head;
        let index = 1;
        let nodes = document.querySelectorAll(".node");
        let arrows = document.querySelectorAll(".arrow");
        let nodesValue = document.querySelectorAll(".node-value");

        let head = document.querySelector(".head-pointer");
        let headarrow = document.querySelector(".head-arrow");
        let foundIndices = [];


        nodes.forEach(node => {
            node.classList.remove("traverse-node", "blink-node", "blink-found");
            node.style.opacity = "1";
            node.style.transform = "scale(1)";
        });
        
        arrows.forEach(arrow => {
            arrow.classList.remove("traverse-arrow");
        });

        nodesValue.forEach(nodevalue=>{
            nodevalue.classList.remove("blink-node");
        });

        // Animate head pointer
        head.classList.add("blink-found");
        await this.sleep(1000);
        head.classList.remove("blink-found");

        headarrow.classList.add("pointer-expands");
        await this.sleep(1000);
        headarrow.classList.remove("pointer-expands");



        while (current) {
            let nodeValueDiv = nodes[index - 1].querySelector(".node-value");

            if (nodeValueDiv) {
                nodeValueDiv.classList.add("blink-node");
                await this.sleep(300);

                if (current.value === value) {
                    foundIndices.push(index);
                    document.getElementById("searchResult").textContent = `Indices: ${foundIndices.join(", ")}`;
                    nodeValueDiv.classList.remove("blink-node");
                    nodeValueDiv.classList.add("blink-found");
                    await this.sleep(1000);
                    nodeValueDiv.classList.remove("blink-found");
                }
            }

            if (nodes[index - 1]) {
                nodes[index - 1].classList.add("traverse-node");
                await this.sleep(400);
            }

            if (arrows[index - 1]) {
                arrows[index - 1].classList.add("traverse-arrow");
                await this.sleep(400);
            }

            current = current.next;
            index++;
        }

        let nullSign = document.querySelector(".null-sign");
        if (nullSign) {
            nullSign.classList.add("blink-null");
            await this.sleep(1000);
            nullSign.classList.remove("blink-null");
        }

        if (foundIndices.length > 0) {
            return;
        } else {
            document.getElementById("searchResult").textContent = "Not Found";
        }
    }

    getNodeAt(index) {
        let current = this.head;
        let count = 1;
        while (current && count < index) {
            current = current.next;
            count++;
        }
        return current;
    }

    async createFromValues(values) {
        this.head = null;
        this.size = 0;
        let prev = null;

        values.forEach((value, index) => {
            let newNode = new Node(value);
            if (index === 0) {
                this.head = newNode;
            } else {
                prev.next = newNode;
            }
            prev = newNode;
            this.size++;
        });

        this.display();
    }

    display() {
        let listContainer = document.getElementById("linkedList");
        listContainer.innerHTML = "";
        let temp = this.head;
        let index = 1;

        while (temp) {
            // Create a wrapper for both node and index
            let nodeWrapper = document.createElement("div");
            nodeWrapper.className = "node-wrapper";

            let nodeDiv = document.createElement("div");
            nodeDiv.className = "node";
            nodeDiv.innerHTML = `
                <div class="node-value">${temp.value}</div>
                <div class="node-pointer">
                    <span class="arrow">→</span>
                </div>
            `;

            // Create index div
            let indexDiv = document.createElement("div");
            indexDiv.className = "node-index";
            indexDiv.textContent = `Index: ${index}`;

            if (index === 1) {
                let headDiv = document.createElement("div");
                headDiv.className = "head-pointer";
                headDiv.textContent = "HEAD";

                let headArrowDiv = document.createElement("div");
                headArrowDiv.className = "head-arrow";
                headArrowDiv.textContent = "↓";

                nodeDiv.insertBefore(headDiv, nodeDiv.firstChild);
                nodeDiv.insertBefore(headArrowDiv, nodeDiv.firstChild);
            }

            // Append node and index to wrapper
            nodeWrapper.appendChild(nodeDiv);
            nodeWrapper.appendChild(indexDiv);

            listContainer.appendChild(nodeWrapper);
            temp = temp.next;
            index++;
        }

        let nodePointers = document.querySelectorAll(".node-pointer");
        if (nodePointers.length > 0) {
            nodePointers[nodePointers.length - 1].innerHTML = `<span class="null-sign">∅</span>`;
        }
    }

    highlightNode(index) {
        let nodes = document.querySelectorAll(".node");
        if (nodes[index - 1]) {
            nodes[index - 1].classList.add("blink-node");
            setTimeout(() => {
                nodes[index - 1].classList.remove("blink-node");
            }, 500);
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

let linkedList = new LinkedList();

// Add this function to script.js
function runSimulation() {
    let insertFieldsVisible = document.getElementById("insertDeleteFields").style.display !== "none";
    let deleteFieldsVisible = document.getElementById("deleteField").style.display !== "none";
    let searchFieldVisible = document.getElementById("searchField").style.display !== "none";

    if (insertFieldsVisible) {
        let value = document.getElementById("nodeValue").value.trim();
        let index = document.getElementById("nodeIndex").value.trim();

        if (value !== "" && index !== "" && !isNaN(value) && !isNaN(index)) {
            linkedList.insertAt(parseInt(value), parseInt(index));
        } else {
            alert("Please provide both a valid value and index.");
        }
    } else if (searchFieldVisible) {
        let value = document.getElementById("searchValue").value.trim();
        if (value !== "" && !isNaN(value)) {
            linkedList.search(parseInt(value));
        } else {
            alert("Please provide a valid value for Search.");
        }
    } else if (deleteFieldsVisible) {
        let deleteindex = document.getElementById("deleteindex").value.trim();
        if (deleteindex !== "" && !isNaN(deleteindex)) {
            linkedList.deleteAt(parseInt(deleteindex));  // Corrected this line
        } else {
            alert("Please provide a valid index for deletion");
        }
    }
    
}

function resetInputs() {
    document.getElementById("nodeValue").value = "";
    document.getElementById("nodeIndex").value = "";
    document.getElementById("deleteindex").value = "";
    document.getElementById("searchValue").value = "";
}


function showInsertFields() {
    resetInputs()
    document.getElementById('insertDeleteFields').style.display = 'block';
    document.getElementById('searchField').style.display = 'none';
    document.getElementById('deleteField').style.display = 'none';
    document.getElementById('nodeValue').placeholder = 'Enter the Element';
    document.getElementById('nodeIndex').placeholder = 'Enter the Index';
    document.getElementById('runSimulationButton').style.display = 'block';
}

function showDeleteFields() {
    resetInputs()
    document.getElementById('deleteField').style.display = 'block';
    document.getElementById('insertDeleteFields').style.display = 'none';
    document.getElementById('searchField').style.display = 'none';
    document.getElementById('deleteindex').placeholder = 'Enter the Index to Delete';
    document.getElementById('runSimulationButton').style.display = 'block';
}

function showSearchField() {
    resetInputs()
    document.getElementById('insertDeleteFields').style.display = 'none';
    document.getElementById('deleteField').style.display = 'none';
    document.getElementById('searchField').style.display = 'block';
    document.getElementById('runSimulationButton').style.display = 'block';
}

function createList() {
    let valuesInput = document.getElementById("nodeValues").value.trim();
    if (!valuesInput) {
        alert("Please enter values to create a list.");
        return;
    }

    let values = valuesInput.split(",").map(num => parseInt(num.trim())).filter(num => !isNaN(num));

    if (values.length === 0) {
        alert("Invalid input. Enter numbers separated by commas.");
        return;
    }

    linkedList.createFromValues(values);
    document.getElementById("operations").style.display = "block";
}