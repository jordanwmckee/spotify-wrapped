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
  uri?: string;
  id?: string;
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
 *
 */
interface Genres {}

/**
 * User playlists store
 */
interface Playlists {
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

//----------------------
// PROPS INTERFACES

// Components
interface NavBarProps {
  displayName?: string;
  profilePic?: string;
}

interface PlayerProps {
  userPlaylists?: Playlists[];
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
}

interface FloatingCardProps {
  data: any;
  title: any;
}

interface RecommendedCardProps {
  title: string;
  list: RecommendedItems[];
  userPlaylists: Playlists[];
  type: 'artists' | 'tracks';
  length: number;
}

interface AddSongDropdownProps extends PlayerProps {
  uri: string;
  id: string;
}

// Pages
interface DashboardProps {
  displayName?: string;
  monthlyArtists?: TopItems[];
  monthlySongs?: TopItems[];
  allTimeArtists?: TopItems[];
  allTimeSongs?: TopItems[];
}

interface AnalyticsProps {
  recentListens?: Listens[];
  recentGenres?: object[];
  monthlyListens?: Listens[];
  monthlyGenres?: object[];
  allTimeListens?: Listens[];
  allTimeGenres?: object[];
}

interface DiscoverProps {
  recommendedArtists?: RecommendedItems[];
  recommendedSongs?: RecommendedItems[];
  userPlaylists?: Playlists[];
}
