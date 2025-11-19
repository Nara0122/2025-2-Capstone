const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { validarJWT } = require('../middlewares/validar-jwt');
const Evento = require('../models/Evento');

router.post('/ask', validarJWT, async (req, res) => {
    try {
        // 1. Gemini 설정 (성공했던 키를 여기에 넣으세요!)
        // 주의: 공백이나 한글이 들어가지 않게 조심하세요.
        const genAI = new GoogleGenerativeAI("AIzaSyC9SnEgYanLEqzXsrP5gl58Od758DMQSs8"); 

        // 2. 사용자 데이터 가져오기
        const userQuestion = req.body.question;
        const userId = req.uid; 

        // 3. DB에서 일정 조회
        const userEvents = await Evento.find({ user: userId });

        console.log(`[AI 요청] 사용자 ${userId}의 일정 ${userEvents.length}개를 분석합니다.`);

        // 4. 프롬프트 구성
        const prompt = `
            당신은 사용자의 캘린더 일정을 분석해주는 스마트한 AI 비서입니다.
            
            [사용자의 일정 데이터 (JSON)]:
            ${JSON.stringify(userEvents)}

            [사용자의 질문]:
            "${userQuestion}"

            위 일정 데이터를 분석해서 질문에 대해 답변해주세요.
            - "바쁘다"의 기준은 일정이 차지하는 '총 소요 시간'을 기준으로 계산하세요.
            - 답변은 한국어로, 친절하고 자연스럽게 해주세요.
            - 구체적인 근거(예: "화요일에 총 5시간의 일정이 있어서 가장 바쁩니다")를 들어 설명해주세요.
        `;

        // 5. 모델 선택 (찾아낸 이름 사용!)
        const model = genAI.getGenerativeModel({ model: "gemini-pro-latest" });
        
        // 6. 결과 생성
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("[AI 응답 성공]");

        // 7. 프론트엔드로 전송
        res.json({ answer: text });

    } catch (error) {
        console.error("AI 처리 중 에러 발생:", error);
        res.status(500).json({ 
            error: "AI 비서가 답변을 생성하지 못했습니다.",
            details: error.message 
        });
    }
});

module.exports = router;