import defaultSettings from '@/settings.json'

const defaultTheme = localStorage.getItem('antd-theme') || 'light'

function changeTheme(newTheme?: 'string') {
  if ((newTheme || defaultTheme) === 'dark') {
    document.body.setAttribute('antd-theme', 'dark')
  } else {
    document.body.removeAttribute('antd-theme')
  }
}

// init
changeTheme()

export interface GlobalState {
  theme?: string
  settings: typeof defaultSettings
}

const initialState: GlobalState = {
  theme: defaultTheme,
  settings: defaultSettings
}

export default function (state = initialState, action) {
  switch (action.type){
    case 'toggle-theme': {
      const { theme } = action.payload

      if (theme === 'light' || theme === 'dark') {
        localStorage.setItem('antd-theme', theme)
        changeTheme(theme)
      }
      return {
        ...state,
        theme,
      }
    }
      
    case 'update-settings': {
      const { settings } = action.payload
      return {
        ...state,
        settings
      }
    }
    
    default:
      return state
  }
}