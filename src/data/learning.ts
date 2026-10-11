import learningJson from "./learning.json";
import type { Guide, KnowledgeEntry } from "./types";

export const guides: Guide[] = learningJson.guides;
export const karateHistory: (KnowledgeEntry & { period: string })[] = learningJson.timeline;
export const karateFacts: KnowledgeEntry[] = learningJson.facts;
export const feedbackConfig = learningJson.feedback;
