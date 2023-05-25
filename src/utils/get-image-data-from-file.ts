export default function getImageDataFromFile(inputFile: File | Blob): Promise<{ imageData: ImageData, width: number, height: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function(event) {
      const img = new Image();

      img.onload = async function() {
        const bitmap = await createImageBitmap(img);
        const offscreenCanvas = new OffscreenCanvas(bitmap.width, bitmap.height);
        const ctx = offscreenCanvas.getContext('2d')!;


        ctx.drawImage(bitmap, 0, 0);

        const imageData = ctx.getImageData(0, 0, offscreenCanvas.width, offscreenCanvas.height);

        resolve({ imageData, width: bitmap.width, height: bitmap.height });
      };

      img.onerror = function(error) {
        reject(error);
      };

      // @ts-ignore // Fix this
      img.src = event.target.result;
    };

    reader.onerror = function(error) {
      reject(error);
    };

    reader.readAsDataURL(inputFile);
  });
}
