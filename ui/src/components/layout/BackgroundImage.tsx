import React, { FunctionComponent } from "react";

interface Props {
  src: string;
}

const BackgroundImage: FunctionComponent<Props> = ({ src }) => {
  return (
    <div
      className="background"
      style={{ backgroundImage: `url(${src})` }}
    ></div>
  );
};

export default BackgroundImage;
