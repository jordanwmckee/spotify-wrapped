/// <reference types="vite/client" />

// Object types to store api request results

/**
 * Object for spotify tokens in sessionStorage
 */
interface Token {
  refresh_token?: string;
  access_token?: string;
  time_created?: number;
}

/**
 * Stores results from getTopItems
 */
interface TopItems {
  name: string;
  image: string;
  uri: string;
  id: string;
  artist?: SpotifyApi.ArtistObjectSimplified[];
}

/**
 * Stores results from getListens
 */
interface Listens {
  id: string;
  name: string;
  artist: SpotifyApi.ArtistObjectSimplified[];
}

/**
 * User playlists store
 */
interface Playlist {
  name: string;
  uri: string;
  id: string;
}

/**
 * Recommended items for artists or tracks
 */
interface RecommendedItems {
  name: string;
  image: string;
  uri: string;
  id: string;
  following?: boolean;
}

interface FloatingCardProps {
  data: {
    name: string;
    count: number;
  }[];
  title: string;
}

//----------------------
// PROPS INTERFACES

// Components
interface NavBarProps {
  displayName?: string;
  profilePic?: string;
}

interface PlayerProps {
  userPlaylists?: Playlist[];
}

interface PageTitleProps {
  title: string;
  description?: string;
}

interface HomeTitleProps extends PageTitleProps {
  subheading?: boolean;
}

// Cards
interface TitleCardProps extends PageTitleProps {}

interface TopCardProps {
  title: string;
  list: TopItems[];
  userId?: string;
  playlists?: Playlist[];
  timeFrame: 'month' | 'all-time' | 'recommended';
}

interface RecommendedCardProps {
  title: string;
  list: RecommendedItems[];
  userPlaylists: Playlist[];
  type: 'artists' | 'tracks';
  length: number;
  userId?: string;
}

interface AddSongDropdownProps extends PlayerProps {
  uri: string;
  id: string;
}

interface CreatePlaylistButtonProps {
  list?: TopItems[];
  playlists?: Playlist[];
  userId?: string;
  type: 'month' | 'all-time' | 'recommended';
}

// Pages
interface DashboardProps {
  displayName?: string;
  monthlyArtists?: TopItems[];
  monthlySongs?: TopItems[];
  allTimeArtists?: TopItems[];
  allTimeSongs?: TopItems[];
  userId?: string;
  playlists?: Playlist[];
}

interface AnalyticsProps {
  monthlySongs?: TopItems[];
  monthlyGenres?: string[][];
  allTimeSongs?: TopItems[];
  allTimeGenres?: string[][];
}

interface DiscoverProps {
  recommendedArtists?: RecommendedItems[];
  recommendedSongs?: RecommendedItems[];
  userPlaylists?: Playlist[];
  userId?: string;
}
