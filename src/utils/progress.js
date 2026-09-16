const KEY = "spanish_progress";

const defaultProgress = { completedLessons: [] };

export function getProgress() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || defaultProgress;
  } catch {
    return defaultProgress;
  }
}

export function markLessonComplete(lessonId) {
  const p = getProgress();
  if (!p.completedLessons.includes(lessonId)) {
    p.completedLessons.push(lessonId);
    localStorage.setItem(KEY, JSON.stringify(p));
  }
}
