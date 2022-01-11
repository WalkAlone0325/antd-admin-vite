import { Layout, Menu } from 'antd'
import { lazy, Suspense, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { ReducerState } from '@/redux'
import { isArray } from '@/utils/is'
import lazyload from '@/utils/lazyload'
import { routes, defaultRoute, IRouteConfig } from '@/routes'
import styles from './style/layout.module.less'
import { Link, Redirect, Route, Switch } from 'react-router-dom'
import Login from '@/pages/login'
import history from '@/history'
import Navbar from '@/components/NavBar'
import LoadingBar from '@/components/LoadingBar'

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
    _routes.forEach((route) => {
      if (route.componentPath) {
        route.component = lazy(() => import(`../pages/${route.componentPath}`))
        res.push(route)
      } else if (isArray(route.children) && route.children?.length) {
        travel(route.children)
      }
    })
  }
  travel(routes)
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
  return nodes
}

function PageLayout() {
  const defaultSelectedKeys = [defaultRoute]

  const dispatch = useDispatch()
  const settings = useSelector((state: ReducerState) => state.global.settings)
  const collapsed = useSelector((state: ReducerState) => state.global.collapsed)
  const themeStyle = useSelector((state: ReducerState) => state.global.theme!)

  // const [collapsed, setCollapsed] = useState<boolean>(false)
  const [selectedKeys, setSelectedKeys] =
    useState<string[]>(defaultSelectedKeys)

  const navbarHeight = 60
  const menuWidth = collapsed ? 48 : settings.menuWidth

  const showNavbar = settings.navbar
  const showMenu = settings.menu
  const showFooter = settings.footer

  const flattenRoutes = useMemo(() => getFlattenRoutes() || [], [])

  function toggleCollapse() {
    // setCollapsed((collapsed) => !collapsed)
    dispatch({
      type: 'toggle-collapsed',
      payload: { collapsed: !collapsed }
    })
  }

  function handleClick({ key }: { key: string }) {
    // const currentRoute = flattenRoutes.find(r => r.key === key)
    // const component = currentRoute?.component
    setSelectedKeys([key])
    // history.push(currentRoute?.key ? currentRoute.key : `/${key}`)
    // const preload = component.preload()
    // preload.then(() => {
    //   setSelectedKeys([key])
    //   history.push(currentRoute.path ? currentRoute.path : `/${key}`)
    // })
  }

  // const paddingLeft = showMenu ? { paddingLeft: menuWidth } : {}
  const paddingLeft = showMenu ? { paddingLeft: 14 } : {}
  const paddingTop = showNavbar ? { paddingTop: navbarHeight } : {}
  const paddingStyle = { ...paddingLeft, ...paddingTop }

  return (
    <Layout className={styles.layout}>
      {showNavbar && (
        <div className={styles.layoutNavbar}>
          <Navbar collapsed={collapsed} themeStyle={themeStyle} />
        </div>
      )}
      <Layout>
        {showMenu && (
          <Sider
            theme={themeStyle}
            className={styles.layoutSider}
            width={menuWidth}
            collapsed={collapsed}
            onCollapse={toggleCollapse}
            trigger={null}
            collapsible
            breakpoint="xl"
            style={paddingTop}
          >
            <div className={styles.menuWrapper}>
              <Menu
                theme={themeStyle}
                selectedKeys={selectedKeys}
                mode="inline"
                onClick={handleClick}
              >
                {renderRoutes()}
              </Menu>
            </div>
            <div className={styles.collapseBtn} onClick={toggleCollapse}>
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </div>
          </Sider>
        )}
        <Layout className={styles.layoutContent} style={paddingStyle}>
          <Content>
            <Suspense fallback={<LoadingBar />}>
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
          {/* {showFooter && <Footer />} */}
          {showFooter && 123}
        </Layout>
      </Layout>
    </Layout>
  )
}

export default PageLayout
