import BaseService from './BaseService'
import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

type CacheEntry = {
    response: AxiosResponse
    timestamp: number
}

const cacheStore: Record<string, CacheEntry> = {}

const ApiService = {
    fetchData<Response = unknown, Request = Record<string, unknown>>(
        param: AxiosRequestConfig<Request>,
        cacheDuration?: number // in milliseconds
    ) {
        const cacheKey = this.generateCacheKey(param)

        return new Promise<AxiosResponse<Response>>((resolve, reject) => {
            if (cacheKey && cacheStore[cacheKey]) {
                const cachedEntry = cacheStore[cacheKey]
                const isCacheValid = Date.now() - cachedEntry.timestamp < (cacheDuration || 0)

                if (isCacheValid) {
                    resolve(cachedEntry.response as AxiosResponse<Response>)
                    return
                } else {
                    delete cacheStore[cacheKey]
                }
            }

            BaseService(param)
                .then((response: AxiosResponse<Response>) => {
                    if (cacheKey && cacheDuration) {
                        cacheStore[cacheKey] = {
                            response,
                            timestamp: Date.now()
                        }
                    }
                    resolve(response)
                })
                .catch((errors: AxiosError) => {
                    reject(errors)
                })
        })
    },

    generateCacheKey<Request>(param: AxiosRequestConfig<Request>): string {
        const { url, method, params } = param
        return `${method || 'get'}:${url}:${JSON.stringify(params || {})}`
    },
}

export default ApiService
