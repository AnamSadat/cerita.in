export type Like = {
  id: number;
  user_id: number;
  story_id: number;
};

export type PostLikeResponse = {
  message: string;
  data: Like;
};

export type LikeState = {
  loading: boolean;
  error: string | null;
  message: string | null;
  likeId: Like | null;
};

export type AsyncThunkConfig<Return, Arg, Reject = string> = {
  returnType: Return;
  argument: Arg;
  rejectValue: Reject;
};

export type BookmarkSliceState = {
  loading: boolean;
  success: boolean;
  error: string | null;
  bookmarks: [];
};
