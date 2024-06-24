export const useStringFromByteArray = ({
  pending_word,
}: {
  pending_word: BigInt;
}) => {
  let hexString;

  hexString = pending_word.toString(16);

  // Check if hexString length is even

  if (hexString.length % 2 !== 0) {
    console.log("Hex string must have an even length");
  }
  // Convert hexString to Uint8Array
  const unit8arr = new Uint8Array(hexString.length / 2);
  for (let i = 0; i < hexString.length; i += 2) {
    unit8arr[i / 2] = parseInt(hexString.slice(i, i + 2), 16);
  }

  // Decode Uint8Array to string
  const decoder = new TextDecoder("utf-8");
  const decodedString = decoder.decode(unit8arr);

  return decodedString;
};
