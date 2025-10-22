import React from 'react'
import { addHours } from 'date-fns';
import { useCalendarStore, useUiStore } from '../../hooks';
export const FabAddNew = () => {


  const { openDateModal } = useUiStore();
    const { setActiveEvent } = useCalendarStore();

    const handleClickNew = () => {
        setActiveEvent({
            title: '할 일을 입력하세요',
            notes: '메모를 입력하세요',
            start: new Date(),
            end: addHours( new Date(), 2 ),
            bgColor: '#fafafa',
            user: {
                _id: '123',
                name: 'Fernando'
            }
        });
        openDateModal();
    }
  return (
    <button
        className="btn btn-primary fab"
       onClick={ handleClickNew }
    >
      <i className="fas fa-plus" ></i>

    
    </button>

  )
}
