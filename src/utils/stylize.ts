import * as mi from '@magenta/image';

type Props = {
  image: ImageData,
  style: ImageData,
}

const model = new mi.ArbitraryStyleTransferNetwork();
export default async function stylize({image, style}: Props): Promise<ImageData> {
  console.log(image, style);
  await model.initialize();
  return model.stylize(image, style);
}
