import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios'; // npm install axios
import './AiFab.css'; // 스타일 파일

export const AiFab = () => {

    const [isOpen, setIsOpen] = useState(false); // 창 열림/닫힘 상태
    const [question, setQuestion] = useState(''); // 사용자의 질문
    const [answer, setAnswer] = useState(''); // AI의 답변
    const [isLoading, setIsLoading] = useState(false); // 로딩 중인지 확인
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [answer, isLoading, isOpen]);

    // 창 열고 닫기
    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    // 질문 전송 함수
    const handleAsk = async () => {
        if (!question.trim()) return;

        setIsLoading(true);
        setAnswer(''); // 기존 답변 초기화

        try {
            const token = localStorage.getItem('token'); // ★ 저장된 토큰 가져오기

            // 백엔드 API 호출
            const resp = await axios.post('http://localhost:4000/api/ai/ask', 
                { question },
                {
                    headers: {
                        'x-token': token // 헤더에 토큰 실어 보내기
                    }
                }
            );

            setAnswer(resp.data.answer);

        } catch (error) {
            console.error(error);
            setAnswer('죄송해요, AI 연결에 실패했어요.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* 1. 대화창 (isOpen이 true일 때만 보임) */}
            {isOpen && (
                <div className="ai-chat-window">
                    <div className="ai-header">
                        <span>🤖 AI 일정 비서</span>
                        <button onClick={toggleChat} className="close-btn">X</button>
                    </div>
                    
                    <div className="ai-body">
                        {/* 답변이 나오는 곳 */}
                        <div className="ai-response-area">
                            {answer ? (
                                <p className="ai-msg">{answer}</p>
                            ) : (
                                <p className="placeholder">궁금한 점을 물어보세요!<br/>예: 내가 가장 바쁜 요일이 언제야?</p>
                            )}
                            {isLoading && <p className="loading">AI가 생각 중입니다... ⏳</p>}
                            
                            <div ref={messagesEndRef} />
                        </div>

                        {/* 질문 입력하는 곳 */}
                        <div className="ai-input-area">
                            <input 
                                type="text" 
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
                                placeholder="질문을 입력하세요..."
                            />
                            <button onClick={handleAsk} disabled={isLoading}>
                                전송
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. 둥둥 떠있는 🤖 버튼 */}
            <button className="btn btn-primary ai-fab" onClick={toggleChat}>
                🤖
            </button>
        </>
    );
};