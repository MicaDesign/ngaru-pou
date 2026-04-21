import "server-only";

const BASE_ID = "appZBCAC2qH9bFOaG";

const TABLES = {
  levels: "tbltrJGgs5RvZ552v",
  lessons: "tblX7NElxtfGi9O4F",
  schedule: "tbli6ErkVxCQzmxj8",
  videos: "tbluk5AFITvkim2DS",
  reflectionPrompts: "tbla4etpK0iy11Asa",
} as const;

type AirtableRecord = {
  id: string;
  fields: Record<string, unknown>;
};

export type Attachment = {
  url: string;
  filename?: string;
  width?: number;
  height?: number;
};

export type Level = {
  id: string;
  name: string;
  slug: string;
  order?: number;
  ageRange: string;
  objectives: string;
  keyFeatures: string;
  keyVocabulary: string;
  glossary: string;
  matrixRow: string;
  pepehGuideUrl: string;
  codeOfConductUrl: string;
  uniformPolicyUrl: string;
  handyHintsUrl: string;
  thumbnail?: Attachment[];
  lessonIds: string[];
};

export type ScheduleRow = {
  id: string;
  timeSlot: string;
  order: number;
  activity: string;
};

export type Video = {
  id: string;
  title: string;
  vimeoUrl: string;
  order: number;
  durationSeconds: number;
};

export type LessonBasic = {
  id: string;
  title: string;
  weekNumber: number;
  bracketBeingTaught: string;
  warmUp: string;
  objectives: string;
  keyFeatures: string;
  keyVocabulary: string;
  teacherNotes: string;
  lyricsDownloadUrl: string;
  isPublished: boolean;
};

export type Lesson = {
  id: string;
  title: string;
  weekNumber: number;
  bracketBeingTaught: string;
  warmUp: string;
  objectives: string;
  keyFeatures: string;
  keyVocabulary: string;
  teacherNotes: string;
  lyricsDownloadUrl: string;
  isPublished: boolean;
  schedule: ScheduleRow[];
  videos: Video[];
};

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}
function num(v: unknown): number {
  return typeof v === "number" ? v : 0;
}
function bool(v: unknown): boolean {
  return v === true;
}
function ids(v: unknown): string[] {
  return Array.isArray(v) ? (v as string[]) : [];
}

function attachments(v: unknown): Attachment[] | undefined {
  if (!Array.isArray(v)) return undefined;
  const result: Attachment[] = [];
  for (const item of v) {
    if (
      item &&
      typeof item === "object" &&
      typeof (item as { url?: unknown }).url === "string"
    ) {
      const a = item as Record<string, unknown>;
      result.push({
        url: a.url as string,
        filename: typeof a.filename === "string" ? a.filename : undefined,
        width: typeof a.width === "number" ? a.width : undefined,
        height: typeof a.height === "number" ? a.height : undefined,
      });
    }
  }
  return result.length ? result : undefined;
}

async function fetchRecords(
  tableId: string,
  params: Record<string, string> = {},
): Promise<AirtableRecord[]> {
  const token = process.env.AIRTABLE_TOKEN;
  if (!token) throw new Error("AIRTABLE_TOKEN not set");

  const url = new URL(`https://api.airtable.com/v0/${BASE_ID}/${tableId}`);

  for (const [k, v] of Object.entries(params)) {
    if (k === "sort") {
      const sortItems = JSON.parse(v) as { field: string; direction: string }[];
      sortItems.forEach((item, i) => {
        url.searchParams.set(`sort[${i}][field]`, item.field);
        url.searchParams.set(`sort[${i}][direction]`, item.direction);
      });
    } else {
      url.searchParams.set(k, v);
    }
  }

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`Airtable ${res.status}: ${res.statusText}`);
  }

  const data = (await res.json()) as { records: AirtableRecord[] };
  return data.records;
}

// Batches OR(RECORD_ID()=...) queries so the formula stays under Airtable's URL limit.
async function fetchByIds(
  tableId: string,
  recordIds: string[],
): Promise<AirtableRecord[]> {
  if (!recordIds.length) return [];
  const BATCH = 25;
  const batches: string[][] = [];
  for (let i = 0; i < recordIds.length; i += BATCH) {
    batches.push(recordIds.slice(i, i + BATCH));
  }
  const results = await Promise.all(
    batches.map((batch) => {
      const formula = `OR(${batch.map((id) => `RECORD_ID()="${id}"`).join(",")})`;
      return fetchRecords(tableId, { filterByFormula: formula });
    }),
  );
  return results.flat();
}

