import { NextResponse } from "next/server";

export async function GET() {
  const API_KEY = process.env.API_KEY;
  const LIMIT = 30;
  const ACTIVE = true;
  const response = await fetch(
    `https://api.crackeddevs.com/v1/get-jobs?limit=${LIMIT}&active=${ACTIVE}`,
    {
      headers: {
        "api-key": `${API_KEY}`,
      },
    }
  );
  const data = await response.json();
  console.log(data);
  return NextResponse.json(data);
}
