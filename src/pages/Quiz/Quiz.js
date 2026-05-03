import React, { useState, useEffect } from "react";
import "./Quiz.css";
import TaskOne from "./Tasks/TaskOne"; // Ensure path is correct
import TaskTwo from "./Tasks/TaskTwo";
import TaskThree from "./Tasks/TaskThree";
import TaskFour from "./Tasks/TaskFour";
import TaskFive from "./Tasks/TaskFive";
import TaskSix from "./Tasks/TaskSix";
import TaskSeven from "./Tasks/TaskSeven";
import TaskEight from "./Tasks/TaskEight";
import TaskNine from "./Tasks/TaskNine";
import TaskTen from "./Tasks/TaskTen";
import UserDashboard from "./Tasks/UserDashboard";

function Quiz() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentTask, setCurrentTask] = useState(1);
  const [hasConsented, setHasConsented] = useState(false);

  // NEW: Store participant code instead of name/email
  const [participantCode, setParticipantCode] = useState("");
  const [usersData, setUsersData] = useState([]);
  const [allResults, setAllResults] = useState({});

  // Helper: Generate a unique random code (e.g., AGENT-X92B)
  const generateCode = () => {
    return `AGENT-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  };

  // 1. Initial Logic: Check LocalStorage for existing code
  useEffect(() => {
    const savedCode = localStorage.getItem("cyber_infiltration_code");
    if (savedCode) {
      setParticipantCode(savedCode);
    }
  }, []);

  // Inside your Quiz component...

  useEffect(() => {
    const savedCode = localStorage.getItem("cyber_infiltration_code");

    if (savedCode) {
      // We found a returning user
      setParticipantCode(savedCode);
    } else if (gameStarted && !hasConsented) {
      // New user: Silently generate ID and proceed
      const newCode = generateCode();
      localStorage.setItem("cyber_infiltration_code", newCode);
      setParticipantCode(newCode);
      setHasConsented(true); // Direct entry for new players
    }
  }, [gameStarted, hasConsented]);

  const handleIdentityChoice = (choice) => {
    if (choice === "retry") {
      setHasConsented(true);
    } else if (choice === "new") {
      const newCode = generateCode();
      localStorage.setItem("cyber_infiltration_code", newCode);
      setParticipantCode(newCode);
      setHasConsented(true);
    }
  };

  // 2. Add the Scroll-to-Top Logic
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth", // Use "smooth" for a nice transition or "instant" for speed
    });
  }, [currentTask, gameStarted]);

  const taskNames = [
    "Spot the Fake Emails",
    "Create a Strong Password",
    "Protect Your Network",
    "Stop the Fake IT Call",
    "Decode the Secret Message",
    "The USB Trap",
    "Spot the Fake Website",
    "The Office Snoop",
    "Notification Spam Attack",
    "What to Do After a Hack",
  ];

  const showInstructions = () => {
    alert(
      "How to Play: \n1. Read the instructions and examples carefully. \n2. Select the appropriate answer for each scenario. \n3. Progress to the next mission and improve your score!",
    );
  };

  // This function runs every time a task is submitted
  const handleTaskComplete = (taskId, taskData) => {
    const now = new Date();
    const formattedDate = now.toISOString().replace("T", " ").split(".")[0];

    const newQuizEntry = {
      task: taskId,
      score: taskData.score,
      risk: taskData.risk,
      time: taskData.time,
      submittedAt: formattedDate,
    };

    setAllResults((prev) => ({ ...prev, [taskId]: taskData }));

    setUsersData((prevUsers) => {
      // Search by participantCode instead of email
      const userIndex = prevUsers.findIndex((u) => u.code === participantCode);
      let updatedArray;

      if (userIndex > -1) {
        updatedArray = [...prevUsers];
        updatedArray[userIndex] = {
          ...updatedArray[userIndex],
          quizzes: [...updatedArray[userIndex].quizzes, newQuizEntry],
          lastUpdated: formattedDate,
        };
      } else {
        const newUser = {
          code: participantCode, // Use Code
          quizzes: [newQuizEntry],
          createdAt: formattedDate,
          lastUpdated: formattedDate,
        };
        updatedArray = [...prevUsers, newUser];
      }
      return updatedArray;
    });
  };

  /* PASTE THIS INSTEAD */
  const totalScenarios = 10;

  // Find the current logged-in user in your array
  const currentUser = usersData.find((u) => u.code === participantCode);
  const completedQuizzes = currentUser ? currentUser.quizzes : [];

  const avgScore = completedQuizzes.length
    ? Math.round(
        completedQuizzes.reduce((acc, curr) => acc + curr.score, 0) /
          completedQuizzes.length,
      )
    : 0;

  const avgRisk = completedQuizzes.length
    ? Math.round(
        completedQuizzes.reduce((acc, curr) => acc + curr.risk, 0) /
          completedQuizzes.length,
      )
    : 0;

  const totalTime = completedQuizzes.reduce((acc, curr) => acc + curr.time, 0);

  return (
    <div className="quiz-wrapper">
      {/* Upper Stats Component */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Scenario</div>
          <div className="stat-value">
            <div className="stat-value">
              {Math.min(hasConsented ? currentTask : 0, 10)} / {totalScenarios}
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg. Score</div>
          <div className="stat-value">{avgScore}%</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg. Risk</div>
          <div className="stat-value">{avgRisk}%</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Time</div>
          <div className="stat-value">{totalTime}s</div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-quiz-container">
        {!gameStarted ? (
          <>
            <h1>Cyber Infiltration Defense</h1>
            <p>
              You are about to enter a series of tactical simulations. Learn the
              tasks, analyze real-world examples, and solve critical scenarios
              to keep the office network safe.
            </p>
            <div className="quiz-actions">
              <button
                className="btn-primary"
                onClick={() => setGameStarted(true)}
              >
                Start Now
              </button>
              <button
                className="btn-secondary"
                style={{
                  border: "1px solid #94a3b8",
                  padding: "12px 25px",
                  borderRadius: "12px",
                  background: "none",
                  color: "white",
                  cursor: "pointer",
                }}
                onClick={showInstructions}
              >
                How to Play
              </button>
            </div>
          </>
        ) : (
          <>
            {/* PHASE 2: Identity Collection & Consent */}
            {/* NEW PHASE 2: Identity Collection with Logic */}
            {gameStarted && !hasConsented && (
              <div className="onboarding-form">
                <h2 style={{ color: "#22d3ee", marginBottom: "20px" }}>
                  Verification System
                </h2>
                {/* This block ONLY renders if an ID was found in localStorage */}
                {localStorage.getItem("cyber_infiltration_code") && (
                  <div style={{ textAlign: "center" }}>
                    <p style={{ color: "#e2e8f0" }}>
                      Welcome back, <strong>{participantCode}</strong>.
                    </p>
                    <p
                      style={{
                        color: "#94a3b8",
                        fontSize: "0.9rem",
                        marginBottom: "25px",
                      }}
                    >
                      We detected a previous session. Do you want to continue as
                      this agent or start fresh?
                    </p>
                    <div
                      style={{
                        display: "flex",
                        gap: "15px",
                        justifyContent: "center",
                        maxWidth: "500px",
                        margin: "0 auto",
                        width: "100%",
                      }}
                    >
                      <button
                        className="btn-primary"
                        style={{ flex: 1 }}
                        onClick={() => handleIdentityChoice("retry")}
                      >
                        Resume As {participantCode}
                      </button>

                      <button
                        className="btn-secondary-custom"
                        style={{
                          flex: 1,
                          /* Forcing structural parity with btn-primary */
                          padding: "12px 20px",
                          borderRadius: "12px",
                          cursor: "pointer",
                          fontWeight: "600",
                          fontSize: "1rem",
                          // Cyber-dark aesthetic for the secondary choice
                          background: "rgba(30, 41, 59, 0.7)",
                          color: "#e2e8f0",
                          border: "1px solid #334155",
                          transition: "all 0.2s ease-in-out",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background =
                            "rgba(51, 65, 85, 1)";
                          e.currentTarget.style.borderColor = "#475569";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background =
                            "rgba(30, 41, 59, 0.7)";
                          e.currentTarget.style.borderColor = "#334155";
                        }}
                        onClick={() => handleIdentityChoice("new")}
                      >
                        New Participant
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* PHASE 3: The Quizzes */}
            {gameStarted && hasConsented && (
              <>
                {gameStarted && currentTask === 1 && (
                  <TaskOne
                    onComplete={(data) => handleTaskComplete(1, data)}
                    onNext={() => setCurrentTask(2)}
                  />
                )}

                {gameStarted && currentTask === 2 && (
                  <TaskTwo
                    onComplete={(data) => handleTaskComplete(2, data)}
                    onNext={() => setCurrentTask(3)}
                  />
                )}

                {gameStarted && currentTask === 3 && (
                  <TaskThree
                    onComplete={(data) => handleTaskComplete(3, data)}
                    onNext={() => setCurrentTask(4)}
                  />
                )}

                {gameStarted && currentTask === 4 && (
                  <TaskFour
                    onComplete={(data) => handleTaskComplete(4, data)}
                    onNext={() => setCurrentTask(5)}
                  />
                )}

                {gameStarted && currentTask === 5 && (
                  <TaskFive
                    onComplete={(data) => handleTaskComplete(5, data)}
                    onNext={() => setCurrentTask(6)}
                  />
                )}

                {gameStarted && currentTask === 6 && (
                  <TaskSix
                    onComplete={(data) => handleTaskComplete(6, data)}
                    onNext={() => setCurrentTask(7)}
                  />
                )}

                {gameStarted && currentTask === 7 && (
                  <TaskSeven
                    onComplete={(data) => handleTaskComplete(7, data)}
                    onNext={() => setCurrentTask(8)}
                  />
                )}

                {gameStarted && currentTask === 8 && (
                  <TaskEight
                    onComplete={(data) => handleTaskComplete(8, data)}
                    onNext={() => setCurrentTask(9)}
                  />
                )}

                {gameStarted && currentTask === 9 && (
                  <TaskNine
                    onComplete={(data) => handleTaskComplete(9, data)}
                    onNext={() => setCurrentTask(10)}
                  />
                )}

                {gameStarted && currentTask === 10 && (
                  <TaskTen
                    onComplete={(data) => handleTaskComplete(10, data)}
                    onNext={() => setCurrentTask(11)}
                  />
                )}

                {gameStarted && currentTask === 11 && (
                  <UserDashboard data={usersData[0]} />
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Footer Tasks Section */}
      <div className="task-footer">
        {taskNames.map((name, index) => (
          <div
            key={index}
            /* Compare the index to the currentTask state (adjusted for 0-indexing) */
            className={`task-box ${gameStarted && currentTask === index + 1 ? "active" : ""}`}
          >
            {index + 1}. {name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Quiz;
