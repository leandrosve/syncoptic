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

const PreviewControls:FunctionComponent<ControlsProps> = (props) => {
    return (
            <StyledPaper className="floatingControls">
              <Controls
                {...props}
                autoPlay={true}
              />
            </StyledPaper>
    )
}

export default PreviewControls
