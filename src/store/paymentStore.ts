import axios from 'axios'

const MESH_API = process.env.VUE_APP_API_MESH

const paymentStore = {
  namespaced: true,
  state: {
    invoice: null
  },
  getters: {
  },
  mutations: {
    setInvoice (state, invoice) {
      state.invoice = invoice
    }
  },
  actions: {
    fetchPayment ({ commit }: any) {
      return new Promise((resolve, reject) => {
        const payment = {
          amount: 20,
          description: 'test payment',
          routeHint: true
        }
        axios.post(MESH_API + '/v2/fetchPayment', payment).then((response) => {
          commit('setInvoice', response.data)
          resolve(response.data)
        }).catch((error) => {
          reject(error)
        })
      })
    }
  }
}
export default paymentStore
