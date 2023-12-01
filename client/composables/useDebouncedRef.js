import { customRef } from 'vue'

export function useDebouncedRef(value, delay = 200) {
  let timeout
  return customRef((track, trigger) => {
    return {
      get() {
        track()
        return value
      },
      set(newValue) {
        clearTimeout(timeout)

        // if(newValue){
          timeout = setTimeout(() => {
              value = newValue
            trigger()
          }, delay)
        // }
        // else {
        //    value = ''
        // }
      }
    }
  })
}