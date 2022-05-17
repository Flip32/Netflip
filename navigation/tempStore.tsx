import { createContext} from 'react'

const TempStore = createContext({perfil: { icon: '', name: ''}, setPerfil: () => {}, profilesAvailables:[], setProfilesAvailables: () => {} });

export default TempStore
