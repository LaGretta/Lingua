// Typed, one-per-endpoint functions over the existing LinguaFlow API.
// Grouped by the controller they map to. Anything the current backend does NOT
// expose is flagged in comments and handled gracefully by callers.

import { api, ApiError } from './client';
import type {
  AuthResponse,
  CompleteLessonRequest,
  CourseResponse,
  CreateCourseRequest,
  CreateLessonRequest,
  CreateWordRequest,
  ExercisePlay,
  GradeReviewRequest,
  LessonResponse,
  LoginRequest,
  RegisterRequest,
  ReviewWord,
  AnswerResult,
  SubmitAnswerRequest,
  UserProfile,
  WordResponse,
} from './types';

/* ---- Auth (public) ---- */
export const authApi = {
  register: (dto: RegisterRequest) => api.post<AuthResponse>('/api/auth/register', dto),
  login: (dto: LoginRequest) => api.post<AuthResponse>('/api/auth/login', dto),
};

/* ---- Users ---- */
export const usersApi = {
  me: () => api.get<UserProfile>('/api/users/me'),
};

/* ---- Courses ---- */
export const coursesApi = {
  list: () => api.get<CourseResponse[]>('/api/courses'),
  // NOTE: the real response is a CourseResponseDto and does NOT include its lessons,
  // despite the brief. There is also no endpoint to list a course's lessons.
  get: (id: number) => api.get<CourseResponse>(`/api/courses/${id}`),
  create: (dto: CreateCourseRequest) => api.post<CourseResponse>('/api/courses', dto),
};

/* ---- Lessons & learning ---- */
export const lessonsApi = {
  get: (id: number) => api.get<LessonResponse>(`/api/lessons/${id}`),

  // Reads `type`; older/typo shapes with `exerciseType` are normalized here.
  async exercises(id: number): Promise<ExercisePlay[]> {
    const raw = await api.get<any[]>(`/api/lessons/${id}/exercises`);
    return raw.map((e) => ({
      wordId: e.wordId,
      type: e.type ?? e.exerciseType,
      question: e.question,
      options: e.options ?? [],
    }));
  },

  checkAnswer: (dto: SubmitAnswerRequest) =>
    api.post<AnswerResult>('/api/lessons/check-answer', dto),

  // GAP: LessonService.CompleteLesson exists but is NOT mapped to a controller route,
  // so this 404s on the current backend. We attempt it and let callers treat a 404 as
  // "completion not recorded" rather than a hard failure.
  complete: (dto: CompleteLessonRequest) =>
    api.post<void>('/api/lessons/complete', dto, { silent401: false }),

  // Admin authoring helpers.
  create: (dto: CreateLessonRequest) => api.post<LessonResponse>('/api/lessons', dto),
  addWords: (lessonId: number, wordIds: number[]) =>
    api.post<void>(`/api/lessons/${lessonId}/words`, wordIds),
};

/* ---- Spaced-repetition review ---- */
export const reviewApi = {
  today: () => api.get<ReviewWord[]>('/api/review/today'),
  grade: (dto: GradeReviewRequest) => api.post<void>('/api/review/grade', dto),
};

/* ---- Words (Admin authoring) ---- */
export const wordsApi = {
  create: (dto: CreateWordRequest) => api.post<WordResponse>('/api/words', dto),
};

export { ApiError };
