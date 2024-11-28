import bcrypt from "bcrypt";
import db from "@repo/db/client";
import { z } from "zod";
import { NextResponse } from "next/server";

const signUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(10, "Phone number must be at least 10 characters").max(15, "Phone number is too long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedBody = signUpSchema.parse(body); 
    const { name, phone, email, password } = parsedBody;

    const existingUser = await db.user.findFirst({
      where: { OR: [{ number: phone }, { email }] },
    });

    if (existingUser) {
      return NextResponse.json({ error: "User with this phone or email already exists." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.create({
      data: {
        name,
        number: phone,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ message: "User created successfully" }, { status: 200 });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0]?.message || "Invalid input." }, { status: 400 });
    }

    console.error(err);
    return NextResponse.json({ error: "An error occurred while creating the user." }, { status: 500 });
  }
}
