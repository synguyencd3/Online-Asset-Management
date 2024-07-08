import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Space, DatePicker } from 'antd';
import React from 'react'

interface DatePickerProps {
    handleDatePicker: (_: any, dateString: string | string[]) => void,
    placeHolderText: string,
}

export const DatePickerComponent: React.FC<DatePickerProps> = (props: DatePickerProps) => {
    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            <DatePicker
                id='returned-datepicker'
                suffixIcon={<FontAwesomeIcon icon={faCalendar} />}
                style={{ width: '100%', padding: '7.5px 15px', border: '1px solid black' }}
                placeholder={props.placeHolderText}
                onChange={props.handleDatePicker}
                size={'middle'}
                format={"YYYY-MM-DD"} />
        </Space>
    )
}
