import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react'
import { Progress } from 'antd'

function LoadingBar(_, ref) {
  const loadingTimer = useRef(null)

  const [percent, setPercent] = useState<number>(30)
  const [hide, setHide] = useState<boolean>(true)

  function loading() {
    setHide(false)
    setPercent(30)
    loadingTimer.current = setInterval(() => {
      if (percent <= 98) {
        setPercent(percent > 80 ? percent + 1 : percent + 10)
      }
    }, 1000)
  }

  function success() {
    clearInterval(loadingTimer.current)
    setPercent(100)

    setTimeout(() => {
      setHide(true)
    }, 300)
  }

  /**
   * 与 ref 一同使用
   * 第一个参数，接收一个通过forwardRef引用父组件的ref实例，
   * 第二个参数一个回调函数，返回一个对象,对象里面存储需要暴露给父组件的属性或方法
   */
  useImperativeHandle(ref, () => ({
    loading,
    success
  }))

  return !hide ? (
    <Progress
      percent={percent}
      showText={false}
      animation
      style={{ position: 'absolute', height: 2, top: -1, zIndex: 9999 }}
    />
  ) : null
}

export default forwardRef(LoadingBar)
