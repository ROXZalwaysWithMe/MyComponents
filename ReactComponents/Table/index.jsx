import { createContext } from 'react'
import Table from './Table'
import Column from './Column'

const Context = createContext() // { field: [...options] }

export { Table, Column, Context }