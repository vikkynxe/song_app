export interface Song {
  track_hash: string;
  track_name: string;
  artist_names: string;
  album_name: string;
  duration_ms: number;
  popularity?: number;
  genres?: string;
  record_label?: string;
}

export interface Playlist {
  hash: string;
  name: string;
  tracks: number;
  type?: string;
}

export interface GetPlaylistsResponse {
  hash?: string[];
  name?: string[];
  tracks?: number[];
  playlists?: Playlist[];
}

export interface GetSongsResponse {
  resut?: Song[];
  result?: Song[];
  data?: Song[];
  songs?: Song[];
}

export interface SignInResponse {
  token?: string;
  hash?: string;
  user_name?: string;
  username?: string;
  message?: string;
  status?: string | number;
}

export interface CreateUserResponse {
  status?: string | number;
  message?: string;
  token?: string;
}

export interface CreatePlaylistResponse {
  status?: string | number;
  message?: string;
  hash_id?: string;
  playlist_name?: string;
}
