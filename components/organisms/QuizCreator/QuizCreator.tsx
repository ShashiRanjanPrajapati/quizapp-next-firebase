"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, Upload, FileText, AlertCircle, CheckCircle2, Info } from "lucide-react";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { CATEGORIES } from "@/constants/categories";
import { DIFFICULTY_LEVELS } from "@/constants/difficulty";
import type { Difficulty } from "@/types";

const questionSchema = z.object({
  text: z.string().min(5, "Question must be at least 5 characters"),
  options: z
    .array(z.string().min(1, "Option cannot be empty"))
    .length(4, "Exactly 4 options required"),
  correctAnswer: z.number().min(0).max(3),
  explanation: z.string().optional(),
  timeLimit: z.number().min(5).max(120),
});

const quizSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  category: z.string().min(1, "Select a category"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  isPublic: z.boolean(),
  questions: z.array(questionSchema).min(1, "Add at least one question"),
});

export type QuizFormData = z.infer<typeof quizSchema>;

const headerMap: Record<string, string> = {
  text: "text",
  question: "text",
  optiona: "optionA",
  option1: "optionA",
  optionb: "optionB",
  option2: "optionB",
  optionc: "optionC",
  option3: "optionC",
  optiond: "optionD",
  option4: "optionD",
  correctanswer: "correctAnswer",
  correct: "correctAnswer",
  answer: "correctAnswer",
  explanation: "explanation",
  time: "timeLimit",
  timelimit: "timeLimit",
};

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function parseCSV(csvText: string) {
  const lines = csvText.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 2) {
    throw new Error("CSV must contain a header row and at least one question row.");
  }

  const rawHeaders = parseCSVLine(lines[0]);
  const headers = rawHeaders.map((h) => {
    const key = h.toLowerCase().replace(/[\s_-]/g, "");
    return headerMap[key] || key;
  });

  const parsedQuestions: z.infer<typeof questionSchema>[] = [];
  const errors: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const rawValues = parseCSVLine(lines[i]);
    if (rawValues.length === 1 && rawValues[0] === "") continue;

    const rowObj: Record<string, any> = {};
    headers.forEach((header, index) => {
      rowObj[header] = rawValues[index] || "";
    });

    const rowNum = i + 1;
    const text = rowObj.text || "";
    const optionA = rowObj.optionA || rowObj.a || "";
    const optionB = rowObj.optionB || rowObj.b || "";
    const optionC = rowObj.optionC || rowObj.c || "";
    const optionD = rowObj.optionD || rowObj.d || "";
    const options = [optionA, optionB, optionC, optionD];

    let correctAnswerRaw = rowObj.correctAnswer;
    let correctAnswer = 0;
    if (correctAnswerRaw !== undefined && correctAnswerRaw !== "") {
      const trimmed = correctAnswerRaw.toString().trim().toUpperCase();
      if (["A", "0", "1"].includes(trimmed)) {
        correctAnswer = 0;
      } else if (["B", "2"].includes(trimmed)) {
        correctAnswer = 1;
      } else if (["C", "3"].includes(trimmed)) {
        correctAnswer = 2;
      } else if (["D", "4"].includes(trimmed)) {
        correctAnswer = 3;
      } else {
        const parsedIdx = parseInt(trimmed, 10);
        if (!isNaN(parsedIdx)) {
          if (parsedIdx >= 1 && parsedIdx <= 4) {
            correctAnswer = parsedIdx - 1;
          } else if (parsedIdx >= 0 && parsedIdx <= 3) {
            correctAnswer = parsedIdx;
          } else {
            errors.push(`Row ${rowNum}: Correct answer '${trimmed}' out of range.`);
          }
        } else {
          errors.push(`Row ${rowNum}: Invalid correct answer '${trimmed}'.`);
        }
      }
    } else {
      errors.push(`Row ${rowNum}: Missing correct answer.`);
    }

    let timeLimit = 30;
    if (rowObj.timeLimit) {
      const parsedTime = parseInt(rowObj.timeLimit, 10);
      if (!isNaN(parsedTime)) {
        timeLimit = parsedTime;
      }
    }

    const explanation = rowObj.explanation || "";

    const question = {
      text,
      options,
      correctAnswer,
      explanation,
      timeLimit,
    };

    const validation = questionSchema.safeParse(question);
    if (!validation.success) {
      validation.error.issues.forEach((issue) => {
        errors.push(`Row ${rowNum}: ${issue.message}`);
      });
    } else {
      parsedQuestions.push(validation.data);
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }

  return parsedQuestions;
}