function parseLevel(r: AirtableRecord): Level {
  const f = r.fields;
  return {
    id: r.id,
    name: str(f["Name"]),
    slug: str(f["Slug"]),
    order: typeof f["Order"] === "number" ? (f["Order"] as number) : undefined,
    ageRange: str(f["Age Range"]),
    objectives: str(f["Objectives"]),
    keyFeatures: str(f["Key Features"]),
    keyVocabulary: str(f["Key Vocabulary"]),
    glossary: str(f["Glossary"]),
    matrixRow: str(f["Matrix Row"]),
    pepehGuideUrl: str(f["Pepeha Guide URL"]),
    codeOfConductUrl: str(f["Code of Conduct URL"]),
    uniformPolicyUrl: str(f["Uniform Policy URL"]),
    handyHintsUrl: str(f["Handy Hints URL"]),
    // Thumbnail field — fldjESykB6IjuO4Pb (multipleAttachments)
    thumbnail: attachments(f["Thumbnail"]),
    lessonIds: ids(f["Lessons"]),
  };
}

function parseLessonBase(r: AirtableRecord): Omit<Lesson, "schedule" | "videos"> {
  const f = r.fields;
  return {
    id: r.id,
    title: str(f["Title"]),
    weekNumber: num(f["Week Number"]),
    bracketBeingTaught: str(f["Bracket Being Taught"]),
    warmUp: str(f["Warm Up"]),
    objectives: str(f["Objectives"]),
    keyFeatures: str(f["Key Features"]),
    keyVocabulary: str(f["Key Vocabulary"]),
    teacherNotes: str(f["Teacher Notes"]),
    lyricsDownloadUrl: str(f["Lyrics Download URL"]),
    isPublished: bool(f["Is Published"]),
  };
}

function parseScheduleRow(r: AirtableRecord): ScheduleRow {
  return {
    id: r.id,
    timeSlot: str(r.fields["Time Slot"]),
    order: num(r.fields["Order"]),
    activity: str(r.fields["Activity"]),
  };
}

function parseVideo(r: AirtableRecord): Video {
  return {
    id: r.id,
    title: str(r.fields["Title"]),
    vimeoUrl: str(r.fields["Vimeo URL"]),
    order: num(r.fields["Order"]),
    durationSeconds: num(r.fields["Duration Seconds"]),
  };
}

export async function getLevels(): Promise<Level[]> {
  const records = await fetchRecords(TABLES.levels, {
    sort: JSON.stringify([{ field: "Order", direction: "asc" }]),
  });
  return records.map(parseLevel);
}

export async function getLevelBySlug(slug: string): Promise<Level | null> {
  const escaped = slug.replace(/"/g, '\\"');
  const records = await fetchRecords(TABLES.levels, {
    filterByFormula: `{Slug} = "${escaped}"`,
    maxRecords: "1",
  });
  return records.length ? parseLevel(records[0]) : null;
}

export async function getLessonsBasic(level: Level): Promise<LessonBasic[]> {
  if (!level.lessonIds.length) return [];
  const records = await fetchByIds(TABLES.lessons, level.lessonIds);
  return records
    .map(parseLessonBase)
    .sort((a, b) => a.weekNumber - b.weekNumber);
}

export async function getLessonsForLevel(level: Level): Promise<Lesson[]> {
  if (!level.lessonIds.length) return [];

  const lessonRecords = await fetchByIds(TABLES.lessons, level.lessonIds);

  const allScheduleIds = lessonRecords.flatMap((r) =>
    ids(r.fields["Lesson Schedule"]),
  );
  const allVideoIds = lessonRecords.flatMap((r) => ids(r.fields["Videos"]));

  const [scheduleRecords, videoRecords] = await Promise.all([
    fetchByIds(TABLES.schedule, allScheduleIds),
    fetchByIds(TABLES.videos, allVideoIds),
  ]);

  const scheduleByLesson = new Map<string, ScheduleRow[]>();
  for (const r of scheduleRecords) {
    const lessonId = ids(r.fields["Lesson"])[0];
    if (!lessonId) continue;
    const arr = scheduleByLesson.get(lessonId) ?? [];
    arr.push(parseScheduleRow(r));
    scheduleByLesson.set(lessonId, arr);
  }

  const videosByLesson = new Map<string, Video[]>();
  for (const r of videoRecords) {
    const lessonId = ids(r.fields["Lesson"])[0];
    if (!lessonId) continue;
    const arr = videosByLesson.get(lessonId) ?? [];
    arr.push(parseVideo(r));
    videosByLesson.set(lessonId, arr);
  }

  return lessonRecords
    .map((r) => ({
      ...parseLessonBase(r),
      schedule: (scheduleByLesson.get(r.id) ?? []).sort(
        (a, b) => a.order - b.order,
      ),
      videos: (videosByLesson.get(r.id) ?? []).sort(
        (a, b) => a.order - b.order,
      ),
    }))
    .sort((a, b) => a.weekNumber - b.weekNumber);
}

export async function getLessonByWeek(
  level: Level,
  week: number,
): Promise<Lesson | null> {
  const lessons = await getLessonsForLevel(level);
  return lessons.find((l) => l.weekNumber === week) ?? null;
}
