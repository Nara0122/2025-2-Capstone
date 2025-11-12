const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// .env 파일에서 API 키 로드
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// DB 모델 가져오기 (가정)
const Evento = require('../models/Evento');

router.post('/ask', async (req, res) => {
    try {
        const userQuestion = req.body.question;
        const userId = req.uid; // (JWT 미들웨어 등에서 가져온 사용자 ID라고 가정)

        // 1. DB에서 사용자 일정 데이터 조회
        // (날짜가 너무 많으면 최근 3~6개월치만 가져오는 것이 좋습니다)
        const userEvents = await Evento.find({ user: userId });

        // 2. Gemini API에 보낼 프롬프트 구성
        //    이 부분이 AI 성능의 핵심입니다! (Prompt Engineering)
        const prompt = `
            당신은 사용자의 캘린더 일정을 분석해주는 AI 비서입니다.

            [사용자 일정 데이터 (JSON 형식)]:
            ${JSON.stringify(userEvents)}

            [사용자의 질문]:
            ${userQuestion}

            위 일정 데이터를 바탕으로 사용자의 질문에 친절하게 답변해주세요.
            "바쁘다"의 기준은 "일정이 등록된 총 시간"으로 계산해주세요.
        `;

        // 3. Gemini API 호출
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // 4. React로 답변 전송
        res.json({ answer: text });

    } catch (error) {
        console.error("AI 응답 생성 중 오류:", error);
        res.status(500).json({ error: "AI 응답에 실패했습니다." });
    }
});

module.exports = router;