export default ({ app, store }, inject) => {
    inject('notifier', {
        showMessage ({ content = '', color = '' }) {
            store.commit('snackbar/showMessage', { content, color })
        },
        closeMessage () {
            store.commit('snackbar/closeMessage')
        },
        successMessage () {
            store.commit('snackbar/successMessage')
        },
        showError ({ content = '', color = '' }) {
            store.commit('snackbarError/showError', { content, color })
        },
    })
}