import React from 'react';
import Header from './components/Header'; // 헤더 컴포넌트 가정
import Sidebar from './components/Sidebar';
import CalendarComponent from './components/CalendarComponent'; // 실제 캘린더 컴포넌트 경로로 수정
import './App.css'; 

function App() {

  return (
    <div className="app-layout-wrapper">
      <header className="app-header">
         {/* 'nara' 로고와 '로그아웃' 버튼 등 헤더 내용 */}
         <div className="header-content">
             <h1>nara</h1>
             <button>로그아웃</button>
         </div>
      </header>
      <div className="main-container">
          <Sidebar 
              // calendars={myCalendarData} 
              // onToggleCalendar={handleToggleCalendar}
          />
          
          <main className="calendar-view">
              <CalendarComponent />
          </main>
      </div>
    </div>
  )
}

export default App
