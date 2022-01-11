import { Button, Image, Select, Space, Tooltip, Typography } from 'antd'
import styles from './style/index.module.less'
import logo from '@/assets/images/logo.svg'
import { SiderTheme } from 'antd/lib/layout/Sider'
import { FilterFilled, FunnelPlotFilled } from '@ant-design/icons'
import { useDispatch } from 'react-redux'

interface IProps {
  collapsed: boolean | undefined
  themeStyle: SiderTheme
}

function NavBar(props: IProps) {
  const dispatch = useDispatch()

  return (
    <div className={styles.navbar}>
      <div className={styles.left}>
        <Space size={8}>
          {/* <Logo /> */}
          <Image
            src={logo}
            preview={false}
            style={{ width: 30, height: 30, margin: '0 auto' }}
          />

          {!props.collapsed && (
            <Typography.Title
              style={{ margin: 0, fontSize: 18, color: '#fff' }}
            >
              Antd Admin
            </Typography.Title>
          )}
        </Space>
      </div>

      <ul className={styles.right}>
        <li></li>
        <li>
          <a href="">123</a>
        </li>
        <li>
          <Select></Select>
        </li>
        <li>
          <Tooltip
            placement="bottom"
            title={props.themeStyle === 'light' ? '亮色' : '暗色'}
          >
            <Button
              type="text"
              icon={
                props.themeStyle === 'light' ? (
                  <FilterFilled />
                ) : (
                  <FunnelPlotFilled />
                )
              }
              onClick={() =>
                dispatch({
                  type: 'toggle-theme',
                  payload: {
                    theme: props.themeStyle === 'light' ? 'dark' : 'light'
                  }
                })
              }
              style={{ fontSize: '30px' }}
              size="large"
            />
          </Tooltip>
        </li>
      </ul>
    </div>
  )
}

export default NavBar
