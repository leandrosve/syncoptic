import React, { FunctionComponent } from 'react'
import TogglePlayButton from './buttons/TogglePlayButton'
import Seekbar from './Seekbar'
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import { Button, IconButton } from '@material-ui/core';
import TimeIndicator from './TimeIndicator';

interface Props{
  marks?: Iterable<number>;
  isPlaying:boolean;
  togglePlay:()=>any;
  rewind:()=>any;
  forward:()=>any;
  stepBackwards:()=>any;
  duration:number;
  timeMark:number;
  seekTo:(time:number)=>any;
}
const PlaybackControls:FunctionComponent<Props> = ({marks, isPlaying, togglePlay, rewind, forward, stepBackwards, duration, timeMark, seekTo }) => {

    return (
        <div>
          <Button onClick={rewind}>-100ms</Button>
          <TogglePlayButton isLoading={false} isPlaying={isPlaying} togglePlay={togglePlay} />        
          <IconButton onClick={stepBackwards}><SkipPreviousIcon/></IconButton>
          <Button onClick={forward}>+100ms</Button>
          <Seekbar duration={duration} step={0.1} currentTime={timeMark} marks={marks} onChange={(time)=>seekTo(time)}/> 
          <TimeIndicator time={timeMark}/> 
        </div>
    )
}

export default PlaybackControls
