import { Maybe } from './maybe'

export const tryFind = exp => data => Maybe(data.find(exp))