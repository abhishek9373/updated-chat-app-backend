import React, { useEffect, useState } from "react";

export default function Nolaptop(props) {
  const [displaynotlaptop, setdisplaynotlaptop] = useState(true);
  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isSmallScreen = window.innerWidth < 768;
    if (isMobile && isSmallScreen) {
      setdisplaynotlaptop(false);
    }
  }, []);
  return (
    <div>
      {displaynotlaptop ? (
        <props.Comp Component = {props.Child ? props.Child : ''}/>
      ) : (
        <h2>Please try to open site using screen size greater than 800px..</h2>
      )}
    </div>
  );
}
