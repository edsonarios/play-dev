import { flushSync } from 'react-dom'

export function withViewTransition (action: () => void): void {
  // @ts-expect-error startViewTransition is not supported by all browsers
  document.startViewTransition(async () => {
    flushSync(() => {
      action()
    })
  })
}
