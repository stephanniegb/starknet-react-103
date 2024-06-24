export type BigNumberish = string | number | bigint;

export type ByteArray = {
  data: BigNumberish[];
  pending_word: BigNumberish;
  pending_word_len: BigNumberish;
};
