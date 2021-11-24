function service($axios, $queryString) {
  return function (name) {
    async function create(data) {
      try {
        const result = await $axios.post(`/api/${name}`, data)
        return result.data
      } catch (ex) {
        return false
      }
    }
    async function get(id) {
      try {
        const result = await $axios.get(`/api/${name}/${id}`)
        return result.data
      } catch (ex) {
        return false
      }
    }
    async function find(query) {
      try {
        const result = await $axios.get(`/api/${name}${$queryString(query)}`)
        return result.data
      } catch (ex) {
        return false
      }
    }
    async function update(id, data) {
      try {
        const result = await $axios.put(`/api/${name}/${id}`, data)
        return result.data
      } catch (ex) {
        return false
      }
    }
    async function remove(id) {
      try {
        const result = await $axios.delete(`/api/${name}/${id}`)
        return result.data
      } catch (ex) {
        return false
      }
    }
    return {
      create,
      get,
      find,
      update,
      remove,
    }
  }
}

export default ({ app }, inject) => {
  inject('service', service(app.$axios, app.$queryString))
}
