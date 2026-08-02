// TypeScript shapes mirroring the EXISTING LinguaFlow .NET DTOs.
// The API serializes with default ASP.NET camelCase and JsonStringEnumConverter,
// so all enums arrive as strings. These types describe the real wire format
// (verified against LinguaFlow.Application/DTO/* and the Domain enums), which in a
// couple of places differs from the task brief — see notes below and the README.

export type Role = 'User' | 'Admin';
export type PlanTier = 'Free' | 'Pro';
export type LanguageLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

// NOTE: the brief lists only Flashcard | MultipleChoice, but the Domain enum has
// more. The generator (LessonService.GetLessonExercises) currently only emits the
// first two; we still type the whole union defensively.
export type ExerciseType =
  | 'Flashcard'
  | 'MultipleChoice'
  | 'TypeAnswer'
  | 'MatchPairs'
  | 'SentenceOrder';

export type ReviewGrade = 'Again' | 'Hard' | 'Good' | 'Easy';

export interface AuthResponse {
  id: number;
  username: string;
  email: string;
  token: string;
  role: Role;
  planTier: PlanTier;
}

// GET /api/users/me — UserResponseDto (no token; carries the live streak/XP).
export interface UserProfile {
  id: number;
  username: string;
  email: string;
  role: Role;
  planTier: PlanTier;
  currentStreakDays: number;
  totalXp: number;
}

// GET /api/users/leaderboard — ranked highest XP first.
export interface LeaderboardEntry {
  rank: number;
  username: string;
  totalXp: number;
  currentStreakDays: number;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CourseResponse {
  id: number;
  title: string;
  description: string;
  languageLevel: LanguageLevel;
  lessonsCount: number;
  order: number;
}

export interface LessonResponse {
  id: number;
  title: string;
  order: number;
  courseId: number;
}

// GET /api/lessons/{id}/exercises — ExercisePlayDto.
// IMPORTANT: the field is `type` on the wire (C# property `Type`), NOT
// `exerciseType` as the brief says. We read `type` and fall back to
// `exerciseType` just in case. The correct answer is intentionally absent.
export interface ExercisePlay {
  wordId: number;
  type: ExerciseType;
  question: string;
  options: string[];
}

export interface AnswerResult {
  isCorrect: boolean;
  correctAnswer: string;
  xpEarned: number;
}

export interface SubmitAnswerRequest {
  wordId: number;
  answer: string;
}

export interface CompleteLessonRequest {
  lessonId: number;
  score: number;
  totalXp: number;
}

export interface ReviewWord {
  wordId: number;
  text: string;
  translation: string;
  exampleSentence: string;
}

export interface GradeReviewRequest {
  wordId: number;
  grade: ReviewGrade;
}

// Admin authoring DTOs (used only by the optional /admin helper page).
export interface CreateCourseRequest {
  title: string;
  description: string;
  languageLevel: LanguageLevel;
  order: number;
}

export interface CreateWordRequest {
  text: string;
  translation: string;
  partOfSpeech: string;
  exampleSentence: string;
  exampleTranslation: string;
}

export interface WordResponse extends CreateWordRequest {
  id: number;
}

export interface CreateLessonRequest {
  title: string;
  order: number;
  courseId: number;
}
