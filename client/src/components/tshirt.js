import { useEffect, useRef } from "react";
import tshirt from "../tshirt1.png";
import './tshirt.css';

function TShirt(props) {
  const canvas = useRef(null);

  useEffect(() => {
    if (canvas.current && props.url !== '') {
      draw(canvas.current.getContext("2d"), props.url);
    }
  }, [canvas, props.url]);

  async function draw(ctx, url) {
    ctx.fillStyle = "blue";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    console.log('url', url)
    const nftData = new Image();
    const tshirtData = new Image();
    tshirtData.src = tshirt; // Set path to second image

    nftData.onload = () => {
      ctx.drawImage(tshirtData, 0, 0);
      ctx.drawImage(nftData, 190, 150, 130, 130);
    }

    nftData.src = url; // Set path to first image
  }

  return (
      <canvas className={props.className} ref={canvas} width={500} height={500} ></canvas>
  );
}

export function PopShirt(props) {
  return (
    <div className="container">
      <img alt='image1' src={tshirt} className="shirt" />
      <img alt='image1' src={props.url} className='code code-1' />
      <img alt='image1' src={props.url} className='code code-2' />
      <img alt='image1' src={props.url} className='code code-3' />
    </div>
  )
}

export default TShirt;
