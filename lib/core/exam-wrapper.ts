// lib/core/exam-wrapper.ts

import { ExamMeta } from "./exam-meta"

export interface ExamWrapper<TData> {
    meta: ExamMeta
    data: TData
}
