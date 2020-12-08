import { Paper, withStyles } from '@material-ui/core'
import React, { FunctionComponent } from 'react'
import Controls, { ControlsProps } from '../controls/Controls'


const StyledPaper = withStyles(({ palette }) => ({
    root: {
      //for transparency
      backgroundColor: palette.background.default,
      marginTop:"20px"
    },
  }))(Paper);

const PreviewControls:FunctionComponent<ControlsProps> = ({reactionPlayer, originalPlayer, syncMap}) => {
    return (
            <StyledPaper className="floatingControls">
              <Controls
                reactionPlayer={reactionPlayer}
                originalPlayer={originalPlayer}
                syncMap={syncMap}
                autoPlay={true}
              />
            </StyledPaper>
    )
}

export default PreviewControls
