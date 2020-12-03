import React from 'react'
import TogglePlayButton from './buttons/TogglePlayButton'
import Seekbar from './Seekbar'
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import { IconButton } from '@material-ui/core';

const PlaybackControls = () => {
    return (
        <div>
          <TogglePlayButton isLoading={false} isPlaying={false} togglePlay={()=>{}} />
          <IconButton><SkipPreviousIcon/></IconButton>
          <Seekbar duration={100} step={0.1} currentTime={0} onChange={()=>{}}/>  
        </div>
    )
}

export default PlaybackControls
