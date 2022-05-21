import { createContext} from 'react'

const TempStore = createContext({
  perfil: {icon: '', name: ''},
  setPerfil: () => {},
  profilesAvailables: [],
  setProfilesAvailables: () => {},
  lg: {
    "bottomIcons": {
      "home": "Home",
      "search": "Search",
      "downloads": "Downloads",
      "menu": "Menu",
      "soon": "News"
    },
    "headerHome":{
      "series": "Series",
      "movies": "Movies",
      "category": "Categories"
    },
    "buttonsInteractive": {
      "myList": "My List",
      "myAccount": "My Account",
      "logout": "Logout",
      "login": "Login",
      "register": "Register",
      "more": "More",
      "watch": "Watch",
      "knowMore": "Know More"
    },
    "blockTitle": {
      "keepWatching": "Keep Watching",
      "myList": "My List",
      "recommended": "Recommended",
      "top10": "Top 10"
    },
    "settings": {
      "editiPerfil": "Manage Profiles",
      "edit": "Edit"
    },
    "pageTitles": {
      "camera": "Camera",
      "home": "Home",
      "search": "Search",
      "downloads": "Downloads",
      "menu": "Menu",
      "soon": "News"
    },
    "genreFilters": {
      "Home": "Home",
      "My List":  "My List",
      "Action":  "Action",
      "Adventure":  "Adventure",
      "Animation":  "Animation",
      "Biography":  "Biography",
      "Comedy":  "Comedy",
      "Crime":  "Crime",
      "Documentary":  "Documentary",
      "Drama":  "Drama",
      "Fantasy":  "Fantasy",
      "History":  "History",
      "Horror":  "Horror",
      "Mystery":  "Mystery",
      "Romance":  "Romance",
      "Short":  "Short",
      "Sci-Fi":  "Sci-Fi",
      "Thriller": "Thriller"
    },
    "searchTitle": {
      "allList": "All Searches",
      "filtered": "Movies and Series"
    }
  },
  setLg: () => {},
});

export default TempStore
