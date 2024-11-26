export class AvailableLessonOutputModel {
  id: number;
  name: string;
  code: string;
}

export class LessonOutputModel {
  id: string;
  name: string;
  code: string;
}

export class ActiveLesson {
  id: number;
  lessonId: number;
  userId: number;
  evaluationId: number | null;
}
