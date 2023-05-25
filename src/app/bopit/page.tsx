'use client';

import {FormEvent, FormEventHandler, useEffect, useRef, useState} from "react";
import styles from './page.module.css';
import {ARTIST, artistFiles} from "@/utils/constants";
import getImageDataFromFile from "@/utils/get-image-data-from-file";
import stylize from "@/utils/stylize";
import getImageDataFromUrl from "@/utils/get-image-data-from-url";
import Link from "next/link";


export default function BopItPage() {
  const artistRef = useRef<any>(); // fix this
  const submitRef = useRef<any>(); // fix this
  const canvasRef = useRef<any>(); // fix this
  const [source, setSource] = useState();
  const [isInputComplete, setIsInputComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const onSourceInput = (e: FormEvent<HTMLInputElement>) => {
    // @ts-ignore // fix this
    if (!e.target.files) {
      return;
    }

    // todo: check for first entry

    // @ts-ignore
    setSource(e.target.files[0]);
    artistRef.current?.scrollIntoView({behavior: 'smooth'});
  }

  // convert this function into a hook
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsProcessing(true);
    setIsInputComplete(true);
    const formData = new FormData(event.currentTarget);
    const artistInput = formData.get('artist') as string;
    const artistImage = await fetch(artistFiles[artistInput]).then((response) => response.blob());

    const {imageData, width, height} = await getImageDataFromFile(source!);

    const result = await stylize({
      image: imageData, // todo
      style: (await getImageDataFromFile(artistImage)).imageData//await getImageDataFromFile(artist!), // todo
    });

    if (!canvasRef.current) {
      console.error('Something went very wrong :( - no canvas found');
      return;
    }
    canvasRef.current.width = width;
    canvasRef.current.height = height;
    canvasRef.current.getContext('2d')?.putImageData(result, 0, 0);

    setIsProcessing(false);
  }

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    function scaleCanvas() {
      var windowWidth = window.innerWidth;
      var windowHeight = window.innerHeight;

      var scaleFactor = Math.min(windowWidth / canvasRef.current.width, windowHeight / canvasRef.current.height);
      canvasRef.current.style.transformOrigin = 'top left';
      canvasRef.current.style.transform = 'scale(' + scaleFactor + ')';
    }

    scaleCanvas();
    window.addEventListener('resize', scaleCanvas);
    return () => window.removeEventListener('resize', scaleCanvas);
  }, [canvasRef]);


  const onClear = () => {
    setIsInputComplete(false);
  }

  if (!isInputComplete) {
    return (
      <main>
        <form className={styles.container} onSubmit={handleSubmit}>
          <div className={styles.segment}>
            <h1 className={styles.sourceHeading}>Pick your source...</h1>
            <div className={styles.fileDrop}>
              <input id="source" name="source" type="file" multiple capture={true} className={styles.files}
                     onInput={onSourceInput}/>
              <img src={source && URL.createObjectURL(source)} alt=""/>
            </div>
          </div>
          <div className={styles.segment} ref={artistRef}>
            <h1 className={styles.artistHeading}>Pick your artist...</h1>
            <div className={styles.fileDrop}>
              <select name="artist" id="artist" onInput={() => submitRef.current?.scrollIntoView({behavior: 'smooth'})}>
                <option value=""></option>
                {Object.values(ARTIST).map((artist) => <option key={artist} value={artist}>{artist}</option>)}
              </select>
            </div>
          </div>
          <div className={styles.segment} ref={submitRef}>
            <div className={styles.featureContainer}>
              <button>artbop it!</button>
            </div>
          </div>
        </form>
      </main>
    )
  }

  return (
    <main className={styles.main}>
      <h1>Your masterpiece!</h1>
      <div className={styles.resultContainer}>
        {isProcessing && <h1>is loading...</h1>}
        <div className={styles.imageHolder}>
          <canvas ref={canvasRef}></canvas>
        </div>
        <div className={styles.buttonContainer}>
          <button onClick={onClear}>start again?</button>
          <Link href={'/'}>go home</Link>
        </div>
      </div>
    </main>
  )
}
