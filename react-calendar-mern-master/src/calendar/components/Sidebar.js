// src/components/Sidebar.js

import React from 'react';
// import './Sidebar.css'; // CSS 파일 불러오기 (필요 시)

const Sidebar = ({ calendars, onToggleCalendar }) => {
    // 예시 데이터: 실제로는 상위 컴포넌트에서 calendars prop으로 받아야 함
    const defaultCalendars = [
        { id: 1, name: '기본 캘린더', active: true, color: '#1DB25A' },
        { id: 2, name: '개인 일정', active: false, color: '#FF7F50' },
        { id: 3, name: '회사 업무', active: true, color: '#4682B4' },
    ];
    const displayCalendars = calendars || defaultCalendars; // prop이 없으면 예시 데이터 사용

    return (
        <aside className="sidebar">
            <h2>🗓️ 내 달력</h2>
            <ul className="calendar-list">
                {displayCalendars.map((calendar) => (
                    <li key={calendar.id}>
                        <input
                            type="checkbox"
                            id={`cal-${calendar.id}`}
                            defaultChecked={calendar.active}
                            // 달력 활성화/비활성화 로직 처리
                            onChange={() => onToggleCalendar(calendar.id)} 
                        />
                        <label 
                            htmlFor={`cal-${calendar.id}`} 
                            className="calendar-name"
                            style={{ color: calendar.active ? '#333' : '#aaa' }} 
                        >
                            {calendar.name}
                        </label>
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default Sidebar;