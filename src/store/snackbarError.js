export const state = () => ({
    content: '',
    color: ''
})

export const mutations = {
    showError (state, payload) {
        state.content = payload.content
        state.color = payload.color
    },
}