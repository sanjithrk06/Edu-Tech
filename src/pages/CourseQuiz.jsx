import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, ChevronLeft } from "lucide-react";
import api from "./../config/axios";

const CourseQuiz = ({ quiz, onBack }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [questions, setQuestions] = useState([]);

  // Fetch quiz questions dynamically
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await api.get(`quiz/${quiz.quiz_id}`);
        const data = res.data?.data;
        if (data?.questions) {
          const formatted = data.questions.map((q) => ({
            id: q.id,
            question: q.question_text,
            options: q.options.map((opt) => ({
              id: opt.id,
              text: opt.option_text,
            })),
          }));
          setQuestions(formatted);
        }
      } catch (err) {
        console.error("Failed to fetch quiz:", err);
      }
    };

    fetchQuestions();
  }, [quiz.quiz_id]);

  // Submit the quiz and send selected answers
  const handleSubmit = async () => {
    try {
      const payload = {
        answers: { ...selectedAnswers },
      };

    const res = await api.post(`quiz/${quiz.quiz_id}/submit`, payload);
      const result = res.data?.data;

      if (result) {
        setScore(Math.round(result.score));
      }
      setIsSubmitted(true);
    } catch (err) {
      console.error("Failed to submit quiz:", err);
    }
  };

  const questionsPerPage = 5;
  const totalPages = Math.ceil(questions.length / questionsPerPage);

  const getCurrentQuestions = () => {
    const start = currentPage * questionsPerPage;
    const end = start + questionsPerPage;
    return questions.slice(start, end);
  };

  const handleOptionSelect = (questionId, optionId) => {
    if (isSubmitted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: optionId,
    });
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const canGoNext = currentPage < totalPages - 1;
  const canGoPrevious = currentPage > 0;

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={staggerChildren}
    >
      {/* ... (UI remains unchanged) */}
      <motion.div
        className="flex items-center justify-between"
        variants={fadeInUp}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="text-primary hover:text-primary/80 flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Quizzes</span>
          </button>
          <h3 className="text-xl font-bold text-secondary/80">{quiz.title}</h3>
        </div>

        {!isSubmitted && (
          <div className="text-sm text-gray-600">
            Question {currentPage * questionsPerPage + 1}-
            {Math.min((currentPage + 1) * questionsPerPage, questions.length)}{" "}
            of {questions.length}
          </div>
        )}
      </motion.div>

      {/* Replace where options are rendered */}
      {!isSubmitted ? (
        <motion.div className="space-y-8" variants={staggerChildren}>
          {getCurrentQuestions().map((question, qIndex) => (
            <motion.div
              key={question.id}
              className="bg-white p-6 rounded-xl shadow-sm"
              variants={fadeInUp}
            >
              <p className="text-lg font-medium text-secondary mb-4">
                {currentPage * questionsPerPage + qIndex + 1}.{" "}
                {question.question}
              </p>

              <motion.div className="space-y-3" variants={staggerChildren}>
                {question.options.map((option) => (
                  <motion.div
                    key={option.id}
                    variants={fadeInUp}
                    onClick={() => handleOptionSelect(question.id, option.id)}
                    className={`p-3 border rounded-lg cursor-pointer flex items-center gap-3 transition-colors ${
                      selectedAnswers[question.id] === option.id
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        selectedAnswers[question.id] === option.id
                          ? "bg-primary text-white"
                          : "border border-gray-300"
                      }`}
                    >
                      {selectedAnswers[question.id] === option.id && (
                        <Check className="w-3 h-3" />
                      )}
                    </div>
                    <span>{option.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        // ... (Results screen remains unchanged)
        // Replace only score logic
        <motion.div
          variants={fadeInUp}
          className="bg-white p-8 rounded-xl text-center space-y-6"
        >
          <h3 className="text-2xl font-bold text-secondary">Quiz Complete!</h3>
          <div className="flex justify-center">
            <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-3xl font-bold text-primary">{score}%</span>
            </div>
          </div>
          <div className="text-lg text-gray-700">
            Thank you for submitting your answers!
          </div>
          <div className="flex justify-center gap-4 pt-4">
            <button
              onClick={() => {
                setSelectedAnswers({});
                setIsSubmitted(false);
                setCurrentPage(0);
                setScore(null);
              }}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium"
            >
              Retry Quiz
            </button>
            <button
              onClick={onBack}
              className="px-6 py-2 bg-primary text-white rounded-lg font-medium"
            >
              Back to Course
            </button>
          </div>
        </motion.div>
      )}

      {/* Navigation and Submit */}
      <motion.div
        className="flex justify-between items-center pt-6"
        variants={fadeInUp}
      >
        <button
          onClick={() => setCurrentPage((prev) => prev - 1)}
          disabled={!canGoPrevious}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            canGoPrevious
              ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </button>

        {canGoNext ? (
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 font-medium"
          >
            Submit Quiz
          </button>
        )}
      </motion.div>
    </motion.div>
  );
};

export default CourseQuiz;
