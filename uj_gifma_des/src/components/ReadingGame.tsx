import { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, CheckCircle, XCircle } from 'lucide-react';
import { getGameConfig } from '../utils/gameConfig';
import type { Lesson } from '../data/penzugyiAlapismeretkLessons';
import { COLORS, SIZES, SPACING, FONT_WEIGHT, SHADOWS } from '../utils/styleConstants';

interface ReadingGameProps {
  onBackToHome?: () => void;
  onWin?: () => void;
  lessonNumber?: number;
  lessonData?: Lesson;
}

type GameState = 'reading' | 'questions' | 'result';

interface Question {
  question: string;
  answer: string;
  keywords: string[]; // Keywords for flexible matching
}

export function ReadingGame({ onBackToHome, onWin, lessonNumber = 1, lessonData }: ReadingGameProps) {
  console.log('📖 ReadingGame mounted/updated:', { lessonNumber, hasLessonData: !!lessonData });
  
  const config = getGameConfig();
  const [gameState, setGameState] = useState<GameState>('reading');
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [results, setResults] = useState<boolean[]>([]);
  const [score, setScore] = useState(0);

  // Use lessonData from penzugyiAlapismeretkLessons
  const readingContent = lessonData?.reading.content || "";
  const readingTitle = lessonData?.reading.title || "";

  // Initialize with ALL questions from the lesson
  useEffect(() => {
    // Only works with lessonData from penzugyiAlapismeretkLessons
    if (lessonData && lessonData.reading.questions) {
      const allQuestions: Question[] = lessonData.reading.questions.map(q => ({
        question: q.question,
        answer: q.answer,
        keywords: q.keywords
      }));
      
      // Use ALL questions from the lesson (shuffle for variety but include all)
      const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
      const selectedQs = shuffled;
      
      setSelectedQuestions(selectedQs);
      setAnswers(Array(selectedQs.length).fill(''));
    }
  }, [lessonData, config.readingQuestionsCount]);

  const handleReadComplete = () => {
    setGameState('questions');
  };

  const checkAnswer = (userAnswer: string, question: Question): boolean => {
    const normalized = userAnswer.toLowerCase().trim();
    // Check if any keyword is in the answer
    return question.keywords.some(keyword => 
      normalized.includes(keyword.toLowerCase())
    );
  };

  const handleSubmitAnswers = () => {
    const checkedResults = selectedQuestions.map((q, index) => checkAnswer(answers[index], q));
    const correctCount = checkedResults.filter(r => r).length;
    const percentage = (correctCount / selectedQuestions.length) * 100;
    
    setResults(checkedResults);
    setScore(percentage);
    setGameState('result');
  };

  const handleRetry = () => {
    setAnswers(Array(selectedQuestions.length).fill(''));
    setResults([]);
    setScore(0);
    setGameState('questions');
  };

  const handleFinish = () => {
    // Calculate minimum required answers as 80% of total questions
    const correctCount = results.filter(r => r).length;
    const minRequired = Math.ceil(selectedQuestions.length * 0.8); // 80% of questions
    console.log('📖 ReadingGame handleFinish:', {
      correctCount,
      totalQuestions: selectedQuestions.length,
      minRequired,
      willCallOnWin: correctCount >= minRequired
    });
    
    if (onWin && correctCount >= minRequired) {
      console.log('✅ ReadingGame calling onWin!');
      onWin();
    } else if (onBackToHome) {
      console.log('⬅️ ReadingGame calling onBackToHome');
      onBackToHome();
    }
  };

  // ============================================
  // STYLE DEFINITIONS - React Native Compatible
  // ============================================
  
  const styles = {
    container: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      paddingLeft: SPACING.xl,
      paddingRight: SPACING.xl,
      paddingTop: SPACING.base,
      paddingBottom: SPACING.xl,
      overflow: 'hidden' as const,
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: SPACING.base,
    },
    backButton: {
      display: 'flex',
      alignItems: 'center',
      gap: SPACING.sm,
      color: COLORS.white,
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      opacity: 1,
      transition: 'opacity 0.3s',
    },
    backButtonInner: {
      width: 32,
      height: 32,
      backgroundColor: `${COLORS.gray800}99`,
      backdropFilter: 'blur(12px)',
      border: `${SIZES.borderThin}px solid ${COLORS.gray600}80`,
      borderRadius: SIZES.radiusLG,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...SHADOWS.large,
    },
    headerRight: {
      display: 'flex',
      alignItems: 'center',
      gap: SPACING.sm,
      color: COLORS.white,
    },
    contentCard: {
      flex: 1,
      backgroundColor: `${COLORS.gray800}99`,
      backdropFilter: 'blur(12px)',
      border: `${SIZES.borderThin}px solid ${COLORS.gray600}80`,
      borderRadius: SIZES.radiusXL,
      padding: SPACING.lg,
      ...SHADOWS.large,
      overflowY: 'auto' as const,
      marginBottom: SPACING.base,
    },
    readingContent: {
      color: COLORS.white,
      lineHeight: 1.7,
    },
    readingTitle: {
      textAlign: 'center' as const,
      marginBottom: SPACING.base,
      color: COLORS.crystalPurple,
    },
    paragraph: {
      color: COLORS.gray200,
      marginBottom: SPACING.base,
    },
    primaryButton: {
      width: '100%',
      background: `linear-gradient(to right, ${COLORS.primary}, ${COLORS.xpBlueDark})`,
      color: COLORS.white,
      paddingTop: SPACING.md,
      paddingBottom: SPACING.md,
      paddingLeft: SPACING.xl,
      paddingRight: SPACING.xl,
      borderRadius: SIZES.radiusXL,
      border: 'none',
      cursor: 'pointer',
      ...SHADOWS.large,
      transition: 'all 0.3s',
    },
    questionsTitle: {
      color: COLORS.white,
      textAlign: 'center' as const,
      marginBottom: SPACING.lg,
      color: COLORS.crystalPurple,
    },
    questionsContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: SPACING.base,
    },
    questionItem: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: SPACING.sm,
    },
    questionLabel: {
      color: COLORS.gray200,
      display: 'block',
    },
    questionInput: {
      width: '100%',
      paddingLeft: SPACING.base,
      paddingRight: SPACING.base,
      paddingTop: SPACING.sm,
      paddingBottom: SPACING.sm,
      backgroundColor: `${COLORS.gray700}99`,
      border: `${SIZES.borderThin}px solid ${COLORS.gray600}80`,
      borderRadius: SIZES.radiusLG,
      color: COLORS.white,
      outline: 'none',
    },
    submitButton: {
      width: '100%',
      background: `linear-gradient(to right, ${COLORS.crystalPurple}, ${COLORS.secondary})`,
      color: COLORS.white,
      paddingTop: SPACING.md,
      paddingBottom: SPACING.md,
      paddingLeft: SPACING.xl,
      paddingRight: SPACING.xl,
      borderRadius: SIZES.radiusXL,
      border: 'none',
      cursor: 'pointer',
      ...SHADOWS.large,
      transition: 'all 0.3s',
    },
    resultTitle: {
      color: COLORS.white,
      textAlign: 'center' as const,
      marginBottom: SPACING.md,
    },
    scoreDisplay: {
      textAlign: 'center' as const,
      marginBottom: SPACING.lg,
    },
    scorePercent: {
      fontSize: 30,
      color: COLORS.white,
      marginBottom: SPACING.sm,
    },
    scoreText: {
      color: COLORS.gray300,
    },
    resultsContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: SPACING.md,
    },
    resultCard: (isCorrect: boolean) => ({
      padding: SPACING.md,
      borderRadius: SIZES.radiusLG,
      backgroundColor: isCorrect ? `${COLORS.success}20` : `${COLORS.danger}20`,
      border: `${SIZES.borderThin}px solid ${isCorrect ? COLORS.success : COLORS.danger}80`,
    }),
    resultCardContent: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: SPACING.sm,
    },
    resultIcon: {
      width: 20,
      height: 20,
      marginTop: 2,
      flexShrink: 0,
    },
    resultTextContainer: {
      flex: 1,
    },
    resultQuestion: {
      color: COLORS.gray200,
      fontSize: SIZES.fontSM,
      marginBottom: SPACING.xs,
    },
    userAnswerText: {
      fontSize: 12,
      color: COLORS.gray400,
    },
    userAnswerValue: {
      color: COLORS.white,
    },
    correctAnswerText: {
      fontSize: 12,
      color: COLORS.gray400,
      marginTop: SPACING.xs,
    },
    correctAnswerValue: {
      color: '#86EFAC',
    },
    buttonsContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: SPACING.md,
    },
    winButton: {
      width: '100%',
      background: `linear-gradient(to right, ${COLORS.success}, #059669)`,
      color: COLORS.white,
      paddingTop: SPACING.md,
      paddingBottom: SPACING.md,
      paddingLeft: SPACING.xl,
      paddingRight: SPACING.xl,
      borderRadius: SIZES.radiusXL,
      border: 'none',
      cursor: 'pointer',
      ...SHADOWS.large,
      transition: 'all 0.3s',
      animation: 'pulse 2s infinite',
    },
    winButtonText: {
      fontFamily: 'Georgia, serif',
      fontSize: 18,
      fontWeight: FONT_WEIGHT.bold,
      letterSpacing: '0.1em',
    },
    retryButton: {
      width: '100%',
      background: `linear-gradient(to right, ${COLORS.warning}, #ea580c)`,
      color: COLORS.white,
      paddingTop: SPACING.md,
      paddingBottom: SPACING.md,
      paddingLeft: SPACING.xl,
      paddingRight: SPACING.xl,
      borderRadius: SIZES.radiusXL,
      border: 'none',
      cursor: 'pointer',
      ...SHADOWS.large,
      transition: 'all 0.3s',
    },
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      {/* NOTE: React Native - Convert to SafeAreaView with header component */}
      <div style={styles.header}>
        <button 
          onClick={onBackToHome}
          style={styles.backButton}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          <div style={styles.backButtonInner}>
            <ArrowLeft style={{ width: 20, height: 20 }} />
          </div>
          <span>Vissza</span>
        </button>
        
        <div style={styles.headerRight}>
          <BookOpen style={{ width: 20, height: 20 }} />
          <span>{lessonNumber}. Lecke - Szövegértés</span>
        </div>
      </div>

      {/* Reading Content */}
      {/* NOTE: React Native - Use ScrollView for reading content */}
      {gameState === 'reading' && (
        <>
          <div style={styles.contentCard}>
            <div style={styles.readingContent}>
              <h2 style={styles.readingTitle}>{readingTitle}</h2>
              
              {readingContent.split('\n\n').map((paragraph, index) => (
                <p key={index} style={styles.paragraph}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <button
            onClick={handleReadComplete}
            style={styles.primaryButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(59, 130, 246, 0.4), 0 10px 10px -5px rgba(59, 130, 246, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = SHADOWS.large.shadowColor;
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            Elolvastam
          </button>
        </>
      )}

      {/* Questions */}
      {/* NOTE: React Native - Use ScrollView with KeyboardAvoidingView */}
      {gameState === 'questions' && (
        <>
          <div style={styles.contentCard}>
            <h2 style={styles.questionsTitle}>Válaszolj a kérdésekre!</h2>
            <div style={styles.questionsContainer}>
              {selectedQuestions.map((q, index) => (
                <div key={index} style={styles.questionItem}>
                  <label style={styles.questionLabel}>
                    {index + 1}. {q.question}
                  </label>
                  <input
                    type="text"
                    value={answers[index]}
                    onChange={(e) => {
                      const newAnswers = [...answers];
                      newAnswers[index] = e.target.value;
                      setAnswers(newAnswers);
                    }}
                    style={styles.questionInput}
                    placeholder="Válaszod..."
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = `${COLORS.crystalPurple}80`;
                      e.currentTarget.style.boxShadow = `0 0 0 2px ${COLORS.crystalPurple}20`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = `${COLORS.gray600}80`;
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmitAnswers}
            style={styles.submitButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(139, 92, 246, 0.4), 0 10px 10px -5px rgba(139, 92, 246, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = SHADOWS.large.shadowColor;
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            Ellenőrzés
          </button>
        </>
      )}

      {/* Results */}
      {/* NOTE: React Native - Use ScrollView for results list */}
      {gameState === 'result' && (
        <>
          <div style={styles.contentCard}>
            <h2 style={styles.resultTitle}>
              {score >= 80 ? '🎉 Gratulálunk!' : '😔 Próbáld újra!'}
            </h2>
            
            <div style={styles.scoreDisplay}>
              <div style={styles.scorePercent}>{score.toFixed(0)}%</div>
              <div style={styles.scoreText}>
                {results.filter(r => r).length} helyes válasz {selectedQuestions.length}-ből
              </div>
            </div>

            <div style={styles.resultsContainer}>
              {selectedQuestions.map((q, index) => (
                <div 
                  key={index} 
                  style={styles.resultCard(results[index])}
                >
                  <div style={styles.resultCardContent}>
                    {results[index] ? (
                      <CheckCircle style={{
                        ...styles.resultIcon,
                        color: COLORS.success,
                      }} />
                    ) : (
                      <XCircle style={{
                        ...styles.resultIcon,
                        color: COLORS.danger,
                      }} />
                    )}
                    <div style={styles.resultTextContainer}>
                      <div style={styles.resultQuestion}>{q.question}</div>
                      <div style={styles.userAnswerText}>
                        A te válaszod: <span style={styles.userAnswerValue}>{answers[index] || '(üres)'}</span>
                      </div>
                      {!results[index] && (
                        <div style={styles.correctAnswerText}>
                          Helyes válasz: <span style={styles.correctAnswerValue}>{q.answer}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.buttonsContainer}>
            {score >= 80 ? (
              <button
                onClick={handleFinish}
                style={styles.winButton}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.animation = 'none';
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(16, 185, 129, 0.4), 0 10px 10px -5px rgba(16, 185, 129, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.animation = 'pulse 2s infinite';
                  e.currentTarget.style.boxShadow = SHADOWS.large.shadowColor;
                }}
                onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
                onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              >
                <span style={styles.winButtonText}>
                  GYŐZELEM!
                </span>
              </button>
            ) : (
              <button
                onClick={handleRetry}
                style={styles.retryButton}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(245, 158, 11, 0.4), 0 10px 10px -5px rgba(245, 158, 11, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = SHADOWS.large.shadowColor;
                }}
                onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
                onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                Próbáld újra
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
