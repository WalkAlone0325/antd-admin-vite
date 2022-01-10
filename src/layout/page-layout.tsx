import { Layout, Menu } from 'antd'
import { lazy, Suspense, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { ReducerState } from '@/redux'
import { isArray } from '@/utils/is'
import lazyload from '@/utils/lazyload'
import { routes, defaultRoute, IRouteConfig } from '@/routes'
import styles from './style/layout.module.less'
import { Link, Redirect, Route, Switch } from 'react-router-dom'
import Login from '@/pages/login'

const { Sider, Content } = Layout
// const { SubMenu, Item: MenuItem } = Menu
const MenuItem = Menu.Item
const SubMenu = Menu.SubMenu

/**
 * 扁平路由
 * @returns routes: IRouteConfig[]
 */
function getFlattenRoutes() {
  const res: IRouteConfig[] = []

  function travel(_routes: IRouteConfig[]) {
    console.log(_routes)
    _routes.forEach((route) => {
      console.log(route)
      if (route.componentPath) {
        route.component = lazy(() => import(`../pages/${route.componentPath}`))
        // route.component = import(`../pages/${route.componentPath}`)
        // route.component = Login
        res.push(route)
      } else if (isArray(route.children) && route.children?.length) {
        travel(route.children)
      }
    })
  }
  travel(routes)
  console.log(res)
  return res
}

function renderRoutes() {
  const nodes: JSX.Element[] = []

  function travel(_routes: IRouteConfig[], level: number) {
    return _routes.map((route) => {
      const titleDom = <>{route.name}</>

      if (
        route.component &&
        (!isArray(route.children) ||
          (isArray(route.children) && !route.children?.length))
      ) {
        if (level > 1) {
          return (
            <MenuItem key={route.key} icon={route.icon}>
              <Link to={`/${route.key}`}>{titleDom}</Link>
            </MenuItem>
          )
        }
        nodes.push(
          <MenuItem key={route.key} icon={route.icon}>
            <Link to={`/${route.key}`}>{titleDom}</Link>
          </MenuItem>
        )
      }
      if (isArray(route.children) && route.children?.length) {
        if (level > 1) {
          return (
            <SubMenu key={route.key} icon={route.icon} title={titleDom}>
              {travel(route.children, level + 1)}
            </SubMenu>
          )
        }
        nodes.push(
          <SubMenu key={route.key} icon={route.icon} title={titleDom}>
            {travel(route.children, level + 1)}
          </SubMenu>
        )
      }
    })
  }
  travel(routes, 1)
  console.log(nodes)
  return nodes
}

function PageLayout() {
  const defaultSelectedKeys = [defaultRoute]

  const settings = useSelector((state: ReducerState) => state.global.settings)

  const [collapsed, setCollapsed] = useState<boolean>(false)
  const [selectedKeys, setSelectedKeys] =
    useState<string[]>(defaultSelectedKeys)

  const navbarHeight = 60
  const menuWidth = collapsed ? 48 : settings.menuWidth

  const showNavbar = settings.navbar
  const showMenu = settings.menu
  const showFooter = settings.footer

  const flattenRoutes = useMemo(() => getFlattenRoutes() || [], [])

  function toggleCollapse() {
    setCollapsed((collapsed) => !collapsed)
  }

  const paddingTop = showNavbar ? { paddingTop: navbarHeight } : {}

  return (
    <Layout className={styles.layout}>
      <Layout>
        {showMenu && (
          <Sider
            className={styles.layoutSider}
            width={menuWidth}
            collapsed={collapsed}
            onCollapse={setCollapsed}
            trigger={null}
            collapsible
            breakpoint="xl"
            style={paddingTop}
          >
            <div className={styles.menuWrapper}>
              <Menu selectedKeys={selectedKeys} mode="inline">
                {renderRoutes()}
              </Menu>
            </div>
            <div className={styles.collapseBtn} onClick={toggleCollapse}>
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </div>
          </Sider>
        )}
        <Layout className={styles.layoutContent}>
          <Content>
            <Suspense fallback>
              <Switch>
                {flattenRoutes.map((route, index) => {
                  return (
                    <Route
                      key={index}
                      path={`/${route.key}`}
                      component={route.component}
                    />
                  )
                })}
                <Redirect push to={`${defaultRoute}`} />
              </Switch>
            </Suspense>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default PageLayout
