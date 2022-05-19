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
    }
  },
  setLg: () => {},
});

export default TempStore
