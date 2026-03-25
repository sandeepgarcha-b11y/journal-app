import { NextResponse } from "next/server";
import { createEntryRecord } from "@/lib/entries";

interface CreateJournalRequest {
  title?: unknown;
  body?: unknown;
  date?: unknown;
}

function getBearerToken(header: string | null): string | null {
  if (!header) return null;
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) return null;
  return token;
}

function isValidDateString(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export async function POST(request: Request) {
  const expectedToken = process.env.JOURNAL_API_BEARER_TOKEN;
  if (!expectedToken) {
    return NextResponse.json(
      { error: "Server misconfiguration: JOURNAL_API_BEARER_TOKEN is not set." },
      { status: 500 },
    );
  }

  const token = getBearerToken(request.headers.get("authorization"));
  if (token !== expectedToken) {
    return NextResponse.json(
      { error: "Unauthorized. Provide a valid Bearer token." },
      { status: 401 },
    );
  }

  let payload: CreateJournalRequest;
  try {
    payload = (await request.json()) as CreateJournalRequest;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON request body." },
      { status: 400 },
    );
  }

  const title = typeof payload.title === "string" ? payload.title.trim() : "";
  const body = typeof payload.body === "string" ? payload.body.trim() : "";
  const date =
    payload.date === undefined
      ? undefined
      : typeof payload.date === "string"
        ? payload.date.trim()
        : null;

  if (!title) {
    return NextResponse.json(
      { error: "Validation failed: title is required." },
      { status: 400 },
    );
  }

  if (!body) {
    return NextResponse.json(
      { error: "Validation failed: body is required." },
      { status: 400 },
    );
  }

  if (date !== undefined && (date === null || !isValidDateString(date))) {
    return NextResponse.json(
      { error: "Validation failed: date must be YYYY-MM-DD." },
      { status: 400 },
    );
  }

  try {
    const entry = await createEntryRecord({
      body,
      date,
      title,
    });

    return NextResponse.json(
      {
        id: entry.id,
        date: entry.date.toISOString(),
        type: entry.type,
        content: entry.content,
        prompts: entry.prompts,
        createdAt: entry.createdAt.toISOString(),
        updatedAt: entry.updatedAt.toISOString(),
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to create journal entry." },
      { status: 500 },
    );
  }
}
