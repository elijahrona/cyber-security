import React from "react";
import PreQuizSurvey from "./Tasks/PreQuizSurvey";
import TaskOne from "./Tasks/TaskOne";
import TaskTwo from "./Tasks/TaskTwo";
import TaskThree from "./Tasks/TaskThree";
import TaskFour from "./Tasks/TaskFour";
import TaskFive from "./Tasks/TaskFive";
import TaskSix from "./Tasks/TaskSix";
import TaskSeven from "./Tasks/TaskSeven";
import TaskEight from "./Tasks/TaskEight";
import TaskNine from "./Tasks/TaskNine";
import TaskTen from "./Tasks/TaskTen";
import PostQuizSurvey from "./Tasks/PostQuizSurvey";
import UserDashboard from "./Tasks/UserDashboard";
import SlidesView from "./SlidesView";

function TaskManager({
  currentTask,
  setCurrentTask,
  handleSurveyComplete,
  handleTaskComplete,
  usersData,
  setUsersData,
  participantCode,
}) {
  // Helper to store the selected learning strategy pathway inside userData
  const selectPathway = (pathType) => {
    const formattedDate = new Date()
      .toISOString()
      .replace("T", " ")
      .split(".")[0];

    setUsersData((prev) => {
      const userIndex = prev.findIndex((u) => u.code === participantCode);
      const updated = [...prev];
      if (userIndex > -1) {
        updated[userIndex] = {
          ...updated[userIndex],
          learningPath: pathType, // 'gamified' or 'slides'
          lastUpdated: formattedDate,
        };
      } else {
        updated.push({
          code: participantCode,
          learningPath: pathType,
          quizzes: [],
          createdAt: formattedDate,
          lastUpdated: formattedDate,
        });
      }
      return updated;
    });

    // Handle routing logic based on decision path chosen
    if (pathType === "gamified") {
      setCurrentTask(1); // Routing straight to Task One
    } else {
      setCurrentTask(14); // Routing to custom slides placeholder screen view
    }
  };

  return (
    <>
      {/* STEP 0: PRE-QUIZ SURVEY */}
      {currentTask === 0 && (
        <PreQuizSurvey
          onComplete={(data) => {
            // Intercept complete profile to move onto the Choice Path screen instead of directly to Task 1
            setUsersData((prev) => {
              const userIndex = prev.findIndex(
                (u) => u.code === participantCode,
              );
              const updated = [...prev];
              if (userIndex > -1) {
                updated[userIndex] = { ...updated[userIndex], preSurvey: data };
              } else {
                updated.push({
                  code: participantCode,
                  preSurvey: data,
                  quizzes: [],
                });
              }
              return updated;
            });
            setCurrentTask(13); // Divert to selection dashboard view
          }}
        />
      )}

      {/* STEP 13: TRAINING PATH SELECTION SCREEN */}
      {currentTask === 13 && (
        <div
          className="onboarding-form"
          style={{ textAlign: "center", padding: "30px" }}
        >
          <h2 style={{ color: "#22d3ee", marginBottom: "15px" }}>
            Choose Your Training Method
          </h2>
          <p
            style={{ color: "#94a3b8", marginBottom: "30px", fontSize: "1rem" }}
          >
            Select how you would prefer to complete your cybersecurity training.
          </p>
          <div
            style={{
              display: "flex",
              gap: "20px",
              justifyContent: "center",
              width: "100%",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            <button
              className="btn-primary"
              style={{ flex: 1, padding: "20px", fontSize: "1.1rem" }}
              onClick={() => selectPathway("gamified")}
            >
              🎮 Gamified Challenge
            </button>
            <button
              className="btn-secondary-custom"
              style={{
                flex: 1,
                padding: "20px",
                fontSize: "1.1rem",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: "600",
                background: "rgba(30, 41, 59, 0.7)",
                color: "#e2e8f0",
                border: "1px solid #334155",
              }}
              onClick={() => selectPathway("slides")}
            >
              📊 View Training Pack
            </button>
          </div>
        </div>
      )}

      {/* STEP 14: SLIDES VIEW SCREEN PLATFORM */}
      {currentTask === 14 && (
        <SlidesView onComplete={() => setCurrentTask(11)} />
      )}

      {/* STEPS 1 - 10: THE MISSIONS (GAMIFIED PATH) */}
      {currentTask === 1 && (
        <TaskOne
          onComplete={(data) => handleTaskComplete(1, data)}
          onNext={() => setCurrentTask(2)}
        />
      )}

      {currentTask === 2 && (
        <TaskTwo
          onComplete={(data) => handleTaskComplete(2, data)}
          onNext={() => setCurrentTask(3)}
        />
      )}

      {currentTask === 3 && (
        <TaskThree
          onComplete={(data) => handleTaskComplete(3, data)}
          onNext={() => setCurrentTask(4)}
        />
      )}

      {currentTask === 4 && (
        <TaskFour
          onComplete={(data) => handleTaskComplete(4, data)}
          onNext={() => setCurrentTask(5)}
        />
      )}

      {currentTask === 5 && (
        <TaskFive
          onComplete={(data) => handleTaskComplete(5, data)}
          onNext={() => setCurrentTask(6)}
        />
      )}

      {currentTask === 6 && (
        <TaskSix
          onComplete={(data) => handleTaskComplete(6, data)}
          onNext={() => setCurrentTask(7)}
        />
      )}

      {currentTask === 7 && (
        <TaskSeven
          onComplete={(data) => handleTaskComplete(7, data)}
          onNext={() => setCurrentTask(8)}
        />
      )}

      {currentTask === 8 && (
        <TaskEight
          onComplete={(data) => handleTaskComplete(8, data)}
          onNext={() => setCurrentTask(9)}
        />
      )}

      {currentTask === 9 && (
        <TaskNine
          onComplete={(data) => handleTaskComplete(9, data)}
          onNext={() => setCurrentTask(10)}
        />
      )}

      {currentTask === 10 && (
        <TaskTen
          onComplete={(data) => handleTaskComplete(10, data)}
          onNext={() => setCurrentTask(11)} // Moves to Post-Survey
        />
      )}

      {/* STEP 11: POST-QUIZ SURVEY */}
      {currentTask === 11 && (
        <PostQuizSurvey
          onComplete={(data) => handleSurveyComplete("postSurvey", data)}
        />
      )}

      {/* STEP 12: FINAL DASHBOARD (Only visible to Gamified Challenge participants) */}
      {currentTask === 12 && (
        <UserDashboard
          data={usersData.find((u) => u.code === participantCode)}
        />
      )}
    </>
  );
}

export default TaskManager;
