import React from 'react'
import formatTime from '../../utils/formatVideoTime'

const TimeIndicator = ({time}:{time:number}) => {
    return (
        <span>{formatTime(time)}</span>
    )
}

export default React.memo(TimeIndicator);
