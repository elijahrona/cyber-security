import React, { useState, useEffect } from "react";
import "./Quiz.css";
import TaskOne from "./Tasks/TaskOne"; // Ensure path is correct
import TaskTwo from "./Tasks/TaskTwo";

function Quiz() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentTask, setCurrentTask] = useState(1);
  const [hasConsented, setHasConsented] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: "", email: "" });
  // This state holds the array of all users and their performance
  const [usersData, setUsersData] = useState([]);
  // Track results of each task: { taskId: { score, risk, time } }
  const [allResults, setAllResults] = useState({});

  // 2. Add the Scroll-to-Top Logic
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth", // Use "smooth" for a nice transition or "instant" for speed
    });
  }, [currentTask, gameStarted]);

  const taskNames = [
    "Phishing Defense",
    "Password Strength",
    "Network Security",
    "Social Engineering",
    "Encryption Basics",
    "Phishing Defense",
    "Password Strength",
    "Network Security",
    "Social Engineering",
    "Encryption Basics",
  ];

  const handleInfoSubmit = (e) => {
    e.preventDefault();
    if (userInfo.name && userInfo.email) {
      setHasConsented(true);
    }
  };

  const showInstructions = () => {
    alert(
      "How to Play: \n1. Read the instructions and examples carefully. \n2. Select the appropriate answer for each scenario. \n3. Progress to the next mission and improve your score!",
    );
  };

  // This function runs every time a task is submitted
  const handleTaskComplete = (taskId, taskData) => {
    // 1. Generate the formatted date
    const now = new Date();
    const formattedDate = now.toISOString().replace("T", " ").split(".")[0];
    // Result: YYYY-MM-DD HH:MM:SS

    const newQuizEntry = {
      task: taskId,
      score: taskData.score,
      risk: taskData.risk,
      time: taskData.time,
      submittedAt: formattedDate, // Added to the quiz entry
    };

    // 1. Update allResults so the cards update immediately
    setAllResults((prev) => ({
      ...prev,
      [taskId]: taskData,
    }));

    // 2. Update the master usersData array
    setUsersData((prevUsers) => {
      const userIndex = prevUsers.findIndex((u) => u.email === userInfo.email);
      let updatedArray;

      if (userIndex > -1) {
        updatedArray = [...prevUsers];
        updatedArray[userIndex] = {
          ...updatedArray[userIndex],
          quizzes: [...updatedArray[userIndex].quizzes, newQuizEntry],
          lastUpdated: formattedDate, // Updates user's overall last activity
        };
      } else {
        const newUser = {
          name: userInfo.name,
          email: userInfo.email,
          quizzes: [newQuizEntry],
          createdAt: formattedDate, // Added for new users
          lastUpdated: formattedDate, // Added for new users
        };
        updatedArray = [...prevUsers, newUser];
      }

      console.log("Updated Users Data Array:", updatedArray);
      return updatedArray;
    });
  };

  /* PASTE THIS INSTEAD */
  const totalScenarios = 14;

  // Find the current logged-in user in your array
  const currentUser = usersData.find((u) => u.email === userInfo.email);
  // If they exist, get their quizzes; otherwise, use an empty array
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
              {hasConsented ? currentTask : 0}/{totalScenarios}
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
              to keep the network safe.
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
            {gameStarted && !hasConsented && (
              <div className="onboarding-form">
                <h2 style={{ color: "#22d3ee", marginBottom: "20px" }}>
                  Verification Required
                </h2>
                <p
                  style={{
                    color: "#94a3b8",
                    fontSize: "0.9rem",
                    marginBottom: "25px",
                  }}
                >
                  To ensure unique session identification and prevent duplicate
                  entries, please provide your details.
                </p>

                <form
                  onSubmit={handleInfoSubmit}
                  style={{ maxWidth: "400px", margin: "0 auto" }}
                >
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="password-input"
                    required
                    value={userInfo.name}
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, name: e.target.value })
                    }
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="password-input"
                    required
                    value={userInfo.email}
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, email: e.target.value })
                    }
                  />

                  <div
                    style={{
                      background: "rgba(34, 211, 238, 0.05)",
                      padding: "15px",
                      borderRadius: "12px",
                      border: "1px solid rgba(34, 211, 238, 0.1)",
                      marginBottom: "20px",
                      textAlign: "left",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "0.8rem",
                        color: "#64748b",
                        margin: 0,
                      }}
                    >
                      🛡️ <strong>Privacy Notice:</strong> Your data is used
                      strictly for academic research and identification. No
                      marketing emails will be sent, and no third party has
                      access to your identity.
                    </p>
                  </div>

                  <button type="submit" className="btn-primary">
                    Begin Simulation
                  </button>
                </form>
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
                  <div className="main-quiz-container">
                    <h1>Scenario {currentTask}</h1>
                    <p>Loading next mission...</p>
                  </div>
                )}

                {gameStarted && currentTask === 4 && (
                  <div className="main-quiz-container">
                    <h1>Scenario {currentTask}</h1>
                    <p>Loading next mission...</p>
                  </div>
                )}

                {gameStarted && currentTask === 5 && (
                  <div className="main-quiz-container">
                    <h1>Scenario {currentTask}</h1>
                    <p>Loading next mission...</p>
                  </div>
                )}

                {gameStarted && currentTask === 6 && (
                  <div className="main-quiz-container">
                    <h1>Scenario {currentTask}</h1>
                    <p>Loading next mission...</p>
                  </div>
                )}

                {gameStarted && currentTask === 7 && (
                  <div className="main-quiz-container">
                    <h1>Scenario {currentTask}</h1>
                    <p>Loading next mission...</p>
                  </div>
                )}

                {gameStarted && currentTask === 8 && (
                  <div className="main-quiz-container">
                    <h1>Scenario {currentTask}</h1>
                    <p>Loading next mission...</p>
                  </div>
                )}

                {gameStarted && currentTask === 9 && (
                  <div className="main-quiz-container">
                    <h1>Scenario {currentTask}</h1>
                    <p>Loading next mission...</p>
                  </div>
                )}

                {gameStarted && currentTask === 10 && (
                  <div className="main-quiz-container">
                    <h1>Scenario {currentTask}</h1>
                    <p>Loading next mission...</p>
                  </div>
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
