export type PostLikeResponse = {
  message: string;
};

export type LikeState = {
  loading: boolean;
  error: string | null;
  message: string | null;
};

export type AsyncThunkConfig<Return, Arg, Reject = string> = {
  returnType: Return;
  argument: Arg;
  rejectValue: Reject;
};
