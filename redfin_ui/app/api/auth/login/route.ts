import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// 임시 사용자 데이터베이스 (실제로는 데이터베이스를 사용해야 함)
const users: Array<{ id: number; email: string; name: string; password: string }> = [];

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // 입력 검증
    if (!email || !password) {
      return NextResponse.json(
        { message: "이메일과 비밀번호를 입력해주세요." },
        { status: 400 }
      );
    }

    // 사용자 찾기
    const user = users.find(u => u.email === email);
    if (!user) {
      return NextResponse.json(
        { message: "이메일 또는 비밀번호가 올바르지 않습니다." },
        { status: 401 }
      );
    }

    // 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "이메일 또는 비밀번호가 올바르지 않습니다." },
        { status: 401 }
      );
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 응답에서 비밀번호 제외
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      message: "로그인이 완료되었습니다.",
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
