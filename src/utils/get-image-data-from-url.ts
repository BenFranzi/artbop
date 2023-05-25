export default async function getImageDataFromUrl(url: string): Promise<File> {
  let response = await fetch(url);
  let data = await response.blob();
  return new File([data], 'artist');
}
