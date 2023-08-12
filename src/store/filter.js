export const state = () => ({
    filters: {
        username: null,
        status: null,
        geo: null,
        brand: null,
        archive: null
    },
})

export const mutations = {
    setUserNameFilters(state, payload) {
        state.filters = {
            ...state.filters,
            ...payload
        }
    },
    setStatusFilters(state, status) {
        state.filters = {
            ...state.filters,
            ...status
        }
    },
    setGeoFilters(state, geo) {
        state.filters = {
            ...state.filters,
            ...geo
        }
    },
    setBrandFilters(state, brand) {
        state.filters = {
            ...state.filters,
            ...brand
        }
    },
    setArchiveFilters(state, archive) {
        state.filters = {
            ...state.filters,
            ...archive
        }
    },
}

export const actions = {
    saveFilter({ commit, state }, payload) {
        commit('setUserNameFilters', payload)
        localStorage?.setItem('filters', JSON.stringify(state.filters));
    },
    loadFilter({ commit }) {
        const usernameFilters = localStorage?.getItem('filters')
        if (!usernameFilters) {
            return
        }
        commit('setUserNameFilters', JSON.parse(usernameFilters))
    },
    saveStatusFilter({ commit, state }, status) {
        commit('setStatusFilters', status)
        localStorage?.setItem('filters', JSON.stringify(state.filters));
    },
    loadStatusFilter({ commit }) {
        const statusFilters = localStorage?.getItem('filters')
        if (!statusFilters) {
            return
        }
        commit('setStatusFilters', JSON.parse(statusFilters))
    },
    saveGeoFilter({ commit, state }, geo) {
        commit('setGeoFilters', geo)
        localStorage?.setItem('filters', JSON.stringify(state.filters));
    },
    loadGeoFilter({ commit }) {
        const geoFilters = localStorage?.getItem('filters')
        if (!geoFilters) {
            return
        }
        commit('setGeoFilters', JSON.parse(geoFilters))
    },
    saveBrandFilter({ commit, state }, brand) {
        commit('setBrandFilters', brand)
        localStorage?.setItem('filters', JSON.stringify(state.filters));
    },
    loadBrandFilter({ commit }) {
        const brandFilters = localStorage?.getItem('filters')
        if (!brandFilters) {
            return
        }
        commit('setBrandFilters', JSON.parse(brandFilters))
    },
    saveArchiveFilter({ commit, state }, archive) {
        commit('setArchiveFilters', archive)
        localStorage?.setItem('filters', JSON.stringify(state.filters));
    },
    loadArchiveFilter({ commit }) {
        const archiveFilters = localStorage?.getItem('filters')
        if (!archiveFilters) {
            return
        }
        commit('setArchiveFilters', JSON.parse(archiveFilters))
    }
}
