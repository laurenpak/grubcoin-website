import React, { useEffect, useState } from "react";

export function RefreshImage(props) {
  const [url, setUrl] = useState(props.url);
  useEffect(() => {
    if (props.url) refresh(url);
  }, [props.url]);

  function refresh(src) {
    console.log("refreshing", src)
    if (src.substring(0, 8) === 'https://') {
      setUrl(curr => curr.substring(8));
    } else {
      setUrl(curr => 'https://' + curr);
    }
    setTimeout(() => refresh(url), 5000);
  }

  return (
    <img src={url} alt=''></img>
  )
}