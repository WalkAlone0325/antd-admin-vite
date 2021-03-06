import {
  WindowsOutlined,
  AppleOutlined,
  SearchOutlined
} from '@ant-design/icons'
import { LazyExoticComponent } from 'react'

export interface IRouteConfig {
  name: string
  key: string
  icon?: JSX.Element
  component?: LazyExoticComponent<any>
  componentPath?: string
  children?: IRouteConfig[]
}

export const defaultRoute = 'welcome'

export const routes: IRouteConfig[] = [
  {
    name: '欢迎',
    key: 'welcome',
    icon: <WindowsOutlined />,
    componentPath: 'welcome'
  },
  {
    name: '列表',
    key: 'list',
    icon: <AppleOutlined />,
    children: [
      {
        name: '搜索',
        key: 'list/search-table',
        icon: <SearchOutlined />,
        componentPath: 'search-table'
      }
    ]
  }
]
