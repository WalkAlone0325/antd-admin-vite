import defaultSettings from '@/settings.json'
import { SiderTheme } from 'antd/lib/layout/Sider'

const defaultTheme = (localStorage.getItem('antd-theme') as SiderTheme) || 'light'

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
  theme?: SiderTheme
  settings: typeof defaultSettings
  collapsed?: boolean
}

const initialState: GlobalState = {
  theme: defaultTheme,
  settings: defaultSettings,
  collapsed: false
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
      
    case 'toggle-collapsed': {
      const { collapsed } = action.payload
      return {
        ...state,
        collapsed,
      }
    }
    
    default:
      return state
  }
}