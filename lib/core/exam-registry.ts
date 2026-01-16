import { buildReadingExam } from '../exams/reading'
import { buildListeningExam } from '../exams/listening'
import { buildWritingExam } from '../exams/writing'

export const examRegistry = {
  reading: buildReadingExam,
  listening: buildListeningExam,
  writing: buildWritingExam,
}
