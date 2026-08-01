import { ApiError } from '../api/client';
import { coursesApi, lessonsApi } from '../api/endpoints';
import type { LessonResponse } from '../api/types';

// Interim lesson discovery.
//
// The API has no "list a course's lessons" endpoint (see README → Known API gaps),
// but GET /api/lessons/{id} returns the lesson including its `courseId`. So we probe
// lesson ids and group them by course. This is the honest workaround the user asked
// for ("use whatever lesson data the API currently exposes in the meantime") — it
// lets the UI show a real, tappable lesson list instead of asking for a numeric id.
//
// Once the backend exposes the lessons of a course, this file can be deleted and the
// caller pointed at that endpoint.

export interface CourseLesson extends LessonResponse {
  hasWords: boolean;
}

const PROBE_CAP = 80; // safety bound on how far we probe if counts don't add up
const BATCH = 10; // concurrent probes per wave

// Session cache of the discovered id -> lesson map (each lesson carries its courseId).
let cache: Promise<LessonResponse[]> | null = null;

/** Clear the cache so the next lookup re-probes (e.g. after admin authoring). */
export function invalidateLessonsCache() {
  cache = null;
}

async function probeLesson(id: number): Promise<LessonResponse | null> {
  try {
    return await lessonsApi.get(id);
  } catch (e) {
    // A missing id (404) is expected while probing; treat any failure as "absent".
    if (e instanceof ApiError) return null;
    return null;
  }
}

async function discoverAll(): Promise<LessonResponse[]> {
  // The sum of lessonsCount across courses tells us how many lessons exist, so we can
  // stop probing as soon as we've found them all (the common, dense-id case).
  const courses = await coursesApi.list();
  const expected = courses.reduce((n, c) => n + (c.lessonsCount || 0), 0);

  const found: LessonResponse[] = [];
  for (let start = 1; start <= PROBE_CAP; start += BATCH) {
    const ids: number[] = [];
    for (let i = start; i < start + BATCH && i <= PROBE_CAP; i++) ids.push(i);
    const wave = await Promise.all(ids.map(probeLesson));
    for (const lesson of wave) if (lesson) found.push(lesson);
    if (expected > 0 && found.length >= expected) break;
  }
  return found;
}

/** All discovered lessons (cached for the session). */
export function getAllLessons(): Promise<LessonResponse[]> {
  if (!cache) {
    cache = discoverAll().catch((e) => {
      cache = null; // don't cache failures
      throw e;
    });
  }
  return cache;
}

/**
 * Lessons belonging to one course, sorted by order, each tagged with whether it has
 * any words/exercises. Content is detected via the exercises endpoint (409 => empty).
 */
export async function getCourseLessons(courseId: number): Promise<CourseLesson[]> {
  const all = await getAllLessons();
  const mine = all
    .filter((l) => l.courseId === courseId)
    .sort((a, b) => a.order - b.order || a.id - b.id);

  return Promise.all(
    mine.map(async (lesson) => {
      try {
        const exercises = await lessonsApi.exercises(lesson.id);
        return { ...lesson, hasWords: exercises.length > 0 };
      } catch {
        // 409 "Lesson has no words" (or anything else) => treat as empty.
        return { ...lesson, hasWords: false };
      }
    }),
  );
}
