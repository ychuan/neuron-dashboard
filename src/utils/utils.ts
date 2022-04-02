import i18n from '@/i18n/index'
import { ERROR_CODE_ARR } from './constants'
import { utils as XLSXUtils, writeFile } from 'xlsx'

/**
 * when the value is int, can use this func to create option list
 */
export const createOptionListFromEnum = (e: Record<string, any>) => {
  return Object.keys(e)
    .filter((key) => typeof e[key] === 'number')
    .map((key) => ({
      value: e[key],
      label: key,
    }))
}

const firstLowerCase = ([first, ...rest]: string) => first.toLowerCase() + rest.join('')

export const createCommonErrorMessage = (type: 'input' | 'select', target: string) => {
  const {
    global: { tc },
  } = i18n
  const local = i18n.global.locale
  let targetStr = target
  if (local === 'en') {
    targetStr = firstLowerCase(targetStr)
  }
  if (type === 'input') {
    return tc('common.inputRequired') + targetStr
  }
  return tc('common.selectRequired') + targetStr
}

export const paginate = (data: Array<any>, pageSize: number, pageNumber: number) => {
  return data.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
}

export const createRandomString = (length = 6): string => {
  const libLetters = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  const libLettersLength = libLetters.length
  let ret = ''
  for (let i = 0; i < length; i++) {
    ret += libLetters.charAt(Math.floor(Math.random() * libLettersLength))
  }
  return ret
}

export const createMapFromArray = (array: Array<Record<any, any>>, mapKey = 'id') =>
  array.reduce((obj, curr) => {
    obj[curr[mapKey]] = curr
    return obj
  }, Object.create(null))

export const matchObjShape = (obj: Record<string, any>, templateObj: Record<string, any>): boolean => {
  const keysToString = (obj: Record<string, any>) => Object.keys(obj).sort().join(',')
  return keysToString(templateObj) === keysToString(obj)
}

export const getErrorMsg = (errorCode: number): string => {
  const hasErrorMsg = ERROR_CODE_ARR.includes(errorCode)
  return hasErrorMsg ? i18n.global.t(`error.${errorCode}`) : 'unknown'
}

export const exportExcelData = (content: Array<any>, fileName: string) => {
  return new Promise((resolve, reject) => {
    try {
      const ws = XLSXUtils.aoa_to_sheet(content)
      const wb = XLSXUtils.book_new()
      XLSXUtils.book_append_sheet(wb, ws, 'SheetJS')
      /* generate file and send to client */
      writeFile(wb, `${fileName}.xlsx`)
      resolve(true)
    } catch (error) {
      reject(error)
    }
  })
}

export const jumpToFirstErrorFormItem = (): void => {
  const el = document.querySelector('.el-form-item.is-error')
  if (el) {
    el.scrollIntoView()
    window.scrollBy(0, -100)
  }
}