function parseJSON(jsonText: string) {
  let data;
  try {
    data = JSON.parse(jsonText);
  } catch (err) {
    throw new Error("Invalid JSON format. Check syntax and trailing commas.");
  }

  if (!Array.isArray(data)) {
    throw new Error("JSON upload must contain an array of question objects.");
  }

  const parsedQuestions: z.infer<typeof questionSchema>[] = [];
  const errors: string[] = [];

  data.forEach((item, index) => {
    const itemNum = index + 1;
    const text = item.text || "";
    const options = item.options;
    if (!Array.isArray(options)) {
      errors.push(`Question ${itemNum}: Options must be an array of strings.`);
      return;
    }

    if (options.length !== 4) {
      errors.push(`Question ${itemNum}: Options must contain exactly 4 items.`);
      return;
    }

    let correctAnswer = item.correctAnswer;
    if (typeof correctAnswer === "string") {
      const trimmed = correctAnswer.trim().toUpperCase();
      if (["A", "0", "1"].includes(trimmed)) correctAnswer = 0;
      else if (["B", "2"].includes(trimmed)) correctAnswer = 1;
      else if (["C", "3"].includes(trimmed)) correctAnswer = 2;
      else if (["D", "4"].includes(trimmed)) correctAnswer = 3;
      else {
        const parsedIdx = parseInt(trimmed, 10);
        if (!isNaN(parsedIdx)) {
          correctAnswer = parsedIdx >= 1 && parsedIdx <= 4 ? parsedIdx - 1 : parsedIdx;
        }
      }
    }

    const timeLimit = typeof item.timeLimit === "number" ? item.timeLimit : 30;
    const explanation = item.explanation || "";

    const question = {
      text,
      options,
      correctAnswer,
      explanation,
      timeLimit,
    };

    const validation = questionSchema.safeParse(question);
    if (!validation.success) {
      validation.error.issues.forEach((issue) => {
        errors.push(`Question ${itemNum}: ${issue.message}`);
      });
    } else {
      parsedQuestions.push(validation.data);
    }
  });

  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }

  return parsedQuestions;
}

interface QuizCreatorProps {
  onSubmit: (data: QuizFormData) => Promise<void>;
  loading?: boolean;
}

