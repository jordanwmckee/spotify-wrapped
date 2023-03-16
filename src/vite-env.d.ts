/// <reference types="vite/client" />

// Object types to store api request results

/**
 * Object for spotify tokens in sessionStorage
 */
interface Token {
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
}

//----------------------
// PROPS INTERFACES

interface NavBarProps {
  displayName?: string;
  profilePic?: string;
}

interface PlayerProps {
  userPlaylists?: Playlists[];
}

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

interface PageTitleProps {
  title: string;
  description?: string;
}

interface HomeTitleProps extends PageTitleProps {
  subheading?: boolean;
}

interface TopCardProps {
  list: TopItems[];
  title: string;
}

interface TitleCardProps extends PageTitleProps {}

interface FloatingCardProps {
  data: any;
  title: any;
}
