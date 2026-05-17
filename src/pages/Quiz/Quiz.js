import React, { useState, useEffect } from "react";
import "./Quiz.css";

// New Child Component Imports
import StatsGrid from "./Components/StatsGrid";
import WelcomeScreen from "./Components/WelcomeScreen";
import VerificationSystem from "./Components/VerificationSystem";
import TaskManager from "./Components/TaskManager";

function Quiz() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentTask, setCurrentTask] = useState(0);
  const [hasConsented, setHasConsented] = useState(false);

  // Store participant code instead of name/email
  const [participantCode, setParticipantCode] = useState("");
  const [usersData, setUsersData] = useState([]);
  const [agentName, setAgentName] = useState("");

  const totalScenarios = 10;

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

  // Helper: Generate a unique random code (e.g., PARTICIPANT-X92B)
  const generateCode = () => {
    return `PARTICIPANT-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  };

  // 1. Initial Logic: Check LocalStorage for existing code
  useEffect(() => {
    const savedCode = localStorage.getItem("cyber_infiltration_code");
    if (savedCode) {
      setParticipantCode(savedCode);
    }
  }, []);

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
      behavior: "smooth",
    });
  }, [currentTask, gameStarted]);

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

    setUsersData((prevUsers) => {
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
          name: agentName || "Agent",
          code: participantCode,
          quizzes: [newQuizEntry],
          createdAt: formattedDate,
          lastUpdated: formattedDate,
        };
        updatedArray = [...prevUsers, newUser];
      }
      return updatedArray;
    });
  };

  // Find the current logged-in user in your array
  const currentUser = usersData.find((u) => u.code === participantCode);
  const learningPath = currentUser ? currentUser.learningPath : null;
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

  const handleSurveyComplete = (type, surveyData) => {
    const formattedDate = new Date()
      .toISOString()
      .replace("T", " ")
      .split(".")[0];

    // Save the survey answers directly to state first
    setUsersData((prev) => {
      const userIndex = prev.findIndex((u) => u.code === participantCode);
      const updated = [...prev];

      if (userIndex > -1) {
        updated[userIndex] = {
          ...updated[userIndex],
          [type]: surveyData,
          lastUpdated: formattedDate,
        };
      } else {
        updated.push({
          code: participantCode,
          [type]: surveyData,
          quizzes: [],
          createdAt: formattedDate,
          lastUpdated: formattedDate,
        });
      }
      return updated;
    });

    // Clean, deterministic routing rules
    if (type === "postSurvey") {
      // Both pathways proceed straight into step 12 to fire their HTTP POST requests
      setCurrentTask(12);
    } else {
      // Divert pre-survey submittals immediately to the Choice Screen (Step 13)
      setCurrentTask(13);
    }
  };

  return (
    <div className="quiz-wrapper">
      {/* Upper Stats Component */}
      {learningPath === "gamified" && (
        <StatsGrid
          hasConsented={hasConsented}
          currentTask={currentTask}
          totalScenarios={totalScenarios}
          avgScore={avgScore}
          avgRisk={avgRisk}
        />
      )}

      {/* Main Content Area */}
      <div className="main-quiz-container">
        {!gameStarted ? (
          <WelcomeScreen
            agentName={agentName}
            setAgentName={setAgentName}
            onStart={() => setGameStarted(true)}
            onShowInstructions={showInstructions}
          />
        ) : (
          <>
            {/* PHASE 2: Identity Collection & Consent */}
            {gameStarted && !hasConsented && (
              <VerificationSystem
                participantCode={participantCode}
                onIdentityChoice={handleIdentityChoice}
              />
            )}

            {/* PHASE 3: The Quizzes & Alternative Pathways */}
            {gameStarted && hasConsented && (
              <TaskManager
                currentTask={currentTask}
                setCurrentTask={setCurrentTask}
                handleSurveyComplete={handleSurveyComplete}
                handleTaskComplete={handleTaskComplete}
                usersData={usersData}
                setUsersData={setUsersData} // Added to save selected path seamlessly
                participantCode={participantCode}
              />
            )}
          </>
        )}
      </div>

      {/* Footer Tasks Section */}
      <div className="task-footer">
        {taskNames.map((name, index) => (
          <div
            key={index}
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