export function QuizCreator({ onSubmit, loading = false }: QuizCreatorProps) {
  const [step, setStep] = useState(0);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [uploadText, setUploadText] = useState("");
  const [uploadMode, setUploadMode] = useState<"append" | "replace">("append");
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState("");
  const [showExamples, setShowExamples] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<QuizFormData>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: "",
      category: "",
      difficulty: "easy",
      isPublic: true,
      questions: [
        {
          text: "",
          options: ["", "", "", ""],
          correctAnswer: 0,
          explanation: "",
          timeLimit: 30,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const difficulty = watch("difficulty");

  const steps = ["Quiz Details", "Questions", "Review"];

  const handleFile = (file: File) => {
    setUploadErrors([]);
    setUploadSuccessMsg("");
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setUploadText(text);
    };
    reader.onerror = () => {
      setUploadErrors(["Failed to read file."]);
    };
    reader.readAsText(file);
  };

  const handleBulkUploadAction = () => {
    setUploadErrors([]);
    setUploadSuccessMsg("");

    const text = uploadText.trim();
    if (!text) {
      setUploadErrors(["Upload text is empty."]);
      return;
    }

    try {
      let parsed: any[] = [];
      if (text.startsWith("[")) {
        parsed = parseJSON(text);
      } else {
        parsed = parseCSV(text);
      }

      if (parsed.length === 0) {
        throw new Error("No valid questions found in the upload.");
      }

      const existingQuestions = watch("questions") || [];
      if (uploadMode === "replace") {
        setValue("questions", parsed);
        setUploadSuccessMsg(`Successfully replaced all questions with ${parsed.length} imported questions.`);
      } else {
        setValue("questions", [...existingQuestions, ...parsed]);
        setUploadSuccessMsg(`Successfully appended ${parsed.length} questions. Total questions: ${existingQuestions.length + parsed.length}`);
      }
      setUploadText("");
    } catch (err) {
      const msg = (err as Error).message;
      setUploadErrors(msg.split("\n"));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="flex gap-2">
        {steps.map((label, index) => (
          <Badge
            key={label}
            variant={step === index ? "info" : "category"}
            className="cursor-pointer px-3 py-1"
            onClick={() => setStep(index)}
          >
            {index + 1}. {label}
          </Badge>
        ))}
      </div>

      {step === 0 && (
        <div className="space-y-4">
          <Input
            label="Quiz Title"
            placeholder="My Awesome Quiz"
            error={errors.title?.message}
            {...register("title")}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Category</label>
            <select
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
              {...register("category")}
            >
              <option value="">Select category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-sm text-destructive">
                {errors.category.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Difficulty</label>
            <div className="flex gap-2">
              {DIFFICULTY_LEVELS.map((level) => (
                <Button
                  key={level.value}
                  type="button"
                  variant={
                    difficulty === level.value ? "primary" : "secondary"
                  }
                  size="sm"
                  onClick={() =>
                    setValue("difficulty", level.value as Difficulty)
                  }
                >
                  {level.label}
                </Button>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("isPublic")} />
            Make quiz public
          </label>
          <Button type="button" onClick={() => setStep(1)}>
            Next: Add Questions
          </Button>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-6">
          {/* Bulk Upload Section */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Upload className="size-5 text-primary" />
                  Bulk Upload Questions
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Import multiple questions at once using a CSV or JSON file.
                </p>
              </div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  setShowBulkUpload(!showBulkUpload);
                  setUploadErrors([]);
                  setUploadSuccessMsg("");
                }}
              >
                {showBulkUpload ? "Hide Upload Panel" : "Open Upload Panel"}
              </Button>
            </div>

            {showBulkUpload && (
              <div className="mt-6 space-y-4 border-t border-border pt-4 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Upload Mode</label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={uploadMode === "append" ? "primary" : "secondary"}
                        size="sm"
                        className="flex-1"
                        onClick={() => setUploadMode("append")}
                      >
                        Append to existing
                      </Button>
                      <Button
                        type="button"
                        variant={uploadMode === "replace" ? "primary" : "secondary"}
                        size="sm"
                        className="flex-1"
                        onClick={() => setUploadMode("replace")}
                      >
                        Replace all questions
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Format Guidelines</label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-primary"
                      onClick={() => setShowExamples(!showExamples)}
                    >
                      <FileText className="size-4 mr-2" />
                      {showExamples ? "Hide Format Templates" : "Show Format Templates"}
                    </Button>
                  </div>
                </div>

                {showExamples && (
                  <div className="rounded-lg bg-muted p-4 text-xs space-y-3 font-mono overflow-auto max-h-60 border border-border animate-in fade-in duration-200">
                    <div>
                      <p className="font-bold text-foreground mb-1 text-[11px] uppercase tracking-wider">// CSV Format Template (First line must be header)</p>
                      <pre className="p-2 bg-background rounded border border-border select-all">
{`text,optionA,optionB,optionC,optionD,correctAnswer,explanation,timeLimit
"What is 2 + 2?","3","4","5","6","B","Simple addition",15
"Which planet is closest to the Sun?","Venus","Earth","Mercury","Mars","C","Mercury is closest",30`}
                      </pre>
                      <p className="mt-1 text-muted-foreground text-[10px]">
                        * correctAnswer can be: A-D, 1-4, or 0-3. timeLimit defaults to 30.
                      </p>
                    </div>
                    <div>
                      <p className="font-bold text-foreground mb-1 text-[11px] uppercase tracking-wider">// JSON Format Template</p>
                      <pre className="p-2 bg-background rounded border border-border select-all">
{`[
  {
    "text": "What is 2 + 2?",
    "options": ["3", "4", "5", "6"],
    "correctAnswer": 1,
    "explanation": "Simple addition",
    "timeLimit": 15
  }
]`}
                      </pre>
                    </div>
                  </div>
                )}

                <div
                  className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-muted/30 hover:bg-muted/50 cursor-pointer transition-all flex flex-col items-center justify-center space-y-2 relative"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleFile(file);
                  }}
                >
                  <Upload className="size-8 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">Drag & Drop a CSV or JSON file here</p>
                  <p className="text-xs text-muted-foreground">or click below to browse</p>
                  <input
                    type="file"
                    accept=".csv,.json"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFile(file);
                    }}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium flex justify-between">
                    <span>Or paste raw CSV / JSON text below:</span>
                    {uploadText && (
                      <button
                        type="button"
                        className="text-xs text-destructive hover:underline"
                        onClick={() => setUploadText("")}
                      >
                        Clear
                      </button>
                    )}
                  </label>
                  <textarea
                    className="w-full h-32 p-3 text-sm font-mono rounded-lg border border-input bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder={`Paste CSV content starting with header or JSON array...`}
                    value={uploadText}
                    onChange={(e) => setUploadText(e.target.value)}
                  />
                </div>

                {uploadErrors.length > 0 && (
                  <div className="rounded-lg bg-destructive/10 p-4 border border-destructive/20 text-sm text-destructive space-y-1 max-h-48 overflow-y-auto">
                    <div className="flex items-center gap-2 font-semibold mb-1">
                      <AlertCircle className="size-4 shrink-0" />
                      <span>Failed to parse questions:</span>
                    </div>
                    {uploadErrors.map((err, idx) => (
                      <p key={idx} className="font-mono text-xs pl-6 list-item list-inside">
                        {err}
                      </p>
                    ))}
                  </div>
                )}

                {uploadSuccessMsg && (
                  <div className="rounded-lg bg-emerald-500/10 p-4 border border-emerald-500/20 text-sm text-emerald-600 dark:text-emerald-400 flex items-start gap-2">
                    <CheckCircle2 className="size-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Success!</p>
                      <p className="text-xs">{uploadSuccessMsg}</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setUploadText("");
                      setUploadErrors([]);
                      setUploadSuccessMsg("");
                    }}
                  >
                    Reset
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    disabled={!uploadText.trim()}
                    onClick={handleBulkUploadAction}
                  >
                    Parse & Import
                  </Button>
                </div>
              </div>
            )}
          </div>

          {fields.map((field, qIndex) => (
            <div
              key={field.id}
              className="space-y-4 rounded-xl border border-border p-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Question {qIndex + 1}</h3>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(qIndex)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                )}
              </div>
              <Input
                label="Question Text"
                error={errors.questions?.[qIndex]?.text?.message}
                {...register(`questions.${qIndex}.text`)}
              />
              {[0, 1, 2, 3].map((optIndex) => (
                <Input
                  key={optIndex}
                  label={`Option ${String.fromCharCode(65 + optIndex)}`}
                  error={
                    errors.questions?.[qIndex]?.options?.[optIndex]?.message
                  }
                  {...register(`questions.${qIndex}.options.${optIndex}`)}
                />
              ))}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Correct Answer</label>
                <select
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                  {...register(`questions.${qIndex}.correctAnswer`, {
                    valueAsNumber: true,
                  })}
                >
                  {[0, 1, 2, 3].map((i) => (
                    <option key={i} value={i}>
                      Option {String.fromCharCode(65 + i)}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                label="Explanation (optional)"
                {...register(`questions.${qIndex}.explanation`)}
              />
              <Input
                label="Time Limit (seconds)"
                type="number"
                error={errors.questions?.[qIndex]?.timeLimit?.message}
                {...register(`questions.${qIndex}.timeLimit`, {
                  valueAsNumber: true,
                })}
              />
            </div>
          ))}
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              append({
                text: "",
                options: ["", "", "", ""],
                correctAnswer: 0,
                explanation: "",
                timeLimit: 30,
              })
            }
          >
            <Plus className="size-4" />
            Add Question
          </Button>
          <div className="flex gap-3">
            <Button type="button" variant="secondary" onClick={() => setStep(0)}>
              Back
            </Button>
            <Button type="button" onClick={() => setStep(2)}>
              Review
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="rounded-xl bg-muted p-4">
            <h3 className="text-lg font-semibold">{watch("title")}</h3>
            <div className="mt-2 flex gap-2">
              <Badge variant="category">{watch("category")}</Badge>
              <Badge variant="warning">{watch("difficulty")}</Badge>
              <Badge variant="info">
                {fields.length} question{fields.length !== 1 ? "s" : ""}
              </Badge>
            </div>
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="secondary" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button type="submit" loading={loading}>
              Publish Quiz
            </Button>
          </div>
        </div>
      )}
    </form>
  );
}
